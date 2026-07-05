<?php

namespace App\Enum;

enum TicketCategoryEnum: string {
    case BugReport = 'bug_report';
    case FeatureRequest = 'feature_request';
    case Question = 'question';
    case Task = 'task';

    public function label(): string {
        return match ($this) {
            self::BugReport => 'Bug Report',
            self::FeatureRequest => 'Feature Request',
            self::Question => 'Question',
            self::Task => 'Task',
        };
    }
}
