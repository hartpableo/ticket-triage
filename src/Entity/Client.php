<?php

namespace App\Entity;

use App\Enum\TicketStatusEnum;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\Column(length: 255)]
    private ?string $api_key = null;

    #[ORM\ManyToOne(inversedBy: 'clients')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $assigned_agent = null;

    /**
     * @var Collection<int, Ticket>
     */
    #[ORM\OneToMany(targetEntity: Ticket::class, mappedBy: 'client')]
    private Collection $tickets;

    private ?int $openTicketsCount = null;

    public function __construct()
    {
        $this->tickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDomain(): ?string
    {
        return $this->domain;
    }

    public function setDomain(string $domain): static
    {
        $this->domain = $domain;

        return $this;
    }

    public function getApiKey(): ?string
    {
        return $this->api_key;
    }

    public function setApiKey(string $api_key): static
    {
        $this->api_key = $api_key;

        return $this;
    }

    public function getAssignedAgent(): ?User
    {
        return $this->assigned_agent;
    }

    public function setAssignedAgent(?User $assigned_agent): static
    {
        $this->assigned_agent = $assigned_agent;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    /**
     * Get the number of open tickets for this client.
     */
    public function getOpenTicketsCount(): int
    {
        if ($this->openTicketsCount !== null) {
            return $this->openTicketsCount;
        }

        $count = 0;
        foreach ($this->tickets as $ticket) {
            if ($ticket->getStatus() === TicketStatusEnum::Open) {
                $count++;
            }
        }
        return $count;
    }

    public function setOpenTicketsCount(int $openTicketsCount): static
    {
        $this->openTicketsCount = $openTicketsCount;

        return $this;
    }

    public function addTicket(Ticket $ticket): static
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets->add($ticket);
            $ticket->setClient($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): static
    {
        if ($this->tickets->removeElement($ticket)) {
            // set the owning side to null (unless already changed)
            if ($ticket->getClient() === $this) {
                $ticket->setClient(null);
            }
        }

        return $this;
    }
}
