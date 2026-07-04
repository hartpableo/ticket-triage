<?php

namespace App\Enum;

enum TicketCategoryEnum: string {
    case BugReport = 'bug_report';
    case FeatureRequest = 'feature_request';
    case Question = 'question';
    case Task = 'task';
}
