<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Console\Attribute\Argument;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;

#[AsCommand(name: 'app:create-admin')]
class CreateAdminCommand extends Command {

    private ParameterBagInterface $params;

    public function __construct(
        ParameterBagInterface                       $params,
        private readonly EntityManagerInterface     $entityManager,
        private readonly MailerInterface            $mailer,
        private readonly VerifyEmailHelperInterface $verifyEmailHelper,
    ) {
        $this->params = $params;
        parent::__construct();
    }

    public function __invoke(
        #[Argument('The name of the admin user.')] string          $name,
        #[Argument('The email address of the admin user.')] string $email,
        OutputInterface                                            $output
    ): int {
        // Register user
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setTitle('Administrator');
        $user->setRoles(['ROLE_ADMIN']);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Email verification
        $signature = $this->verifyEmailHelper->generateSignature(
            'app_verify_email',
            (string)$user->getId(),
            $user->getEmail(),
            [
                'id' => $user->getId(),
            ]
        );

        $mail = new TemplatedEmail()
            ->from($this->params->get('system.email'))
            ->to($user->getEmail())
            ->subject('Verify your email address')
            ->htmlTemplate('emails/verify_email.html.twig')
            ->context([
                'signedUrl' => $signature->getSignedUrl(),
            ]);

        try {
            $this->mailer->send($mail);
        } catch (TransportExceptionInterface $e) {
            $output->writeln('<error>' . $e->getMessage() . '</error>');
            return Command::FAILURE;
        }

        $output->writeln(
            \sprintf('User %s has been created. Check your email to verify your account.', $email)
        );

        return Command::SUCCESS;
    }

}
