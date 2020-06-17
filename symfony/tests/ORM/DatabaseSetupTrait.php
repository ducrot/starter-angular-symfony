<?php

namespace App\Tests\ORM;

use App\DataFixtures\AppFixtures;
use App\Entity\User;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\SchemaTool;
use Doctrine\ORM\Tools\ToolsException;
use Hautelook\AliceBundle\Loader\DoctrineOrmLoader;
use LogicException;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Security\Core\Encoder\EncoderFactory;
use Symfony\Component\Security\Core\Encoder\PlaintextPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;

trait DatabaseSetupTrait
{
    /**
     * @var string[] The list of bundles where to look for fixtures
     */
    protected static $bundles = [];

    /**
     * @var bool Append fixtures instead of purging
     */
    protected static $append = false;

    /**
     * @var bool Use TRUNCATE to purge
     */
    protected static $purgeWithTruncate = true;

    /**
     * @var string|null The name of the Doctrine shard to use
     */
    protected static $shard;

    /**
     * @var array|null Contain loaded fixture from alice
     */
    protected static $fixtures;

    /** @var EntityManager */
    protected $em;

    /** @var DoctrineOrmLoader  */
    protected $aliceLoader;

    protected function setUpEntityManager()
    {
        $kernel = self::bootKernel();

        $this->em = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->aliceLoader = $kernel->getContainer()->get('hautelook_alice.loader');
    }

    protected static function ensureKernelTestCase(): void
    {
        if (!is_a(static::class, KernelTestCase::class, true)) {
            throw new LogicException(sprintf('The test class must extend "%s" to use "%s".', KernelTestCase::class, static::class));
        }
    }

    protected function createSchema()
    {
        $schemaTool = new SchemaTool($this->em);
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();

        if (!empty($metadata)) {
            $schemaTool->dropSchema($metadata);
            try {
                $schemaTool->createSchema($metadata);
            } catch (ToolsException $e) {
                throw new \InvalidArgumentException("Database schema is not buildable: {$e->getMessage()}", $e->getCode(), $e);
            }
        }
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

    protected function loadFixturesByAlice()
    {
        static::$fixtures = $this->aliceLoader->load(
            new Application(static::$kernel), // OK this is ugly... But there is no other way without redesigning LoaderInterface from the ground.
            $this->em,
            static::$bundles,
            static::$kernel->getEnvironment(),
            static::$append,
            static::$purgeWithTruncate,
            static::$shard
        );
    }

    protected function tearDown(): void
    {
        $this->em->close();
        $this->em = null;
        parent::tearDown();
    }

}
