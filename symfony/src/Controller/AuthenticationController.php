<?php


namespace App\Controller;


use App\ApiModels\LoginCredentials;
use App\Security\AuthenticationManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Routing\Annotation\Route;


class AuthenticationController extends AbstractController
{


    /**
     * Route("/api/auth/login")
     * @Route("/api/auth/login", methods={"POST"})
     *
     * @param Request $request
     * @param AuthenticationManager $manager
     * @return JsonResponse
     */
    public function login(Request $request, AuthenticationManager $manager): JsonResponse
    {
        // parse request
        $request_json = json_decode($request->getContent(), true);
        if (!is_array($request_json)) {
            throw new BadRequestHttpException();
        }
        if (!array_key_exists('username', $request_json)) {
            throw new BadRequestHttpException();
        }
        if (!array_key_exists('password', $request_json)) {
            throw new BadRequestHttpException();
        }
        $credentials = new LoginCredentials();
        $credentials->setUsername($request_json['username']);
        $credentials->setPassword($request_json['password']);

        // check credentials
        $success = $manager->validateLogin($credentials);
        if (!$success) {
            throw new HttpException(Response::HTTP_UNAUTHORIZED, 'Login failed');
        }
        return new JsonResponse($success);
    }

}
