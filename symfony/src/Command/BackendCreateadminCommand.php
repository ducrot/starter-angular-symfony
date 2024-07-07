<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class BackendCreateadminCommand extends Command
{
    protected static $defaultName = 'backend:createadmin';

    /** @var UserRepository */
    private $userRepository;

    /** @var UserPasswordHasherInterface */
    private $passwordHasher;

    /** @var ValidatorInterface */
    private $validator;

    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator)
    {
        parent::__construct();
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Create admin user')
            ->setHelp('Create a new user with administrative access.')
            ->addArgument('username', InputArgument::REQUIRED, 'Username of the user')
            ->addArgument('password', InputArgument::REQUIRED, 'Password of the user')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $username = $input->getArgument('username');
        $password = $input->getArgument('password');
        $givenUsername = $username;
        $username = strtolower(preg_replace('/\\s/i', '', $username));

        if ($givenUsername !== $username) {
            $output->writeln(sprintf('<warning>Given username "%s" contains invalid characters. Using "%s" instead.</warning>', $givenUsername, $username));
        }

        if (strlen($username) < 5) {
            $io->error('Username must have at least 5 character.');

            return Command::FAILURE;
        }

        $emailConstraint = new Assert\Email();
        $emailConstraint->message = 'Username must be a valid email address.';
        $errors = $this->validator->validate(
            $username,
            $emailConstraint
        );
        if (count($errors)) {
            foreach ($errors as $error) {
                $io->error($error->getMessage());
            }

            return Command::FAILURE;
        }

        if (strlen($password) < 8) {
            $io->error('Password must have at least 8 characters.');

            return Command::FAILURE;
        }

        $userExists = $this->userRepository->loadUserByIdentifier($username);
        if ($userExists) {
            $io->error(sprintf('A user with username "%s" already exists.', $username));

            return Command::FAILURE;
        }

        $user = new User();
        $user
            ->setUsername($username)
            ->setPassword($this->passwordHasher->hashPassword($user, $password))
            ->setLastName('Admin')
            ->setRoles(['ROLE_ADMIN'])
            ->setCreated(new \DateTime())
            ->setUpdated(new \DateTime());

        $this->userRepository->persist($user);

        $io->success(sprintf('Created admin user with username "%s".', $username));

        return Command::SUCCESS;
    }
}
