<?php

namespace App\Tests\Controller;

use App\LoginRequest;
use App\Tests\ORM\DatabaseSetupTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser as KernelBrowserAlias;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationControllerTest extends WebTestCase
{
    use DatabaseSetupTrait;

    /** @var KernelBrowserAlias */
    private $client = null;

    protected function setUp()
    {
        $this->client = static::createClient();

        $this->setUpEntityManager();
        $this->createSchema();
        $this->loadFixturesByAlice();
    }

    public function testLoginEmptyCredentials()
    {
        $this->client->request('POST', '/api/app.AuthenticationService/login');
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginWrongUsername()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('not-existing-username')
            ->setPassword('not-existing-password');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], [], $content);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginWrongPassword()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('testuser@domain.tld')
            ->setPassword('not-existing-password');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], [], $content);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginSucess()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('testuser@domain.tld')
            ->setPassword('A#Very$ecretPwd');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], [], $content);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }
}
