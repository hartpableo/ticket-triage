<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{
    #[Route('/users', name: 'app_users', methods: ['POST', 'PATCH', 'DELETE'])]
    public function index(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        // Handle DELETE
        if ($request->isMethod('DELETE')) {
            $data = $request->toArray();
            $userId = $data['userId'] ?? NULL;
            $userName = $data['userName'] ?? NULL;
            $targetUser = $userRepository->findOneBy([
                'id' => $userId,
                'name' => $userName,
            ]);

            if (empty($targetUser)) {
                return $this->json([
                    'ok' => FALSE,
                    'message' => 'User not found',
                ], 422);
            }

            $entityManager->remove($targetUser);
            $entityManager->flush();
            return $this->json([
                'ok' => TRUE,
                'message' => 'User deleted successfully',
            ]);
        }

        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/UserController.php',
        ]);
    }
}
