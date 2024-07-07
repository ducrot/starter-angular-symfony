<?php

namespace App\Tests\Controller;

use App\LoginRequest;
use App\LoginResponse;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser as KernelBrowserAlias;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationControllerTest extends WebTestCase
{
    use RefreshDatabaseTrait;

    private KernelBrowserAlias $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testMethodGetNotAllowed()
    {
        $this->client->request('GET', '/api/app.AuthenticationService/login');
        $this->assertSame(Response::HTTP_NOT_FOUND, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertJson($this->client->getResponse()->getContent());
        $response = json_decode($this->client->getResponse()->getContent());
        $this->assertSame('Method GET not allowed.', $response->msg);
    }

    public function testMissingContentType()
    {
        $this->client->request('POST', '/api/app.AuthenticationService/login');
        $this->assertSame(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertJson($this->client->getResponse()->getContent());
        $response = json_decode($this->client->getResponse()->getContent());
        $this->assertSame('Missing content-type application/protobuf or application/json', $response->msg);
    }

    public function testLoginEmptyCredentials()
    {
        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], ['CONTENT_TYPE' => 'application/json'], '{}');
        $this->assertSame(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertJson($this->client->getResponse()->getContent());
        $response = json_decode($this->client->getResponse()->getContent());
        $this->assertSame('app.form.missing_parameters', $response->msg);
    }

    public function testLoginWrongUsername()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('not-existing-username')
            ->setPassword('not-existing-password');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], ['CONTENT_TYPE' => 'application/protobuf'], $content);
        $this->assertSame(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertJson($this->client->getResponse()->getContent());
        $response = json_decode($this->client->getResponse()->getContent());
        $this->assertSame('app.auth.login.login_failed', $response->msg);
    }

    public function testLoginWrongPassword()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('testuser@domain.tld')
            ->setPassword('not-existing-password');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], ['CONTENT_TYPE' => 'application/protobuf'], $content);
        $this->assertSame(Response::HTTP_UNAUTHORIZED, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertJson($this->client->getResponse()->getContent());
        $response = json_decode($this->client->getResponse()->getContent());
        $this->assertSame('app.auth.login.login_failed', $response->msg);
    }

    public function testLoginSucess()
    {
        $loginRequest = new LoginRequest();
        $loginRequest
            ->setUsername('testuser@domain.tld')
            ->setPassword('A#Very$ecretPwd');
        $content = $loginRequest->serializeToString();

        $this->client->request('POST', '/api/app.AuthenticationService/login', [], [], ['CONTENT_TYPE' => 'application/protobuf'], $content);
        $this->assertSame(Response::HTTP_OK, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
        $this->assertIsString($this->client->getResponse()->getContent());

        $response = new LoginResponse();
        $response->mergeFromString($this->client->getResponse()->getContent());
        $this->assertSame('testuser@domain.tld', $response->getUser()->getUsername());
    }
}
