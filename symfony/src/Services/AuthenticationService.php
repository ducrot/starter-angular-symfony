<?php

namespace App\Services;

use App\AuthenticationServiceInterface;
use App\ChangePasswordRequest;
use App\ChangePasswordResponse;
use App\Entity\User;
use App\LoginRequest;
use App\LoginResponse;
use App\Security\AuthenticationManager;
use App\Security\LoginCredentials;
use Doctrine\ORM\EntityManagerInterface;
use Google\Protobuf\Timestamp;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use SymfonyTwirpHandler\TwirpError;

class AuthenticationService implements AuthenticationServiceInterface
{
    private AuthenticationManager $manager;
    private Security $security;
    private EntityManagerInterface $em;
    private ValidatorInterface $validator;
    private UserPasswordHasherInterface $passwordHasher;

    /**
     * AuthenticationService constructor.
     */
    public function __construct(
        AuthenticationManager $manager,
        Security $security,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->manager = $manager;
        $this->security = $security;
        $this->em = $em;
        $this->validator = $validator;
        $this->passwordHasher = $passwordHasher;
    }

    public function login(LoginRequest $request): LoginResponse
    {
        if (empty($request->getUsername())) {
            throw new TwirpError('app.form.missing_parameters', TwirpError::INVALID_ARGUMENT);
        }
        if (empty($request->getPassword())) {
            throw new TwirpError('app.form.missing_parameters', TwirpError::INVALID_ARGUMENT);
        }

        // Validate login credentials
        $credentials = new LoginCredentials($request->getUsername(), $request->getPassword());
        $success = $this->manager->validateLogin($credentials);
        if (!$success) {
            throw new TwirpError('app.auth.login.login_failed', TwirpError::UNAUTHENTICATED);
        }

        // Set last login date
        $user = $success->getUser();
        $user->setLastLogin(new \DateTime());
        $this->em->persist($user);
        $this->em->flush();

        // Build response
        $response = new LoginResponse();
        $response->setToken($success->getToken());
        $response->setTokenExpiresAt(
            (new Timestamp())->setSeconds($success->getTokenExpiresAt()->getTimestamp())
        );
        $response->setUser($success->getUser()->toProtobuf());

        return $response;
    }

    public function changePassword(ChangePasswordRequest $request): ChangePasswordResponse
    {
        if (empty($request->getCurrentPassword())) {
            throw new TwirpError('app.form.missing_parameters', TwirpError::INVALID_ARGUMENT);
        }
        if (empty($request->getNewPassword())) {
            throw new TwirpError('app.form.missing_parameters', TwirpError::INVALID_ARGUMENT);
        }
        if (empty($request->getNewPasswordConfirm())) {
            throw new TwirpError('app.form.missing_parameters', TwirpError::INVALID_ARGUMENT);
        }

        /** @var User $user */
        $user = $this->security->getUser();

        // Check current password
        if (!$this->passwordHasher->isPasswordValid($user, $request->getCurrentPassword())) {
            throw new TwirpError('app.auth.account.current_password_not_valid', TwirpError::INVALID_ARGUMENT);
        }

        // Check new password not old password
        if ($request->getNewPassword() == $request->getCurrentPassword()) {
            throw new TwirpError('app.auth.account.new_password_is_equal_current', TwirpError::INVALID_ARGUMENT);
        }

        // Check password confirmation
        if ($request->getNewPassword() != $request->getNewPasswordConfirm()) {
            throw new TwirpError('app.auth.account.new_password_not_equal_confirm_password', TwirpError::INVALID_ARGUMENT);
        }

        // Check password strength
        $passwordStrength = new \Rollerworks\Component\PasswordStrength\Validator\Constraints\PasswordRequirements();
        $passwordStrength->minLength = 8;
        $passwordStrength->requireLetters = true;
        $passwordStrength->requireNumbers = true;
        $passwordStrength->requireSpecialCharacter = true;
        $errors = $this->validator->validate(
            $request->getNewPassword(),
            $passwordStrength
        );
        if (count($errors) > 0) {
            throw new TwirpError('app.auth.account.new_password_bad_password_strength', TwirpError::INVALID_ARGUMENT);
        }

        // save new password
        $pw = $this->passwordHasher->hashPassword($user, $request->getNewPassword());
        $user->setPassword($pw);
        $this->em->persist($user);
        $this->em->flush();

        // Build response
        $response = new ChangePasswordResponse();
        $response->setValid(true);

        return $response;
    }
}
