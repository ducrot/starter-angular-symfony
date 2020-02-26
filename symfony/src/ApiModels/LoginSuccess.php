<?php


namespace App\ApiModels;


use App\Entity\User;
use DateTimeInterface;
use JsonSerializable;

class LoginSuccess implements JsonSerializable
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


    public function jsonSerialize()
    {
        return [
            'token' => $this->getToken(),
            'tokenExpiresAt' => $this->getTokenExpiresAt()->format(DATE_RFC3339_EXTENDED),
            'user' => $this->getUser()->jsonSerialize(),
        ];
    }


}
