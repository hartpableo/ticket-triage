<?php

namespace App\Controller;

use App\Form\ProfileSettingsType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SettingController extends DashboardController {

    #[Route('/dashboard/settings', name: 'app_settings')]
    public function settingsPage(
        Request                $request,
        EntityManagerInterface $entityManager,
    ): Response {
        $user = $this->getUser();
        $form = $this->createForm(
            ProfileSettingsType::class,
            $user
        );

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', 'Profile updated successfully!');
            return $this->redirectToRoute('app_settings');
        }

        return $this->render('setting/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'form' => $form
            ]
        ));
    }
}
