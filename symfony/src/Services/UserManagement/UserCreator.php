<?php


namespace App\Services\UserManagement;


use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserCreator
{

    private UserRepository $userRepository;
    private ValidatorInterface $validator;
    private UserPasswordEncoderInterface $passwordEncoder;
    private ?ConstraintViolationListInterface $errors;
    private User $user;


    public function __construct(UserPasswordEncoderInterface $passwordEncoder, UserRepository $userRepository, ValidatorInterface $validator)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->userRepository = $userRepository;
        $this->validator = $validator;
        $this->reset();
    }

    public function reset()
    {
        $this->user = new User();
        $this->errors = null;
    }

    public function create(): bool
    {
        $this->user->setCreated(new DateTime());
        $this->user->setUpdated(new DateTime());
        $this->errors = $this->validator->validate($this->user);
        $ok = !$this->hasErrors();
        if ($ok) {
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
        $pw = $this->passwordEncoder->encodePassword($this->user, $value);
        $this->user->setPassword($pw);
    }


    public function setAdmin(bool $value)
    {
        if ($value) {
            $this->user->setRoles(['ROLE_ADMIN']);
        } else {
            $this->user->setRoles([]);
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
