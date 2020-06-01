<?php


namespace App\Security;


use App\Entity\User;
use DateTimeInterface;

class LoginSuccess
{

    private $token;
    private $tokenExpiresAt;
    private $user;


    public function __construct(string $token, DateTimeInterface $tokenExpiresAt, User $user)
    {
        $this->token = $token;
        $this->tokenExpiresAt = $tokenExpiresAt;
        $this->user = $user;
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function getTokenExpiresAt(): DateTimeInterface
    {
        return $this->tokenExpiresAt;
    }

    public function getUser(): User
    {
        return $this->user;
    }


}
