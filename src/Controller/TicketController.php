<?php

namespace App\Controller;

use App\Entity\Ticket;
use App\Form\TicketType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TicketController extends DashboardController {
    #[Route('/dashboard/tickets', name: 'app_tickets')]
    public function ticketsIndex(
        Request                $request,
        EntityManagerInterface $entityManager,
    ): Response {
        $ticket = new Ticket();
        $createTicketForm = $this->createForm(TicketType::class, $ticket);

        $createTicketForm->handleRequest($request);

        if ($request->isMethod('POST') && $createTicketForm->handleRequest($request)->isValid()) {
            $entityManager->persist($ticket);
            $entityManager->flush();
            return $this->redirectToRoute('app_tickets');
        }

        return $this->render('ticket/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'create_ticket_form' => $createTicketForm->createView(),
            ]
        ));
    }

    #[Route('/dashboard/tickets/{id}', name: 'app_ticket_detail')]
    public function detail(string $id): Response {
        return $this->render('ticket/detail.html.twig', array_merge(self::ADMIN_MENU, [
            'ticket_id' => $id,
        ]));
    }
}
