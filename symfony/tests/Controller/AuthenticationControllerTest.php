<?php

namespace App\Tests\Controller;

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
        $this->loadFixtures();
    }

    public function testLoginEmptyCredentials()
    {
        $this->client->request('POST', '/api/app.AuthenticationService/login');
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginWrongUsername()
    {
        $content = json_encode([
            'username' => 'not-existing-username',
            'password' => 'not-existing-password',
        ]);
        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], [], $content);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }

    public function testLoginWrongPassword()
    {
        $content = json_encode([
            'username' => 'testuser@domain.tld',
            'password' => 'not-existing-password',
        ]);
        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], [], $content);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode());
    }
}
