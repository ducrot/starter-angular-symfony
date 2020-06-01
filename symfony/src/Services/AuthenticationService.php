<?php


namespace App\Services;


use App\ApiModels\LoginCredentials;
use App\AuthenticationServiceInterface;
use App\LoginRequest;
use App\LoginResponse;
use App\Security\AuthenticationManager;
use App\User;
use Google\Protobuf\Timestamp;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthenticationService implements AuthenticationServiceInterface
{

    private AuthenticationManager $manager;

    /**
     * AuthenticationService constructor.
     * @param AuthenticationManager $manager
     */
    public function __construct(AuthenticationManager $manager)
    {
        $this->manager = $manager;
    }


    public function login(LoginRequest $request): LoginResponse
    {
        if (empty($request->getUsername())) {
            throw new BadRequestHttpException();
        }
        if (empty($request->getPassword())) {
            throw new BadRequestHttpException();
        }

        $credentials = new LoginCredentials();
        $credentials->setUsername($request->getUsername());
        $credentials->setPassword($request->getPassword());

        $success = $this->manager->validateLogin($credentials);
        if (!$success) {
            throw new HttpException(Response::HTTP_UNAUTHORIZED, 'Login failed');
        }

        $response = new LoginResponse();
        $response->setToken($success->getToken());
        $response->setTokenExpiresAt(
            (new Timestamp())->setSeconds($success->getTokenExpiresAt()->getTimestamp())
        );
        $response->setUser(
            (new User())
                ->setId($success->getUser()->getId())
                ->setUsername($success->getUser()->getUsername())
        );

        return $response;
    }
}
