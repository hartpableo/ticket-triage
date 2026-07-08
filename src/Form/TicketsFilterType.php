<?php

namespace App\Form;

use App\Entity\Client;
use App\Entity\Ticket;
use App\Entity\User;
use App\Enum\TicketCategoryEnum;
use App\Enum\TicketPriorityEnum;
use App\Enum\TicketStatusEnum;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketsFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'required' => FALSE,
                'attr' => [
                    'placeholder' => 'Title',
                    'aria-label' => 'Search by ticket title',
                    'class' => 'form-control bg-light border-start-0'
                ]
            ])
            ->add('category', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketCategoryEnum::class,
                'placeholder' => 'Category',
                'attr' => [
                    'aria-label' => 'Search by ticket category',
                    'class' => 'form-select bg-light border-light-subtle'
                ]
            ])
            ->add('status', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketStatusEnum::class,
                'placeholder' => 'Status',
                'attr' => [
                    'aria-label' => 'Search by ticket status',
                    'class' => 'form-select bg-light border-light-subtle',
                ]
            ])
            ->add('priority', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketPriorityEnum::class,
                'placeholder' => 'Priority',
                'attr' => [
                    'aria-label' => 'Search by ticket priority',
                    'class' => 'form-select bg-light border-light-subtle'
                ]
            ])
            ->add('client', EntityType::class, [
                'required' => FALSE,
                'class' => Client::class,
                'choice_label' => 'name',
                'placeholder' => 'Client',
                'attr' => [
                    'aria-label' => 'Search by client',
                    'class' => 'form-select bg-light border-light-subtle'
                ]
            ])
            ->add('assigned_agent', EntityType::class, [
                'required' => FALSE,
                'class' => User::class,
                'choice_label' => 'name',
                'placeholder' => 'Agent',
                'attr' => [
                    'aria-label' => 'Search by agent',
                    'class' => 'form-select bg-light border-light-subtle'
                ]
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Filter',
                'attr' => ['class' => 'btn btn-primary'],
            ]);;
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticket::class,
            'csrf_protection' => FALSE,
            'method' => 'GET',
            'attr' => ['class' => 'row g-3 align-items-center'],
        ]);
    }
}
