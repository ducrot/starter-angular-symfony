<?php


namespace App\Services\UserManagement;


use App\Entity\User;
use App\Listings\AbstractListBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query;
use Generator;

class UserListBuilder extends AbstractListBuilder
{

    public string $search = "";
    public ?bool $disabled = null;


// dont really need setup for this simple one
//    protected function setup(): void
//    {
//        $this->disabled = false;
//        $this->setPageSizeDefault(20);
//        $this->setPageSizeMax(100);
//    }


    // at the moment, entity is mapped to proto in UserManagementService.php.
    // could also do this here:
//    protected function mapResultRow(object $row): object
//    {
//        return $row instanceof User ? $row->toProtobuf() : $row;
//    }


    protected function provideSummary(): Generator
    {
        $this->disabled = false;
        yield "enabledCount";

        $this->disabled = true;
        yield "disabledCount";
    }


    protected function buildQuery(EntityManagerInterface $entityManager): Query
    {
        $qb = $entityManager
            ->createQueryBuilder()
            ->from(User::class, 'user')
            ->select('user');

        if (!empty($this->search)) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('user.username', ':search'),
                    $qb->expr()->like('user.firstName', ':search'),
                    $qb->expr()->like('user.lastName', ':search')

                )
            );
            $like = '%' . addcslashes($this->search, '%_') . '%';
            $qb->setParameter('search', $like);
        }

        if ($this->disabled !== null) {
            $qb
                ->andWhere('user.disabled = :disabled')
                ->setParameter('disabled', $this->disabled);
        }

        return $qb->getQuery();
    }


}
