<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 03.05.18
 * Time: 20:18
 */

namespace App\EventSubscriber;


use Exception;
use LogicException;
use Symfony\Component\HttpFoundation\AcceptHeaderItem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class PlaintextExceptionFormatter extends ExceptionFormatter
{


    public function supportsAccept(AcceptHeaderItem $headerItem): bool
    {
        return $headerItem->getValue() === 'text/plain';
    }


    public function formatHttpException(HttpExceptionInterface $exception, ?string $requestId, bool $includeDetails): Response
    {
        if (!$exception instanceof Exception) {
            throw new LogicException();
        }
        $text = $exception->getMessage();
        if ($requestId) {
            $text .= sprintf("\nRequest ID: %s\n", $requestId);
        }
        if ($includeDetails) {
            $text .= sprintf("\n\n%s", $exception);
        }
        $response = new Response($text);
        $response->headers->set('Content-Type', 'text/plain; charset=utf-8');
        return $response;
    }


    public function formatInternalException(Throwable $exception, ?string $requestId, bool $includeDetails): Response
    {
        $text = 'Internal Server Error';
        if ($requestId) {
            $text .= sprintf("\nRequest ID: %s\n", $requestId);
        }
        if ($includeDetails) {
            $text .= PHP_EOL;
            $text .= PHP_EOL;
            $text .= get_class($exception) . ': ' . $exception->getMessage() . PHP_EOL;
            $text .= $exception->__toString();
        }
        $response = new Response($text);
        $response->headers->set('Content-Type', 'text/plain; charset=utf-8');
        return $response;
    }


}
