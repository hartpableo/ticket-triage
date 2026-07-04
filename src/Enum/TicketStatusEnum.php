<?php

namespace App\Enum;

enum TicketStatusEnum: string {
    case Open = 'open';
    case InProgress = 'in_progress';
    case WaitingOnClient = 'waiting_on_client';
    case Resolved = 'resolved';
    case Closed = 'closed';

    public function label(): string {
        return match ($this) {
            self::Open => 'Open',
            self::InProgress => 'In Progress',
            self::WaitingOnClient => 'Waiting on Client',
            self::Resolved => 'Resolved',
            self::Closed => 'Closed',
        };
    }
}
