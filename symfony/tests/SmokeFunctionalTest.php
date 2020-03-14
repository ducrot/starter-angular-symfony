<?php

namespace App\Tests;

use App\Entity\User;
use App\Security\UserTokenAuthenticator;
use App\Tests\ORM\DatabaseSetupTrait;
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
    use DatabaseSetupTrait;

    /** @var KernelBrowserAlias */
    private $client = null;

    protected function setUp()
    {
        $this->client = static::createClient();

        $this->setUpEntityManager();
        $this->createSchema();
        $this->loadFixtures();
    }

    /**
     * Test if all endpoints with authentication are really secured.
     *
     * @dataProvider secureUrlApiProvider
     */
    public function testAPIisSecure($method, $url)
    {
        $this->client->request($method, $url, [], [], $this->buildAPIHeader('incorrect_api_key'));
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }

    /**
     * Endpoints with authentication.
     *
     * @return \Generator
     */
    public function secureUrlApiProvider()
    {
        yield ['GET', '/api/lucky-number'];
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
        yield ['GET', '/api', false, Response::HTTP_NOT_FOUND];
        yield ['GET', '/api/does-not-exists', false, Response::HTTP_NOT_FOUND];

        yield ['GET', '/api/lucky-number', true, Response::HTTP_OK];
        yield ['POST', '/api/auth/login', false, Response::HTTP_BAD_REQUEST];
        yield ['POST', '/api/auth/login', true, Response::HTTP_BAD_REQUEST];
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
                'HTTP_ACCEPT' => 'application/json'
            ];
        } else {
            return [
                'HTTP_ACCEPT' => 'application/json'
            ];
        }
    }
}
