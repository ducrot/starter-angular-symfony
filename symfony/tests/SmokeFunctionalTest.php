<?php

namespace App\Tests;

use App\Entity\User;
use App\Security\UserTokenAuthenticator;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser as KernelBrowserAlias;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SmokeFunctionalTest
 *
 * General tests whether the endpoints return the expected status codes. From the check of the status codes, no further
 * check of the transferred or received data takes place. You must create your own tests for this.
 */
class SmokeFunctionalTest extends WebTestCase
{
    use RefreshDatabaseTrait;

    /** @var KernelBrowserAlias */
    private $client = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    /**
     * Test if all endpoints with authentication are secured against wrong credentials.
     *
     * @dataProvider secureUrlApiProvider
     */
    public function testAPIisSecure($method, $url, $expectedStatusCode)
    {
        $this->client->request($method, $url, [], [], $this->buildAPIHeader('incorrect_api_key'));
        $this->assertEquals($expectedStatusCode, $this->client->getResponse()->getStatusCode());
    }

    /**
     * Endpoints with authentication.
     *
     * @return \Generator
     */
    public function secureUrlApiProvider()
    {
        yield ['GET',  '/api/app.TestService/luckyNumber', Response::HTTP_UNAUTHORIZED];
        yield ['POST', '/api/app.TestService/luckyNumber', Response::HTTP_UNAUTHORIZED];
    }

    /**
     * Smoke test.
     *
     * @dataProvider urlApiProvider
     */
    public function testAPIWorks($method, $url, $withAuthentication, $expectedStatusCode)
    {
        $this->client->request($method, $url, [], [], $this->buildAPIHeader($withAuthentication ? $this->generateValidToken() : false));
        $this->assertEquals($expectedStatusCode, $this->client->getResponse()->getStatusCode());
    }

    /**
     * Smoke test at each endpoint
     * @return \Generator
     */
    public function urlApiProvider()
    {
        yield ['GET',  '/api', false, Response::HTTP_NOT_FOUND];
        yield ['POST', '/api', false, Response::HTTP_NOT_FOUND];
        yield ['GET',  '/api/does-not-exists', false, Response::HTTP_INTERNAL_SERVER_ERROR];
        yield ['POST', '/api/does-not-exists', false, Response::HTTP_INTERNAL_SERVER_ERROR];

        yield ['GET',  '/api/app.TestService/luckyNumber', false, Response::HTTP_UNAUTHORIZED];
        yield ['POST', '/api/app.TestService/luckyNumber', false, Response::HTTP_UNAUTHORIZED];
        yield ['GET',  '/api/app.TestService/luckyNumber', true, Response::HTTP_NOT_FOUND];
        yield ['POST', '/api/app.TestService/luckyNumber', true, Response::HTTP_OK];
        yield ['GET',  '/api/app.AuthenticationService/login', false, Response::HTTP_NOT_FOUND];
        yield ['POST', '/api/app.AuthenticationService/login', false, Response::HTTP_BAD_REQUEST];
        yield ['GET',  '/api/app.AuthenticationService/login', true, Response::HTTP_NOT_FOUND];
        yield ['POST', '/api/app.AuthenticationService/login', true, Response::HTTP_BAD_REQUEST];
    }

    private function generateValidToken()
    {
        $authenticator = self::$container->get(\App\Security\UserTokenAuthenticator::class);
        $user = new User();
        $user->setUsername('testuser@domain.tld');
        return $authenticator->generateToken($user);
    }

    private function buildAPIHeader($token)
    {
        if ($token) {
            return [
                'HTTP_' . UserTokenAuthenticator::HEADER_AUTHORIZATION => UserTokenAuthenticator::BEARER_PREFIX . $token,
                'CONTENT_TYPE' => 'application/protobuf',
                'HTTP_ACCEPT' => 'application/protobuf,application/json'
            ];
        } else {
            return [
                'CONTENT_TYPE' => 'application/protobuf',
                'HTTP_ACCEPT' => 'application/protobuf,application/json'
            ];
        }
    }
}
