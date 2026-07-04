<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;

final class RegistrationController extends AbstractController {
    public function __construct(
        private readonly UserRepository             $userRepository,
        private readonly EntityManagerInterface     $entityManager,
        private readonly VerifyEmailHelperInterface $verifyEmailHelper,
        private readonly MailerInterface            $mailer,
    ) {
    }

    #[Route('/register', name: 'app_register')]
    public function register(
        Request $request
    ): RedirectResponse|Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_dashboard');
        }

        if ($request->isMethod('POST')) {
            $email = $request->request->get('email');
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->addFlash('error', 'Invalid email');
                return $this->redirectToRoute('app_register');
            }

            $user = $this->userRepository->findOneBy(['email' => $email]);
            if ($user && $user->isVerified()) {
                $this->addFlash('error', 'Email is already registered. Log in instead.');
                return $this->redirectToRoute('app_login');
            }

            if (empty($user)) {
                $user = new User();
                $user->setEmail($email);
                $user->setIsVerified(FALSE);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }

            $signature = $this->verifyEmailHelper->generateSignature(
                'app_verify_email',
                (string)$user->getId(),
                $user->getEmail(),
                [
                    'id' => $user->getId(),
                ]
            );

            $email = (new TemplatedEmail())
                ->from($this->getParameter('system.email'))
                ->to($user->getEmail())
                ->subject('Verify your email address')
                ->htmlTemplate('emails/verify_email.html.twig')
                ->context([
                    'signedUrl' => $signature->getSignedUrl(),
                ]);

            try {
                $this->mailer->send($email);
            } catch (TransportExceptionInterface $e) {
                $this->addFlash('error', $e->getMessage());
                return $this->redirectToRoute('app_register');
            }

            $this->addFlash('success', 'Verification email sent.');
            return $this->redirectToRoute('app_login');
        }

        // Handle GET request
        return $this->render('registration/register.html.twig');
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(
        Request $request,
    ): RedirectResponse {
        $id = $request->query->get('id');
        if (empty($id)) {
            return $this->redirectToRoute('app_register');
        }

        $user = $this->userRepository->findOneBy(['id' => $id]);
        if (empty($user)) {
            return $this->redirectToRoute('app_register');
        }

        $this->verifyEmailHelper->validateEmailConfirmationFromRequest(
            $request,
            (string)$user->getId(),
            $user->getEmail()
        );

        $user->setIsVerified(TRUE);
        $this->entityManager->flush();
        $this->addFlash('success', 'Email verified.');
        return $this->redirectToRoute('app_login');
    }
}
