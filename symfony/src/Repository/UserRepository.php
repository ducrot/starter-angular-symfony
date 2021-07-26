<?php


namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use LogicException;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserRepository extends ServiceEntityRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function persist(UserInterface $user)
    {
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function checkUniqueEmail(array $properties): \Countable
    {
        $username = $properties['username'] ?? null;
        $id = $properties['id'] ?? null;

        $qb = $this->createQueryBuilder('u')
            ->where('u.username = :username')
            ->setParameter('username', $username);
        if (!empty($id)) {
            $qb
                ->andWhere('u.id != :id')
                ->setParameter('id', $id);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Loads the user for the given user identifier (e.g. username or email).
     * This method must return null if the user is not found.
     * @param string $username
     * @return UserInterface|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function loadUserByIdentifier(string $identifier): ?UserInterface
    {
        if (!is_string($identifier)) {
            throw new \LogicException();
        }

        return $this->createQueryBuilder('u')
            ->where('u.username = :username')
            ->andWhere('u.deleted = :deleted')
            ->andWhere('u.disabled = :disabled')
            ->setParameter('username', $identifier)
            ->setParameter('deleted', false)
            ->setParameter('disabled', false)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function loadUserByUsername(string $username)
    {
        trigger_deprecation('symfony/doctrine-bridge', '5.3', 'Method "%s()" is deprecated, use loadUserByIdentifier() instead.', __METHOD__);

        return $this->loadUserByIdentifier($username);
    }

    public function refreshUser(UserInterface $user)
    {
        throw new LogicException('Not supported');
    }

    public function supportsClass(string $class)
    {
        return is_subclass_of($class, User::class, true);
    }
}
