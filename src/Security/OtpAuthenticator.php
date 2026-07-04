<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class OtpAuthenticator extends AbstractAuthenticator {

    use TargetPathTrait;

    public function __construct(
        private readonly UrlGeneratorInterface  $urlGenerator,
        private readonly UserRepository         $userRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    protected function getLoginUrl(
        Request $request,
    ): string {
        return $this->urlGenerator->generate('app_login');
    }

    public function supports(Request $request): bool {
        return $request->isMethod('POST')
            && $request->attributes->get('_route') === 'app_login_verify';
    }

    public function authenticate(Request $request): Passport {
        $email = $request->getSession()->get('login_target_email');
        if (!$email) {
            throw new CustomUserMessageAuthenticationException('The session has expired. Please login again.');
        }

        $otp = $request->request->get('otp');
        $csrfToken = $request->request->get('_csrf_token');

        if (empty($otp)) {
            throw new CustomUserMessageAuthenticationException('Please enter the verification code.');
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if (empty($user)) {
            throw new CustomUserMessageAuthenticationException('Account not found');
        }

        if (
            empty($user->getOtpExpiry())
            || $user->getOtpExpiry() < new \DateTimeImmutable('now')
        ) {
            throw new CustomUserMessageAuthenticationException('Verification code is expired. Please request a new one.');
        }

        return new SelfValidatingPassport(
            new UserBadge($email),
            [
                new CsrfTokenBadge('authenticate_otp', $csrfToken)
            ]
        );
    }

    public function onAuthenticationSuccess(
        Request        $request,
        TokenInterface $token,
        string         $firewallName
    ): ?Response {
        $user = $token->getUser();
        if ($user instanceof User) {
            $user->setOtp(NULL);
            $user->setOtpExpiry(NULL);
            $this->entityManager->flush();
        }

        $request->getSession()->remove('login_target_email');

        $targetPath = $this->getTargetPath(
            $request->getSession(), $firewallName
        );

        if ($targetPath) {
            return new RedirectResponse($targetPath);
        }

        return new RedirectResponse(
            $this->urlGenerator->generate('app_dashboard')
        );
    }

    public function onAuthenticationFailure(
        Request $request,
        AuthenticationException $exception
    ): ?Response {
        $request->getSession()->getFlashBag()->add('error', 'Authentication failed.');
        return new RedirectResponse($this->urlGenerator->generate('app_login'));
    }
}
