<?php


namespace App\Security;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;


abstract class AbstractBearerTokenAuthenticator extends AbstractGuardAuthenticator
{


    const HEADER_AUTHORIZATION = 'Authorization';
    const BEARER_PREFIX = 'Bearer ';


    abstract protected function getTokenName(): string;


    /**
     * Does this token authenticator support the given token?
     *
     * If you have multiple AbstractBearerTokenAuthenticator
     * implementations you need to determine which one to use
     * here.
     *
     * @param array $credentials
     * @return bool
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
     * @param $token
     * @param Request $request
     * @return string username
     * @throws TokenException
     */
    abstract protected function validateToken(string $token, Request $request): string;


    /**
     * Return the symfony user for the given username, where
     * username is the result of the validateToken() method.
     *
     * We are intentionally not using symfony user providers in
     * order to have full control.
     *
     * @param string $username
     * @return UserInterface|null
     */
    abstract protected function getTokenUser(string $username): ?UserInterface;


    /**
     * If no Authorization header was provided, throw a UnauthorizedHttpException
     * that provides the correct WWW-Authenticate header.
     *
     *
     * The default behaviour of the security component is to call this method
     * when the UserProviderInterface threw a UsernameNotFoundException. The
     * original UsernameNotFoundException will be lost.
     *
     * For bearer token based authentication, it should be okay to present
     * some information about why the authentication failed (other than username
     * password authentication).
     *
     * The AbstractBearerTokenAuthenticator will catch UsernameNotFoundException
     * in getUser() and call this method. The default behaviour is to prepare
     * a HTTP 401 Unauthorized response with the message of the
     * UsernameNotFoundException included in the body.
     *
     *
     *
     * @param Request $request The request that resulted in an AuthenticationException
     * @param AuthenticationException $authException The exception that started the authentication process
     * @return Response|void
     */
    public function start(Request $request = null, AuthenticationException $authException = null)
    {
        $wwwAuthenticate = sprintf('Bearer scope="%s"', $this->getTokenName());
        if ($authException) {
            $msg = $this->provideMessageForAuthenticationException($authException);
        } else {
            $msg = 'Authentication Required';
        }
        throw new UnauthorizedHttpException($wwwAuthenticate, $msg);
    }


    final public function supports(Request $request)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            return false;
        }
        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        if (strpos($auth_header, self::BEARER_PREFIX) !== 0) {
            return false;
        }
        $credentials = $this->getCredentials($request);
        return $this->supportsToken($credentials);
    }


    final public function getCredentials(Request $request)
    {
        $auth_header = $request->headers->get(self::HEADER_AUTHORIZATION);
        $token = substr($auth_header, strlen(self::BEARER_PREFIX));
        return [
            'token' => $token,
            'request' => $request
        ];
    }


    /**
     * If token is invalid or malformed, throw a UnauthorizedHttpException
     * that provides the correct WWW-Authenticate header.
     *
     * @param array $credentials
     * @param UserProviderInterface $userProvider
     * @return null|UserInterface
     */
    final public function getUser($credentials, UserProviderInterface $userProvider)
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

        } catch (UsernameNotFoundException $exception) {
            $this->start(null, $exception);
        }
    }


    protected function provideMessageForTokenException(TokenException $exception): string
    {
        return 'Authentication failed: ' . $exception->getMessage();
    }

    protected function provideMessageForAuthenticationException(AuthenticationException $exception): string
    {
        if ($exception instanceof UsernameNotFoundException) {
            return 'Authentication failed: ' . $exception->getMessage();
        }
        return $exception->getMessage();
    }


    final public function checkCredentials($credentials, UserInterface $user)
    {
        // token is validated in getUser(), no need to check credentials
        return true;
    }


    final public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        // this case is handled
        return null;
    }


    final public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // let the request continue
        return null;
    }


    final public function supportsRememberMe()
    {
        return false;
    }

}
