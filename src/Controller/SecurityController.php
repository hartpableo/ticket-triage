<?php

namespace App\Controller;

use App\Repository\UserRepository;
use DateMalformedStringException as DateMalformedStringExceptionAlias;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController {

    public function __construct(
        private readonly UserRepository         $userRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly MailerInterface        $mailer,
    ) {
    }

    /**
     * @throws DateMalformedStringExceptionAlias
     * @throws RandomException
     * @throws TransportExceptionInterface
     */
    #[Route(path: '/login', name: 'app_login')]
    public function login(
        Request             $request,
        AuthenticationUtils $authenticationUtils,
    ): Response {
        if ($this->getUser()) {
            $this->addFlash('info', 'You are already logged in.');
            return $this->redirectToRoute('app_dashboard');
        }

        if ($request->isMethod('POST')) {
            $email = $request->request->get('email');
            $user = $this->userRepository->findOneBy(['email' => $email]);
            if (empty($user)) {
                $this->addFlash('error', 'User not found. Please register.');
                return $this->redirectToRoute('app_login');
            }

            if (!$user->isVerified()) {
                // TODO: Handle resending of verification
                $this->addFlash('error', 'You\'re not yet verified. Please verify your email.');
                return $this->redirectToRoute('app_login');
            }

            $otp = (string)\random_int(100000, 999999);
            $user->setOtp($otp);
            $user->setOtpExpiry(new \DateTimeImmutable()->modify('+15 minutes'));
            $this->entityManager->flush();

            $email = (new TemplatedEmail())
                ->from($this->getParameter('system.email'))
                ->to($user->getEmail())
                ->subject('OTP Verification | ' . $this->getParameter('app.name'))
                ->htmlTemplate('emails/otp.html.twig')
                ->context([
                    'otp' => $otp,
                ]);

            $this->mailer->send($email);

            $request->getSession()->set('login_target_email', $user->getEmail());
            return $this->redirectToRoute('app_login_verify');
        }

        return $this->render('security/login.html.twig', [
            'error' => $authenticationUtils->getLastAuthenticationError(),
        ]);
    }

    #[Route(path: '/login/verify', name: 'app_login_verify', methods: ['GET', 'POST'])]
    public function verifyOtp(
        Request $request,
    ): RedirectResponse|Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_dashboard');
        }

        if (!$request->getSession()->has('login_target_email')) {
            $this->addFlash('error', 'Please enter your email address to request verification.');
            return $this->redirectToRoute('app_login');
        }

        return $this->render('security/verify_otp.html.twig', [
            'email' => $request->getSession()->get('login_target_email'),
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
