<?php

declare(strict_types=1);

namespace App\DataFixtures\Faker\Provider;

use Faker\Generator;
use Faker\Provider\Base;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;

final class UserProvider extends Base
{
    private EncoderFactoryInterface $encoderFactory;

    public function __construct(Generator $generator, EncoderFactoryInterface $encoderFactory)
    {
        parent::__construct($generator);

        $this->encoderFactory = $encoderFactory;
    }

    /**
     * Generate Symfony encoded password using UserPasswordEncoderInterface
     */
    public function symfonyPassword(string $userClass, string $plainPassword, ?string $salt = null): string
    {
        $password = $this->encoderFactory->getEncoder($userClass)->encodePassword($plainPassword, $salt);

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
