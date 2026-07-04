<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController {

    protected const array ADMIN_MENU = [
        'admin_menu' => [
            [
                'title' => 'Tickets',
                'route' => 'app_tickets',
                'icon' => 'ticket-perforated',
            ],
            [
                'title' => 'Analytics',
                'route' => 'app_analytics',
                'icon' => 'bar-chart-line'
            ],
            [
                'title' => 'Clients',
                'route' => 'app_clients',
                'icon' => 'building'
            ],
            [
                'title' => 'Team',
                'route' => 'app_team',
                'icon' => 'people'
            ],
            [
                'title' => 'Settings',
                'route' => 'app_settings',
                'icon' => 'gear'
            ]
        ],
    ];

    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response {
        return $this->redirectToRoute('app_tickets');
    }
}
