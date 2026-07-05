<?php

namespace App\Form;

use App\Entity\Client;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ClientType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'required' => TRUE,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(min: 3, max: 255),
                ]
            ])
            ->add('domain', TextType::class, [
                'required' => TRUE,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(min: 3, max: 255),
                ]
            ])
            ->add('assigned_agent', EntityType::class, [
                'class' => User::class,
                'required' => TRUE,
                'choice_label' => 'name',
                'constraints' => [
                    new Assert\NotBlank()
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Add Client',
                'attr' => ['class' => 'btn btn-primary'],
            ]);;
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Client::class,
        ]);
    }
}
