<?php

declare(strict_types=1);

namespace App\DataFixtures\Faker\Provider;

use Faker\Generator;
use Faker\Provider\Base;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;

final class UserProvider extends Base
{
    private PasswordHasherFactoryInterface $hasherFactory;

    public function __construct(Generator $generator, PasswordHasherFactoryInterface $hasherFactory)
    {
        parent::__construct($generator);

        $this->hasherFactory = $hasherFactory;
    }

    /**
     * Generate Symfony hashed password using UserPasswordHasherInterface
     */
    public function symfonyPassword(string $userClass, string $plainPassword): string
    {
        $password = $this->hasherFactory->getPasswordHasher($userClass)->hash($plainPassword);

        return $this->generator->parse($password);
    }

    /**
     * Admin role
     */
    public function roleAdmin(): array
    {
        return ['ROLE_ADMIN'];
    }

    /**
     * User Role
     */
    public function roleUser(): array
    {
        return ['ROLE_USER'];
    }
}
