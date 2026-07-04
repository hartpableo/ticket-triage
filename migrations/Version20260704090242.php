<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260704090242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, domain VARCHAR(255) NOT NULL, api_key VARCHAR(255) NOT NULL, assigned_agent_id INT NOT NULL, INDEX IDX_C744045549197702 (assigned_agent_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE ticket (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(100) NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, category VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, priority VARCHAR(255) NOT NULL, client_id INT NOT NULL, assigned_agent_id INT DEFAULT NULL, INDEX IDX_97A0ADA319EB6921 (client_id), INDEX IDX_97A0ADA349197702 (assigned_agent_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C744045549197702 FOREIGN KEY (assigned_agent_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA319EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA349197702 FOREIGN KEY (assigned_agent_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD title VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE client DROP FOREIGN KEY FK_C744045549197702');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA319EB6921');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA349197702');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE ticket');
        $this->addSql('ALTER TABLE user DROP title');
    }
}
