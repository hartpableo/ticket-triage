<?php

namespace App\Controller;

use App\Entity\Attachment;
use App\Entity\Comment;
use App\Entity\Ticket;
use App\Enum\CommentTypeEnum;
use App\Enum\TicketStatusEnum;
use App\Form\CommentType;
use App\Form\TicketsFilterType;
use App\Form\TicketSettingsType;
use App\Form\TicketType;
use App\Repository\CommentRepository;
use App\Repository\TicketRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

final class TicketController extends DashboardController {

    #[Route('/dashboard/tickets', name: 'app_tickets')]
    public function ticketsIndex(
        Request                $request,
        EntityManagerInterface $entityManager,
        TicketRepository       $ticketRepository,
        PaginatorInterface     $paginator
    ): Response {
        // Create ticket form
        $ticket = new Ticket();
        $createTicketForm = $this->createForm(TicketType::class, $ticket);
        $createTicketForm->handleRequest($request);

        if ($createTicketForm->isSubmitted() && $createTicketForm->isValid()) {
            // Set default status to Open
            $ticket->setStatus(TicketStatusEnum::Open);

            // Generate a temporary code before persisting to database
            $ticket->setCode('TKT-TEMP-' . uniqid());

            $entityManager->persist($ticket);
            $entityManager->flush();

            // Generate final code based on the auto-incremented database ID
            $ticket->setCode(Ticket::$codePrefix . (100 + $ticket->getId()));
            $entityManager->flush();

            $this->addFlash('success', 'Ticket created successfully!');
            return $this->redirectToRoute('app_tickets');
        }

        // Return 422 Unprocessable Entity status if the form has validation errors
        $responseStatus = ($createTicketForm->isSubmitted() && !$createTicketForm->isValid())
            ? Response::HTTP_UNPROCESSABLE_ENTITY
            : Response::HTTP_OK;

        $ticketsNumbersData = [
            'total' => $ticketRepository->count([]),
            'open' => $ticketRepository->count([
                'status' => TicketStatusEnum::Open,
            ]),
            'pending' => $ticketRepository->count([
                'status' => TicketStatusEnum::WaitingOnClient
            ]),
            'resolved' => $ticketRepository->count([
                'status' => TicketStatusEnum::Resolved
            ])
        ];

        // Filter tickets form
        $filterTicketsForm = $this->createForm(TicketsFilterType::class);
        $filterTicketsForm->handleRequest($request);

        $qb = $ticketRepository->createQueryBuilder('t')
            ->orderBy('t.created_at', 'DESC');

        if ($filterTicketsForm->isSubmitted() && $filterTicketsForm->isValid()) {
            $filterData = $filterTicketsForm->getData();

            if ($filterData->getTitle()) {
                $qb->andWhere('t.title LIKE :title')
                    ->setParameter('title', '%' . $filterData->getTitle() . '%');
            }
            if ($filterData->getClient()) {
                $qb->andWhere('t.client = :client')
                    ->setParameter('client', $filterData->getClient());
            }
            if ($filterData->getStatus()) {
                $qb->andWhere('t.status = :status')
                    ->setParameter('status', $filterData->getStatus());
            }
            if ($filterData->getPriority()) {
                $qb->andWhere('t.priority = :priority')
                    ->setParameter('priority', $filterData->getPriority());
            }
            if ($filterData->getCategory()) {
                $qb->andWhere('t.category = :category')
                    ->setParameter('category', $filterData->getCategory());
            }
            if ($filterData->getAssignedAgent()) {
                $qb->andWhere('t.assigned_agent = :assigned_agent')
                    ->setParameter('assigned_agent', $filterData->getAssignedAgent());
            }
        }

        $tickets = $paginator->paginate(
            $qb,
            $request->query->getInt('page', 1),
            15
        );

        return $this->render('ticket/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'filter_form' => $filterTicketsForm->createView(),
                'create_ticket_form' => $createTicketForm->createView(),
                'tickets_data' => $ticketsNumbersData,
                'tickets' => $tickets,
            ]
        ), new Response(NULL, $responseStatus));
    }

    #[Route('/dashboard/tickets/{code}', name: 'app_ticket_detail')]
    public function detail(
        string                 $code,
        Request                $request,
        EntityManagerInterface $entityManager,
        SluggerInterface       $slugger,
        Security               $security,
        CommentRepository      $commentRepository,
    ): Response {
        $ticket = $entityManager->getRepository(Ticket::class)->findOneBy(['code' => strtoupper($code)]);
        if (!$ticket) {
            throw $this->createNotFoundException('Ticket not found.');
        }

        // Update ticket settings form
        $updateTicketForm = $this->createForm(TicketSettingsType::class, $ticket);
        $updateTicketForm->handleRequest($request);
        if ($updateTicketForm->isSubmitted() && $updateTicketForm->isValid()) {
            $entityManager->flush();
            $this->addFlash(
                'success',
                \sprintf('Ticket "%s" updated successfully!', $ticket->getCode())
            );
            return $this->redirectToRoute('app_ticket_detail', [
                'code' => strtolower($ticket->getCode())
            ]);
        }

        // Comment form
        $comment = new Comment();
        $commentForm = $this->createForm(CommentType::class, $comment);
        $commentForm->handleRequest($request);
        if ($commentForm->isSubmitted() && $commentForm->isValid()) {
            /**
             * Handle the persistence of uploaded media files
             * - Save the file locally
             * - Save the file as an attachment entity
             * - Assign the new attachment to the comment
             */
            $attachments = $commentForm->get('attachments')->getData();
            $movedFiles = [];
            $uploadError = NULL;

            if (!empty($attachments)) {
                foreach ($attachments as $attachment) {
                    $originalFilename = pathinfo($attachment->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $attachment->guessExtension();
                    $targetPath = $this->getParameter('attachments_directory') . '/' . $newFilename;
                    $mimeType = $attachment->getMimeType() ?? 'application/octet-stream';

                    // Move the file to the directory where brochures are stored
                    try {
                        $attachment->move($this->getParameter('attachments_directory'), $newFilename);
                        $movedFiles[] = $targetPath;
                    } catch (FileException $e) {
                        $uploadError = $e->getMessage();
                        break;
                    }

                    // Persist attachment entity
                    $attachmentEntity = new Attachment();
                    $attachmentEntity->setFileName($newFilename);
                    $attachmentEntity->setFileType($mimeType);
                    $attachmentEntity->setFilePath($targetPath);
                    $attachmentEntity->setTicket($ticket);
                    $attachmentEntity->setComment($comment);
                    $entityManager->persist($attachmentEntity);

                    // Add attachment to the comment
                    $comment->addAttachment($attachmentEntity);
                }
            }

            if ($uploadError !== NULL) {
                foreach ($movedFiles as $fileToCleanup) {
                    if (file_exists($fileToCleanup)) {
                        @unlink($fileToCleanup);
                    }
                }
                $commentForm->addError(new FormError('Could not upload photo: ' . $uploadError));
            }
            else {
                // Handle comment type (whether internal or system)
                $isInternal = $commentForm->get('type')->getData();
                $comment->setType(
                    $isInternal ? CommentTypeEnum::Internal : CommentTypeEnum::System
                );

                $entityManager->persist($comment);
                $entityManager->flush();
                $this->addFlash('success', 'Comment has been posted');
                return $this->redirectToRoute('app_ticket_detail', [
                    'code' => strtolower($ticket->getCode())
                ]);
            }
        }

        // Get the comments of the current ticket
        $comments = [];
        if (in_array('ROLE_CLIENT', $security->getUser()->getRoles())) {
            $comments = $commentRepository->findAllForClientView();
        }
        else {
            $comments = $ticket->getComments();
        }

        // Return 422 Unprocessable Entity status if the form has validation errors
        $responseStatus =
            ($updateTicketForm->isSubmitted() && !$updateTicketForm->isValid())
            || ($commentForm->isSubmitted() && !$commentForm->isValid())
                ? Response::HTTP_UNPROCESSABLE_ENTITY
                : Response::HTTP_OK;

        return $this->render('ticket/detail.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'ticket' => $ticket,
                'update_ticket_form' => $updateTicketForm->createView(),
                'comment_form' => $commentForm->createView(),
                'comments' => $comments,
            ]
        ), new Response(NULL, $responseStatus));
    }
}
