<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Enum\TicketStatusEnum;
use App\Form\TicketsFilterType;
use App\Form\TicketType;
use App\Repository\TicketRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TicketController extends DashboardController {
    #[Route('/dashboard/tickets', name: 'app_tickets')]
    public function ticketsIndex(
        Request                $request,
        EntityManagerInterface $entityManager,
        TicketRepository       $ticketRepository,
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
            $ticket->setCode('TKT-' . (100 + $ticket->getId()));
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
        if ($filterTicketsForm->isSubmitted() && $filterTicketsForm->isValid()) {
            $filterData = $filterTicketsForm->getData();

            /**
             * TODO:
             *  Continue filtering logic
             *  Implement pagination (15 items/rows)
             */
        }

        return $this->render('ticket/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'create_ticket_form' => $createTicketForm->createView(),
                'tickets_data' => $ticketsNumbersData
            ]
        ), new Response(NULL, $responseStatus));
    }

    #[Route('/dashboard/tickets/{id}', name: 'app_ticket_detail')]
    public function detail(Ticket $ticket): Response {
        return $this->render('ticket/detail.html.twig', array_merge(self::ADMIN_MENU, [
            'ticket' => $ticket,
        ]));
    }
}
