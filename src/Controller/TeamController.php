<?php

namespace App\Controller;

use App\Entity\Invitation;
use App\Form\InviteAgentType;
use App\Repository\InvitationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class TeamController extends DashboardController {
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MailerInterface        $mailer,
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly InvitationRepository   $invitationRepository,
    ) {
    }

    /**
     * @throws RandomException
     * @throws TransportExceptionInterface
     */
    #[Route('/dashboard/team', name: 'app_team')]
    public function team(
        Request $request,
    ): Response {
        $invitation = new Invitation();
        $inviteForm = $this->createForm(InviteAgentType::class, $invitation);
        $inviteForm->handleRequest($request);

        if ($inviteForm->isSubmitted() && $inviteForm->isValid()) {
            // Ensure only a single invite is valid
            // Delete older unused ones
            $this->invitationRepository->deleteOldUnusedInvites(
                $inviteForm->get('email')->getData(),
            );

            // Persist the invitation
            $invitation->setToken(bin2hex(random_bytes(32)));
            $this->entityManager->persist($invitation);
            $this->entityManager->flush();

            // Build the registration URL
            $regoUrl = $this->urlGenerator->generate('app_register', [
                'token' => $invitation->getToken()
            ], UrlGeneratorInterface::ABSOLUTE_URL);

            // Send email
            $email = new TemplatedEmail()
                ->from($this->getParameter('system.email'))
                ->to($invitation->getEmail())
                ->subject('Invitation to access workspace | ' . $this->getParameter('app.name'))
                ->htmlTemplate('emails/invite.html.twig')
                ->context([
                    'rego_url' => $regoUrl,
                ]);

            $this->mailer->send($email);

            $this->addFlash('success', 'Invitation sent to ' . $invitation->getEmail() . '.');
            return $this->redirectToRoute('app_team');
        }

        // Return 422 Unprocessable Entity status if the form has validation errors
        $responseStatus = ($inviteForm->isSubmitted() && !$inviteForm->isValid())
            ? Response::HTTP_UNPROCESSABLE_ENTITY
            : Response::HTTP_OK;

        $invitesData = [
            'active' => $this->invitationRepository->count([
                'is_used' => TRUE
            ]),
            'pending' => $this->invitationRepository->count([
                'is_used' => FALSE
            ])
        ];

        return $this->render('team/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'invite_form' => $inviteForm->createView(),
                'invites_data' => $invitesData,
            ]
        ), new Response(NULL, $responseStatus));
    }
}
