<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

abstract class AbstractBearerTokenAuthenticator extends AbstractAuthenticator
{
    public const HEADER_AUTHORIZATION = 'Authorization';
    public const BEARER_PREFIX = 'Bearer ';

    abstract protected function getTokenName(): string;

    /**
     * Does this token authenticator support the given token?
     *
     * If you have multiple AbstractBearerTokenAuthenticator
     * implementations you need to determine which one to use
     * here.
     */
    protected function supportsToken(string $token): bool
    {
        return true;
    }

    /**
     * Validate the given token and return a username.
     *
     * If the validation fails, throw a TokenException.
     *
     * @return string username
     *
     * @throws TokenException
     */
    abstract protected function validateToken(string $token, Request $request): string;

    /**
     * Return the symfony user for the given username, where
     * username is the result of the validateToken() method.
     *
     * We are intentionally not using symfony user providers in
     * order to have full control.
     */
    abstract protected function getTokenUser(string $username): ?UserInterface;

    final public function supports(Request $request): bool
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            return false;
        }

        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        if (!str_starts_with($auth_header, self::BEARER_PREFIX)) {
            return false;
        }

        $token = substr($auth_header, strlen(self::BEARER_PREFIX));

        return $this->supportsToken($token);
    }

    public function authenticate(Request $request): Passport
    {
        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        $token = substr($auth_header, strlen(self::BEARER_PREFIX));

        try {
            $username = $this->validateToken($token, $request);
        } catch (TokenException $exception) {
            $scope = $exception->getTokenName();
            $error = $exception->getTokenErrorCode();
            $error_desc = $exception->getMessage();
            $wwwAuthenticate = sprintf('Bearer token="%s", error="%s", error_description="%s"', $scope, $error, $error_desc);
            $msg = $this->provideMessageForTokenException($exception);
            throw new UnauthorizedHttpException($wwwAuthenticate, $msg, $exception);
        }

        return new SelfValidatingPassport(new UserBadge($username));
    }

    protected function provideMessageForTokenException(TokenException $exception): string
    {
        return 'Authentication failed: '.$exception->getMessage();
    }

    final public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // this case is handled
        return null;
    }

    final public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // let the request continue
        return null;
    }
}
