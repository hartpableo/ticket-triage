<?php

namespace App\Form;

use App\Entity\Comment;
use App\Entity\Ticket;
use App\Enum\CommentTypeEnum;
use App\Repository\TicketRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class CommentType extends AbstractType {
    public function __construct(
        private readonly RequestStack     $requestStack,
        private readonly Security         $security,
        private readonly TicketRepository $ticketRepository,
    ) {
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $request = $this->requestStack->getCurrentRequest();
        $ticket = NULL;
        $user = $this->security->getUser();

        if ($request) {
            $ticket = $request->attributes->get('ticket');
            if (!$ticket instanceof Ticket) {
                $code = $request->attributes->get('code');
                if ($code) {
                    $ticket = $this->ticketRepository->findOneBy(['code' => $code]);
                }
            }
            if (!$ticket instanceof Ticket) {
                $id = $request->attributes->get('id');
                if ($id) {
                    $ticket = $this->ticketRepository->find($id);
                }
            }
        }

        if ($ticket === NULL) {
            throw new \LogicException('The current ticket context could not be resolved from the request attributes, route parameters ("code" or "id"), or database.');
        }

        if ($user === NULL) {
            throw new \LogicException('The current user context could not be resolved. Please make sure the user is authenticated.');
        }

        $builder
            ->add('content', TextareaType::class, [
                'required' => TRUE,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(min: 10, max: 1024)
                ],
                'attr' => [
                    'id' => 'comment-content',
                    'rows' => 6,
                    'aria-label' => 'Comment content'
                ]
            ])
            ->add('type', CheckboxType::class, [
                'mapped' => FALSE,
                'data' => FALSE,
                'label' => 'Internal Agent Note (Visible only to team members)',
                'label_attr' => [
                    'class' => 'form-check-label small text-muted'
                ],
                'attr' => [
                    'id' => 'comment-type',
                    'class' => 'form-check-input'
                ]
            ])
            ->add('submit', SubmitType::class, [
                'label' => '<i class="bi bi-send me-1"></i> Send Reply',
                'label_html' => TRUE,
                'attr' => ['class' => 'btn btn-primary px-4'],
            ])
        ;

        // Securely set the context-aware values directly on the entity
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($ticket, $user) {
            $comment = $event->getData();
            if (!$comment instanceof Comment) {
                return;
            }

            $comment->setTicket($ticket);
            $comment->setAuthor($user);
        });
    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => Comment::class,
        ]);
    }
}
