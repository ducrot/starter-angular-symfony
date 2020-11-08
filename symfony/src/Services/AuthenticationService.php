<?php


namespace App\Services;


use App\AuthenticationServiceInterface;
use App\LoginRequest;
use App\LoginResponse;
use App\Security\AuthenticationManager;
use App\Security\LoginCredentials;
use Doctrine\ORM\EntityManagerInterface;
use SymfonyTwirpHandler\TwirpError;
use Google\Protobuf\Timestamp;

class AuthenticationService implements AuthenticationServiceInterface
{

    private AuthenticationManager $manager;
    private EntityManagerInterface $em;

    /**
     * AuthenticationService constructor.
     */
    public function __construct(AuthenticationManager $manager, EntityManagerInterface $em)
    {
        $this->manager = $manager;
        $this->em = $em;
    }


    public function login(LoginRequest $request): LoginResponse
    {
        if (empty($request->getUsername())) {
            throw new TwirpError("app.auth.login.missing_parameter", TwirpError::INVALID_ARGUMENT);
        }
        if (empty($request->getPassword())) {
            throw new TwirpError("app.auth.login.missing_parameter", TwirpError::INVALID_ARGUMENT);
        }

        # Validate login credentials
        $credentials = new LoginCredentials(
            $request->getUsername(),
            $request->getPassword(),
            'local',
            null
        );
        $success = $this->manager->validateLogin($credentials);
        if (!$success) {
            throw new TwirpError("app.auth.login.login_failed", TwirpError::UNAUTHENTICATED);
        }

        // Set last login date
        $user = $success->getUser();
        $user->setLastLogin(new \DateTime());
        $this->em->persist($user);
        $this->em->flush();

        // Build response
        $response = new LoginResponse();
        $response->setToken($success->getToken());
        $response->setTokenExpiresAt(
            (new Timestamp())->setSeconds($success->getTokenExpiresAt()->getTimestamp())
        );
        $response->setUser($success->getUser()->toProtobuf());
        return $response;
    }
}
