<?php

declare(strict_types=1);

namespace App\Services\UserManagement;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserDto
{
    private UserRepository $userRepository;
    private ValidatorInterface $validator;
    private UserPasswordHasherInterface $passwordHasher;
    private ?ConstraintViolationListInterface $errors;
    private User $user;
    private bool $mustHashPassword;

    public function __construct(UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository, ValidatorInterface $validator)
    {
        $this->passwordHasher = $passwordHasher;
        $this->userRepository = $userRepository;
        $this->validator = $validator;
        $this->reset();
    }

    public function reset(): void
    {
        $this->user = new User();
        $this->errors = null;
        $this->mustHashPassword = false;
    }

    public function create(): void
    {
        $this->user->setCreated(new \DateTime());
        $this->user->setUpdated(new \DateTime());
    }

    public function load(string $id): void
    {
        $this->user = $this->userRepository->find($id);
    }

    public function save(): bool
    {
        $this->errors = $this->validator->validate($this->user);
        $ok = !$this->hasErrors();
        if ($ok) {
            if ($this->mustHashPassword) {
                $pw = $this->passwordHasher->hashPassword($this->user, $this->user->getPassword());
                $this->user->setPassword($pw);
            }
            $this->userRepository->persist($this->user);
        }

        return $ok;
    }

    public function setUsername(string $value)
    {
        $this->user->setUsername($value);
    }

    public function setPassword(string $value)
    {
        // Don't hash password here because validation is only possibly with plain password.
        $this->mustHashPassword = true;
        $this->user->setPassword($value);
    }

    public function setFirstName(string $value)
    {
        $this->user->setFirstName($value);
    }

    public function setLastName(string $value)
    {
        $this->user->setLastName($value);
    }

    public function setGender(int $value)
    {
        $this->user->setGender($value);
    }

    public function setAdmin(bool $value)
    {
        if ($value) {
            $this->user->setRoles(['ROLE_ADMIN']);
        } else {
            $this->user->setRoles(['ROLE_USER']);
        }
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function hasErrors(): bool
    {
        return $this->errors !== null && $this->errors->count() > 0;
    }

    public function getErrors(): ?ConstraintViolationListInterface
    {
        return $this->errors;
    }
}
