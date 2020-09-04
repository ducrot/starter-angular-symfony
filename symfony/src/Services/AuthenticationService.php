<?php


namespace App\Services;


use App\AuthenticationServiceInterface;
use App\LoginRequest;
use App\LoginResponse;
use App\Security\AuthenticationManager;
use App\Security\LoginCredentials;
use SymfonyTwirpHandler\TwirpError;
use Google\Protobuf\Timestamp;

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
            throw new TwirpError("app.auth.login.missing_parameter", TwirpError::INVALID_ARGUMENT);
        }
        if (empty($request->getPassword())) {
            throw new TwirpError("app.auth.login.missing_parameter", TwirpError::INVALID_ARGUMENT);
        }

        $credentials = new LoginCredentials(
            $request->getUsername(),
            $request->getPassword()
        );

        $success = $this->manager->validateLogin($credentials);
        if (!$success) {
            throw new TwirpError("app.auth.login.login_failed", TwirpError::UNAUTHENTICATED);
        }

        $response = new LoginResponse();
        $response->setToken($success->getToken());
        $response->setTokenExpiresAt(
            (new Timestamp())->setSeconds($success->getTokenExpiresAt()->getTimestamp())
        );
        $response->setUser($success->getUser()->toProtobuf());

        return $response;
    }
}
