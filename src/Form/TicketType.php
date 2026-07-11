<?php

namespace App\Form;

use App\Entity\Client;
use App\Entity\Ticket;
use App\Entity\User;
use App\Enum\TicketCategoryEnum;
use App\Enum\TicketPriorityEnum;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class TicketType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'required' => TRUE,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(min: 5, max: 255)
                ]
            ])
            ->add('description', TextareaType::class, [
                'required' => TRUE,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(min: 5, max: 255)
                ]
            ])
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
            ])
            ->add('client', EntityType::class, [
                'class' => Client::class,
                'required' => TRUE,
                'choice_label' => fn($i) => $i->getName(),
                'constraints' => [
                    new Assert\NotBlank()
                ],
            ])
            ->add('assigned_agent', EntityType::class, [
                'class' => User::class,
                'required' => TRUE,
                'choice_label' => 'name',
                'constraints' => [
                    new Assert\NotBlank()
                ],
            ])
            ->add('attachments', FileType::class, [
                'required'  => FALSE,
                'mapped' => FALSE,
                'multiple' => TRUE,
                'label' => 'Attachments',
                'label_attr' => [
                    'class' => 'd-none'
                ],
                'attr' => [
                    'class' => 'd-none',
                ],
                'constraints' => [
                    new Assert\All([
                        new Assert\File(
                            maxSize: '3M',
                            extensions: ['mp4', 'avi', 'jpg', 'jpeg', 'gif', 'png', 'webp'],
                        )
                    ])
                ],

            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Create Ticket',
                'attr' => ['class' => 'btn btn-primary'],
            ]);;
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticket::class,
        ]);
    }
}
