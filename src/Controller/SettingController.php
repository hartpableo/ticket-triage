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

        $session = $request->getSession();

        if ($request->isMethod('POST')) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $entityManager->persist($user);
                $entityManager->flush();

                $this->addFlash('success', 'Profile updated successfully!');
                return $this->redirectToRoute('app_settings');
            }

            // Save invalid form data to session and redirect to keep GET request state
            $session->set(
                'settings_form_data',
                $request->request->all($form->getName())
            );
            return $this->redirectToRoute('app_settings');
        }

        // On GET request: check if we have stored invalid form data from a redirect
        $responseStatus = Response::HTTP_OK;
        if ($session->has('settings_form_data')) {
            $form->submit($session->get('settings_form_data'), FALSE);
            $session->remove('settings_form_data');
            $responseStatus = Response::HTTP_UNPROCESSABLE_ENTITY;
        }

        return $this->render('setting/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'form' => $form
            ]
        ), new Response(NULL, $responseStatus));
    }
}
