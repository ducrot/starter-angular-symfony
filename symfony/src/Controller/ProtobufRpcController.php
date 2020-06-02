<?php


namespace App\Controller;


use App\AuthenticationServiceInterface;
use App\Services\AuthenticationService;
use App\Services\TestService;
use App\Services\UserManagementService;
use App\TestServiceInterface;
use App\UserManagementServiceInterface;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Service\ServiceSubscriberInterface;
use TS\Protobuf\HttpHandler;
use TS\Protobuf\ServiceResolver;

class ProtobufRpcController implements ServiceSubscriberInterface
{

    /**
     * All services defined in .proto files should be registered here.
     * Use the implementation as key and the generated service interface
     * as value.
     */
    private const MAPPINGS = [
        TestService::class => TestServiceInterface::class,
        AuthenticationService::class => AuthenticationServiceInterface::class,
        UserManagementService::class => UserManagementServiceInterface::class,
    ];


    /**
     * We use the mappings to subscribe to the service implementations
     * from the container.
     * @return array
     */
    public static function getSubscribedServices()
    {
        return array_keys(self::MAPPINGS);
    }


    private HttpHandler $handler;


    /**
     * PbController constructor.
     *
     * Sets up a handler that routes HTTP requests to the proper service.
     *
     * @param ContainerInterface $locator
     * @param LoggerInterface $logger
     */
    public function __construct(
        ContainerInterface $locator,
        LoggerInterface $logger
    )
    {
        $resolver = new ServiceResolver();
        foreach (self::MAPPINGS as $imp => $int) {
            $resolver->registerFactory($int, function () use ($locator, $imp) {
                return $locator->get($imp);
            });
        }
        $this->handler = new HttpHandler($resolver);
        $this->handler->setLogger($logger);
        $this->handler->setDebug(true);
    }


    /**
     * @Route(
     *     methods={"PUT", "POST", "PATCH"},
     *     path="/api/{serviceName}/{methodName}" ,
     *     name="api-execute"
     * )
     *
     * @param Request $request
     * @param string $serviceName
     * @param string $methodName
     * @return Response
     */
    public function execute(Request $request, string $serviceName, string $methodName): Response
    {
        return $this->handler->handle($serviceName, $methodName, $request);
    }


}
