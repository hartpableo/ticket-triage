<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TicketController extends DashboardController
{
    #[Route('/dashboard/tickets', name: 'app_tickets')]
    public function index(): Response
    {
        return $this->render('ticket/index.html.twig', self::ADMIN_MENU);
    }

    #[Route('/dashboard/tickets/{id}', name: 'app_ticket_detail')]
    public function detail(string $id): Response
    {
        return $this->render('ticket/detail.html.twig', array_merge(self::ADMIN_MENU, [
            'ticket_id' => $id,
        ]));
    }
}
