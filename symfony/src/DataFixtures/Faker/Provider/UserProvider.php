<?php
declare(strict_types=1);

namespace App\DataFixtures\Faker\Provider;

use Faker\Generator;
use Faker\Provider\Base;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;

final class UserProvider extends Base
{
    private EncoderFactoryInterface $encoderFactory;

    /**
     * {@inheritdoc}
     * @param EncoderFactoryInterface $encoderFactory
     */
    public function __construct(Generator $generator, EncoderFactoryInterface $encoderFactory)
    {
        parent::__construct($generator);

        $this->encoderFactory = $encoderFactory;
    }

    /**
     * Generate Symfony encoded password using UserPasswordEncoderInterface
     *
     * @param string $userClass
     * @param string $plainPassword
     * @param string|null $salt
     *
     * @return string
     */
    public function symfonyPassword(string $userClass, string $plainPassword, string $salt = null): string
    {
        $password = $this->encoderFactory->getEncoder($userClass)->encodePassword($plainPassword, $salt);

        return $this->generator->parse($password);
    }

    /**
     * Admin role
     * @return array
     */
    public function roleAdmin(): array
    {
        return ['ROLE_ADMIN'];
    }

    /**
     * User Role
     * @return array
     */
    public function roleUser(): array
    {
        return ['ROLE_USER'];
    }
}
