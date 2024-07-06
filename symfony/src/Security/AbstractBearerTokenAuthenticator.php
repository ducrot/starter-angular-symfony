<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

abstract class AbstractBearerTokenAuthenticator extends AbstractGuardAuthenticator
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
    protected function supportsToken(array $credentials): bool
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

    /**
     * If no Authorization header was provided, throw a UnauthorizedHttpException
     * that provides the correct WWW-Authenticate header.
     *
     * The default behaviour of the security component is to call this method
     * when the UserProviderInterface threw a UserNotFoundException. The
     * original UserNotFoundException will be lost.
     *
     * For bearer token based authentication, it should be okay to present
     * some information about why the authentication failed (other than username
     * password authentication).
     *
     * The AbstractBearerTokenAuthenticator will catch UserNotFoundException
     * in getUser() and call this method. The default behaviour is to prepare
     * a HTTP 401 Unauthorized response with the message of the
     * UserNotFoundException included in the body.
     *
     * @param Request|null                 $request       The request that resulted in an AuthenticationException
     * @param AuthenticationException|null $authException The exception that started the authentication process
     *
     * @return Response|void
     */
    public function start(?Request $request = null, ?AuthenticationException $authException = null)
    {
        $msg = $authException ? $this->provideMessageForAuthenticationException($authException) : 'Authentication Required';
        $wwwAuthenticate = sprintf('Bearer scope="%s"', $this->getTokenName());
        throw new UnauthorizedHttpException($wwwAuthenticate, $msg);
    }

    final public function supports(Request $request): bool
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            return false;
        }
        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        if (!str_starts_with($auth_header, self::BEARER_PREFIX)) {
            return false;
        }
        $credentials = $this->getCredentials($request);

        return $this->supportsToken($credentials);
    }

    final public function getCredentials(Request $request): array
    {
        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        $token = substr($auth_header, strlen(self::BEARER_PREFIX));

        return [
            'token' => $token,
            'request' => $request,
        ];
    }

    /**
     * If token is invalid or malformed, throw a UnauthorizedHttpException
     * that provides the correct WWW-Authenticate header.
     *
     * @param array $credentials
     */
    final public function getUser($credentials, UserProviderInterface $userProvider): ?UserInterface
    {
        try {
            $username = $this->validateToken($credentials['token'], $credentials['request']);
        } catch (TokenException $exception) {
            $scope = $exception->getTokenName();
            $error = $exception->getTokenErrorCode();
            $error_desc = $exception->getMessage();
            $wwwAuthenticate = sprintf('Bearer token="%s", error="%s", error_description="%s"', $scope, $error, $error_desc);
            $msg = $this->provideMessageForTokenException($exception);
            throw new UnauthorizedHttpException($wwwAuthenticate, $msg, $exception);
        }

        try {
            return $this->getTokenUser($username);
        } catch (UserNotFoundException $exception) {
            $this->start(null, $exception);
        }
    }

    protected function provideMessageForTokenException(TokenException $exception): string
    {
        return 'Authentication failed: '.$exception->getMessage();
    }

    protected function provideMessageForAuthenticationException(AuthenticationException $exception): string
    {
        if ($exception instanceof UserNotFoundException) {
            return 'Authentication failed: '.$exception->getMessage();
        }

        return $exception->getMessage();
    }

    final public function checkCredentials($credentials, UserInterface $user): bool
    {
        // token is validated in getUser(), no need to check credentials
        return true;
    }

    final public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // this case is handled
        return null;
    }

    final public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey): ?Response
    {
        // let the request continue
        return null;
    }

    final public function supportsRememberMe(): bool
    {
        return false;
    }
}
