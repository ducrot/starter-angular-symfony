<?php

namespace App\Tests\ORM;

use App\DataFixtures\AppFixtures;
use App\Entity\User;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Component\Security\Core\Encoder\EncoderFactory;
use Symfony\Component\Security\Core\Encoder\PlaintextPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;

trait DatabaseSetupTrait 
{
    /** @var EntityManager */
    protected $em;

    protected function setUpEntityManager()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }
    
    protected function createSchema()
    {
        $schemaTool = new SchemaTool($this->em);
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();
        $schemaTool->dropSchema($metadata);
        $schemaTool->createSchema($metadata);
    }

    protected function loadFixtures()
    {
        $passwordEncoder = new UserPasswordEncoder(
            new EncoderFactory([
                User::class => new PlaintextPasswordEncoder()
            ])
        );
        $loader = new Loader();

        // Add more fixtures if needed:
        $loader->addFixture(new AppFixtures($passwordEncoder));

        $purger = new ORMPurger($this->em);
        $executor = new ORMExecutor($this->em, $purger);
        $executor->execute($loader->getFixtures());
    }

    protected function tearDown(): void
    {
        $this->em->close();
        $this->em = null;
        parent::tearDown();
    }

}