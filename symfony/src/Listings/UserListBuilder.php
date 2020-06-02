<?php


namespace App\Listings;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query;
use Generator;

class UserListBuilder extends AbstractListBuilder
{

    public string $search = "";
    public ?bool $disabled = null;


    protected function setup(): void
    {
        $this->disabled = false;
        $this->setPageSizeDefault(20);
        $this->setPageSizeMax(100);
    }

    protected function mapResultRow(object $row): object
    {
        return $row instanceof User ? $row->toProtobuf() : $row;
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


    protected function provideSummary(): Generator
    {
        $this->disabled = false;
        yield "enabledCount";

        $this->disabled = true;
        yield "disabledCount";
    }


}
