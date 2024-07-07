<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class UserTokenAuthenticator extends AbstractBearerTokenAuthenticator
{
    /** @var UserRepository */
    private $userProvider;

    /** @var string */
    private $tokenIssuer;

    /** @var \DateInterval */
    private $tokenLifetime;

    /** @var string */
    private $tokenSecret;

    /**
     * UserTokenAuthenticator constructor.
     *
     * @throws \Exception if the $tokenLifetime is not a valid interval spec
     */
    public function __construct(UserRepository $userProvider, string $tokenIssuer, string $tokenLifetime, string $tokenSecret)
    {
        $this->userProvider = $userProvider;
        $this->tokenIssuer = $tokenIssuer;
        $this->tokenLifetime = new \DateInterval($tokenLifetime);
        $this->tokenSecret = $tokenSecret;
    }

    /**
     * @throws \Exception
     */
    public function generateToken(User $user): string
    {
        return UserToken::create(
            $user->getUsername(),
            $this->tokenIssuer,
            $this->tokenSecret,
            $this->getTokenLifetime()
        );
    }

    public function getTokenLifetime(): \DateInterval
    {
        return $this->tokenLifetime;
    }

    protected function getTokenName(): string
    {
        return UserToken::TOKEN_NAME;
    }

    protected function supportsToken(string $token): bool
    {
        return UserToken::supports($token);
    }

    protected function validateToken(string $token, Request $request): string
    {
        return UserToken::validate(
            $token,
            $this->tokenIssuer,
            $this->tokenSecret
        );
    }

    protected function getTokenUser(string $username): ?UserInterface
    {
        return $this->userProvider->loadUserByIdentifier($username);
    }
}
