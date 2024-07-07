<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Class AppFixtures
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! Fixtures are only used for tests !!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * If there are other fixture classes, they must be registered in \App\Tests\ORM\DatabaseSetupTrait.
 */
class AppFixtures extends Fixture
{
    /** @var UserPasswordHasherInterface */
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername('testuser@domain.tld');

        $password = $this->passwordHasher->hashPassword($user, 'A#Very$ecretPwd');
        $user->setPassword($password);

        $manager->persist($user);
        $manager->flush();
    }
}
