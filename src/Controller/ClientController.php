<?php

namespace App\Controller;

use App\Entity\Client;
use App\Form\ClientType;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ClientController extends DashboardController {
    /**
     * @throws RandomException
     */
    #[Route('/dashboard/clients', name: 'app_clients')]
    public function clients(
        Request                $request,
        EntityManagerInterface $entityManager,
        ClientRepository       $clientRepository,
    ): Response {
        $client = new Client();
        $addClientForm = $this->createForm(ClientType::class, $client);
        $addClientForm->handleRequest($request);

        if ($addClientForm->isSubmitted() && $addClientForm->isValid()) {
            $client->setApiKey(bin2hex(random_bytes(32)));
            $entityManager->persist($client);
            $entityManager->flush();
            $this->addFlash('success', 'Client has been added.');
            return $this->redirectToRoute('app_clients');
        }

        // Return 422 Unprocessable Entity status if the form has validation errors
        $responseStatus = ($addClientForm->isSubmitted() && !$addClientForm->isValid())
            ? Response::HTTP_UNPROCESSABLE_ENTITY
            : Response::HTTP_OK;

        return $this->render('client/index.html.twig', array_merge(
            self::ADMIN_MENU,
            [
                'add_client_form' => $addClientForm->createView(),
                'clients' => $clientRepository->findAllWithOpenTicketsCount(),
            ]
        ), new Response(NULL, $responseStatus));
    }
}
