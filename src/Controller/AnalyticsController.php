<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AnalyticsController extends DashboardController
{
    #[Route('/dashboard/analytics', name: 'app_analytics')]
    public function index(): Response
    {
        return $this->render('analytics/index.html.twig', self::ADMIN_MENU);
    }
}
