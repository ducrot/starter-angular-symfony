<?php

namespace App\Security;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class AuthenticationManager
{
    /** @var UserProviderInterface */
    private $userProvider;

    /** @var UserTokenAuthenticator */
    private $authenticator;

    /** @var PasswordHasherFactoryInterface */
    private $hasherFactory;

    /** @var LoggerInterface */
    private $logger;

    /**
     * AuthenticationManager constructor.
     */
    public function __construct(UserProviderInterface $userProvider, UserTokenAuthenticator $authenticator, PasswordHasherFactoryInterface $hasherFactory, LoggerInterface $logger)
    {
        $this->userProvider = $userProvider;
        $this->authenticator = $authenticator;
        $this->hasherFactory = $hasherFactory;
        $this->logger = $logger;
    }

    public function validateLogin(LoginCredentials $credentials): ?LoginSuccess
    {
        $user = $this->getUserByCredentials($credentials);
        if (!$user) {
            return null;
        }

        try {
            $token = $this->authenticator->generateToken($user);
        } catch (\Exception $e) {
            $this->logger->error('Failed to generate token: '.$e->getMessage());
            throw new \LogicException('Failed to generate token');
        }

        $expiresAt = date_create_immutable()->add($this->authenticator->getTokenLifetime());

        return new LoginSuccess($token, $expiresAt, $user);
    }

    private function getUserByCredentials(LoginCredentials $credentials): ?User
    {
        try {
            $user = $this->userProvider->loadUserByIdentifier($credentials->getUsername());
            $hasher = $this->hasherFactory->getPasswordHasher($user);
            $valid = $hasher->verify($user->getPassword(), $credentials->getPassword());
            if (!$valid) {
                $this->logger->warning(sprintf('Failed login attempt with username "%s". Password incorrect.', $credentials->getUsername()));

                return null;
            }
            if (!$user instanceof User) {
                throw new \LogicException();
            }

            return $user;
        } catch (UserNotFoundException $exception) {
            $this->logger->warning(sprintf('Failed login attempt with username "%s". No user with this name found.', $credentials->getUsername()));

            return null;
        }
    }
}
