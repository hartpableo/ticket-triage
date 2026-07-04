<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TeamController extends DashboardController
{
    #[Route('/dashboard/team', name: 'app_team')]
    public function index(): Response
    {
        return $this->render('team/index.html.twig', self::ADMIN_MENU);
    }
}
