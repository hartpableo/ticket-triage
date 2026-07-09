<?php

namespace App\Enum;

enum CommentTypeEnum: string {
 case System = 'system';
 case Internal = 'internal';

 public function label(): string {
     return match ($this) {
        self::System => 'System',
         self::Internal => 'Internal',
     };
 }
}
