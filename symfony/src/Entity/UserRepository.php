<?php


namespace App\Entity;


use LogicException;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;


class UserRepository implements UserProviderInterface
{


    /** @var EncoderFactoryInterface */
    private $encoderFactory;


    private $data = [
        ['id' => 1, 'username' => 'max', 'password' => 'muster'],
        ['id' => 2, 'username' => 'peter', 'password' => 'pan'],
    ];


    /**
     * UserRepository constructor.
     * @param EncoderFactoryInterface $encoderFactory
     */
    public function __construct(EncoderFactoryInterface $encoderFactory)
    {
        $this->encoderFactory = $encoderFactory;
    }


    /**
     * @param string $username
     * @return UserInterface|void
     * @throws UsernameNotFoundException
     */
    public function loadUserByUsername(string $username)
    {
        foreach ($this->data as $data) {
            if ($data['username'] === $username) {
                $encoder = $this->encoderFactory->getEncoder(User::class);
                $passwordHash = $encoder->encodePassword($data['password'], null);
                return new User($data['id'], $data['username'], $passwordHash);
            }
        }
        throw new UsernameNotFoundException('Username not found');
    }


    public function refreshUser(UserInterface $user)
    {
        throw new LogicException('Not supported');
    }


    public function supportsClass(string $class)
    {
        return is_subclass_of($class, User::class, true);
    }


}
