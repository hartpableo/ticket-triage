<?php

namespace App\Form;

use App\Entity\Ticket;
use App\Entity\User;
use App\Enum\TicketCategoryEnum;
use App\Enum\TicketPriorityEnum;
use App\Enum\TicketStatusEnum;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class TicketSettingsType extends AbstractType {
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ): void {
        $ticket = $builder->getData();
        $isClosed = in_array($ticket->getStatus(), [
            TicketStatusEnum::Closed,
            TicketStatusEnum::Resolved
        ]);

        $builder->add('status', EnumType::class, [
            'constraints' => [
                new Assert\NotBlank()
            ],
            'required' => TRUE,
            'choice_label' => fn($i) => $i->label(),
            'class' => TicketStatusEnum::class
        ]);

        // Only display other settings fields if ticket status is not closed or resolved
        if (!$isClosed) {
            $builder
                ->add('category', EnumType::class, [
                    'constraints' => [
                        new Assert\NotBlank()
                    ],
                    'required' => TRUE,
                    'choice_label' => fn($i) => $i->label(),
                    'class' => TicketCategoryEnum::class
                ])
                ->add('priority', EnumType::class, [
                    'constraints' => [
                        new Assert\NotBlank()
                    ],
                    'required' => TRUE,
                    'choice_label' => fn($i) => $i->label(),
                    'class' => TicketPriorityEnum::class
                ]);
        }

        $builder
            ->add('assigned_agent', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'name',
                'disabled' => $isClosed
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Update Ticket Details',
                'attr' => ['class' => 'btn btn-primary'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => Ticket::class,
            'attr' => ['class' => 'card border border-light-subtle rounded-3 p-4 bg-white shadow-sm mb-4'],
        ]);
    }
}
