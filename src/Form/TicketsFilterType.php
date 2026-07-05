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
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketsFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'required' => FALSE
            ])
            ->add('category', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketCategoryEnum::class
            ])
            ->add('status', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketStatusEnum::class
            ])
            ->add('priority', EnumType::class, [
                'required' => FALSE,
                'choice_label' => fn($i) => $i->label(),
                'class' => TicketPriorityEnum::class
            ])
            ->add('client', EntityType::class, [
                'required' => FALSE,
                'class' => Client::class,
                'choice_label' => 'name',
            ])
            ->add('assigned_agent', EntityType::class, [
                'required' => FALSE,
                'class' => User::class,
                'choice_label' => 'name',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticket::class,
            'csrf_protection' => FALSE,
            'method' => 'GET',
        ]);
    }
}
