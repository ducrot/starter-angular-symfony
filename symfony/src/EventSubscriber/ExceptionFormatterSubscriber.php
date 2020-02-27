<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 03.05.18
 * Time: 19:29
 */

namespace App\EventSubscriber;


use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\AcceptHeader;
use Symfony\Component\HttpFoundation\AcceptHeaderItem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Throwable;


/**
 * Class ExceptionFormatterSubscriber
 *
 * Formats exceptions thrown during a request in a format
 * that is accepted by the client.
 *
 * All Exceptions implementing HttpExceptionInterface are
 * treated as "public". This means that the exception message
 * will be delivered to the client and should be safe to show
 * to the user.
 *
 * All other exceptions are treated as "private". This means
 * that only a generic error message is delivered to the client.
 *
 * In debug-mode, the full exception stack trace is sent to the
 * client.
 *
 * This subscriber works together with the RequestTagger.
 *
 * @package App\EventSubscriber
 */
class ExceptionFormatterSubscriber implements EventSubscriberInterface
{

    /**
     * Register the exception event with this priority so
     * that the symfony firewall exception listener can
     * wrap security exceptions in http exceptions before
     * they reach us.
     *
     * @see \Symfony\Component\Security\Http\Firewall\ExceptionListener
     */
    const LISTENER_PRIORITY = 0;

    public static function getSubscribedEvents()
    {
        // return the subscribed events, their methods and priorities
        return array(
            KernelEvents::EXCEPTION => array(
                array(
                    'processException',
                    self::LISTENER_PRIORITY
                )
            )
        );
    }

    private $debug;
    private $formatters;

    public function __construct(array $formatters, bool $debug = false)
    {
        $this->debug = $debug;
        $this->formatters = $formatters;
    }


    public function processException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        $acceptHeader = AcceptHeader::fromString($event->getRequest()->headers->get('Accept'));

        /** @var AcceptHeaderItem $item */
        /** @var ExceptionFormatter $formatter */
        foreach ($acceptHeader->all() as $item) {
            foreach ($this->formatters as $formatter) {
                if (!$formatter->supportsAccept($item)) {
                    continue;
                }
                $request = $event->getRequest();
                $response = $this->formatException($request, $exception, $formatter, $this->debug);
                $event->setResponse($response);
                return;
            }
        }
    }


    protected function formatException(Request $request, Throwable $exception, ExceptionFormatter $formatter, bool $debug): Response
    {
        if ($this->shouldShowRequestIdForException($exception, $request)) {
            $requestId = $this->findRequestId($request);
        } else {
            $requestId = null;
        }

        if ($exception instanceof HttpExceptionInterface) {
            $response = $formatter->formatHttpException($exception, $requestId, $debug);
            $response->setStatusCode($exception->getStatusCode());
            $response->headers->add($exception->getHeaders());
        } else {
            $response = $formatter->formatInternalException($exception, $requestId, $debug);
        }
        return $response;
    }

    protected function shouldShowRequestIdForException(Throwable $exception, Request $request): bool
    {
        if ($exception instanceof HttpException) {
            $blacklist = [
                Response::HTTP_NOT_FOUND, // 404
                Response::HTTP_METHOD_NOT_ALLOWED, // 405
                Response::HTTP_NOT_ACCEPTABLE, // 406
                Response::HTTP_PROXY_AUTHENTICATION_REQUIRED, // 407
                Response::HTTP_LENGTH_REQUIRED, // 411
            ];
            $status = $exception->getStatusCode();
            if (in_array($status, $blacklist) === true) {
                return false;
            }
        }
        return true;
    }


    protected function findRequestId(Request $request): ?string
    {
        if (!$request->attributes->has(RequestTagger::REQUEST_ATTRIBUTE_NAME)) {
            return null;
        }
        return $request->attributes->get(RequestTagger::REQUEST_ATTRIBUTE_NAME);
    }


}
