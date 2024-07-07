<?php

namespace App\Tests\Command;

use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;

class CreateAdminUserCommandTest extends KernelTestCase
{
    use RefreshDatabaseTrait;

    protected function setUp(): void
    {
        self::bootKernel();
    }

    public function testExecuteSuccess(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test@test.com',
            'password' => 'password',
        ]);

        $commandTester->assertCommandIsSuccessful('Created admin user with username "test@test.com".');

        // $output = $commandTester->getDisplay();
        // $this->assertStringContainsString('Created admin user with username "test@test.com".', $output);
    }

    public function testExecuteFailureMissingUsername(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => '',
            'password' => 'password',
        ]);

        $this->assertSame(Command::FAILURE, $commandTester->getStatusCode());

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Username must have at least 5 character.', $output);
    }

    public function testExecuteFailureMissingPassword(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test@test.com',
            'password' => '',
        ]);

        $this->assertSame(Command::FAILURE, $commandTester->getStatusCode());

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Password must have at least 8 characters.', $output);
    }

    public function testExecuteFailureInvalidUsername(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test test test',
            'password' => 'password',
        ]);

        $this->assertSame(Command::FAILURE, $commandTester->getStatusCode());

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Username must be a valid email address.', $output);
    }

    public function testExecuteFailureInvalidPassword(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test@test.com',
            'password' => '1234',
        ]);

        $this->assertSame(Command::FAILURE, $commandTester->getStatusCode());

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Password must have at least 8 characters.', $output);
    }

    public function testExecuteFailureExistingUser(): void
    {
        $application = new Application(self::$kernel);

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test@test.com',
            'password' => 'password',
        ]);

        $commandTester->assertCommandIsSuccessful('Created admin user with username "test@test.com".');

        $command = $application->find('app:create-admin-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute([
            'username' => 'test@test.com',
            'password' => 'password',
        ]);

        $this->assertSame(Command::FAILURE, $commandTester->getStatusCode());

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('A user with username "test@test.com" already exists.', $output);
    }
}
