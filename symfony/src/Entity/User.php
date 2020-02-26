<?php


namespace App\Entity;


use JsonSerializable;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, JsonSerializable
{

    /** @var int */
    private $id;

    /** @var string */
    private $username;

    /** @var string */
    private $passwordHash;


    /**
     * PlaceholderUser constructor.
     * @param int $id
     * @param string $username
     * @param string $passwordHash
     */
    public function __construct(int $id, string $username, string $passwordHash)
    {
        $this->id = $id;
        $this->username = $username;
        $this->passwordHash = $passwordHash;
    }


    public function getId(): int
    {
        return $this->id;
    }


    public function getRoles()
    {
        return [
            'ROLE_PLACEHOLDER_USER'
        ];
    }

    public function getPassword()
    {
        return $this->passwordHash;
    }


    public function getSalt()
    {
        return null;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function eraseCredentials()
    {
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'username' => $this->getUsername(),
        ];
    }


}
