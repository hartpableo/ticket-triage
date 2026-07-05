<?php

namespace App\Repository;

use App\Entity\Client;
use App\Enum\TicketStatusEnum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Client>
 */
class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    /**
     * @return Client[]
     */
    public function findAllWithOpenTicketsCount(): array
    {
        $results = $this->createQueryBuilder('c')
            ->select('c', 'COUNT(t.id) as openCount')
            ->leftJoin('c.tickets', 't', 'WITH', 't.status = :status')
            ->setParameter('status', TicketStatusEnum::Open)
            ->groupBy('c.id')
            ->getQuery()
            ->getResult();

        $clients = [];
        foreach ($results as $row) {
            /** @var Client $client */
            $client = $row[0];
            $client->setOpenTicketsCount((int) $row['openCount']);
            $clients[] = $client;
        }

        return $clients;
    }

    //    /**
    //     * @return Client[] Returns an array of Client objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Client
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
