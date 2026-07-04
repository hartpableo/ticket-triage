<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ClientController extends DashboardController
{
    #[Route('/dashboard/client', name: 'app_clients')]
    public function index(): Response
    {
        return $this->render('client/index.html.twig', self::ADMIN_MENU);
    }
}
