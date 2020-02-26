<?php


namespace App\Security;


use App\ApiModels\LoginCredentials;
use App\ApiModels\LoginSuccess;
use App\Entity\User;
use DateTime;
use LogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class AuthenticationManager
{

    /** @var UserProviderInterface */
    private $userProvider;

    /** @var EncoderFactoryInterface */
    private $encoderFactory;

    /** @var LoggerInterface */
    private $logger;

    /**
     * AuthenticationManager constructor.
     * @param UserProviderInterface $userProvider
     * @param EncoderFactoryInterface $encoderFactory
     * @param LoggerInterface $logger
     */
    public function __construct(UserProviderInterface $userProvider, EncoderFactoryInterface $encoderFactory, LoggerInterface $logger)
    {
        $this->userProvider = $userProvider;
        $this->encoderFactory = $encoderFactory;
        $this->logger = $logger;
    }


    public function validateLogin(LoginCredentials $credentials): ?LoginSuccess
    {
        $user = $this->getUserByCredentials($credentials);
        if (!$user) {
            return null;
        }
        return new LoginSuccess('xxx', new DateTime(), $user);
    }


    private function getUserByCredentials(LoginCredentials $credentials): ?User
    {
        try {
            $user = $this->userProvider->loadUserByUsername($credentials->getUsername());
            $encoder = $this->encoderFactory->getEncoder($user);
            $valid = $encoder->isPasswordValid($user->getPassword(), $credentials->getPassword(), $user->getSalt());
            if (!$valid) {
                $this->logger->warning(sprintf('Failed login attempt with username "%s". Password incorrect.', $credentials->getUsername()));
                return null;
            }
            if (!$user instanceof User) {
                throw new LogicException();
            }
            return $user;

        } catch (UsernameNotFoundException $exception) {
            $this->logger->warning(sprintf('Failed login attempt with username "%s". No user with this name found.', $credentials->getUsername()));
            return null;
        }
    }


}
