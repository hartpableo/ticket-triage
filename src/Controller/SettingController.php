<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SettingController extends DashboardController
{
    #[Route('/dashboard/settings', name: 'app_settings')]
    public function index(): Response
    {
        return $this->render('setting/index.html.twig', self::ADMIN_MENU);
    }
}
