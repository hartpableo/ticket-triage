<?php

namespace App\Enum;

enum TicketPriorityEnum: string {
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
    case Critical = 'critical';
}
