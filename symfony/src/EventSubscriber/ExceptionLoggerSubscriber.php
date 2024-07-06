<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 10.05.18
 * Time: 01:25
 */

namespace App\EventSubscriber;

use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Class ExceptionLoggerSubscriber
 *
 * Logs all exceptions thrown during a request.
 */
class ExceptionLoggerSubscriber implements EventSubscriberInterface
{
    public const LISTENER_PRIORITY = 10;

    public static function getSubscribedEvents(): array
    {
        // return the subscribed events, their methods and priorities
        return [
            KernelEvents::EXCEPTION => [
                [
                    'processException',
                    self::LISTENER_PRIORITY,
                ],
            ],
        ];
    }

    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function processException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $level = $this->getLogLevelForException($exception);
        if (null === $level) {
            return;
        }
        $context = [
            'exception' => $exception,
        ];
        $this->logger->log($level, $exception->getMessage(), $context);
    }

    /**
     * Return NULL to ignore this exception and not log it.
     */
    protected function getLogLevelForException(\Throwable $exception): ?string
    {
        if ($exception instanceof HttpException) {
            $status = $exception->getStatusCode();

            return $this->logLevels[$status] ?? null;
        }

        return LogLevel::ERROR;
    }

    private array $logLevels = [
        Response::HTTP_BAD_REQUEST => LogLevel::ERROR, // 400
        Response::HTTP_UNAUTHORIZED => LogLevel::NOTICE,  // 401
        Response::HTTP_FORBIDDEN => LogLevel::NOTICE,  // 403
        Response::HTTP_NOT_FOUND => null, // 404
        Response::HTTP_METHOD_NOT_ALLOWED => LogLevel::NOTICE, // 405
        Response::HTTP_NOT_ACCEPTABLE => LogLevel::NOTICE, // 406
        Response::HTTP_PROXY_AUTHENTICATION_REQUIRED => LogLevel::NOTICE, // 407
        Response::HTTP_REQUEST_TIMEOUT => LogLevel::NOTICE, // 408
        Response::HTTP_CONFLICT => LogLevel::ERROR, // 409
        Response::HTTP_GONE => LogLevel::NOTICE, // 410
        Response::HTTP_LENGTH_REQUIRED => LogLevel::WARNING, // 411
        Response::HTTP_PRECONDITION_FAILED => LogLevel::NOTICE, // 412
        Response::HTTP_REQUEST_ENTITY_TOO_LARGE => LogLevel::NOTICE, // 413
        Response::HTTP_REQUEST_URI_TOO_LONG => LogLevel::NOTICE, // 414
        Response::HTTP_UNSUPPORTED_MEDIA_TYPE => LogLevel::NOTICE, // 415
        Response::HTTP_REQUESTED_RANGE_NOT_SATISFIABLE => LogLevel::NOTICE, // 416
        Response::HTTP_EXPECTATION_FAILED => LogLevel::NOTICE, // 417
        Response::HTTP_UPGRADE_REQUIRED => LogLevel::NOTICE, // 426
        Response::HTTP_PRECONDITION_REQUIRED => LogLevel::NOTICE, // 428
        Response::HTTP_TOO_MANY_REQUESTS => LogLevel::WARNING, // 429
        Response::HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE => LogLevel::NOTICE, // 431
        Response::HTTP_UNAVAILABLE_FOR_LEGAL_REASONS => LogLevel::NOTICE, // 451
        Response::HTTP_INTERNAL_SERVER_ERROR => LogLevel::ERROR, // 500
        Response::HTTP_NOT_IMPLEMENTED => LogLevel::WARNING, // 501
        Response::HTTP_BAD_GATEWAY => LogLevel::ERROR, // 502
        Response::HTTP_SERVICE_UNAVAILABLE => LogLevel::CRITICAL, // 503
        Response::HTTP_GATEWAY_TIMEOUT => LogLevel::WARNING, // 504
        Response::HTTP_VERSION_NOT_SUPPORTED => LogLevel::NOTICE, // 505
        Response::HTTP_NETWORK_AUTHENTICATION_REQUIRED => LogLevel::NOTICE, // 511
    ];
}
