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

class HtmlExceptionFormatter extends ExceptionFormatter
{


    public function supportsAccept(AcceptHeaderItem $headerItem): bool
    {
        return true;
    }


    public function formatHttpException(HttpExceptionInterface $exception, ?string $requestId, bool $includeDetails): Response
    {
        if (!$exception instanceof Exception) {
            throw new LogicException();
        }
        $html = sprintf('<h1>%s</h1>', htmlspecialchars($exception->getMessage()));
        $html .= sprintf('<p>HTTP %s</p>', $exception->getStatusCode());
        if ($requestId) {
            $html .= sprintf('<p>Request ID: %s</p>', $requestId);
        }
        if ($includeDetails) {
            $html .= sprintf('<pre>%s</pre>', $exception->__toString());
        }
        $response = new Response($html);
        return $response;
    }


    public function formatInternalException(Throwable $exception, ?string $requestId, bool $includeDetails): Response
    {
        $html = '<h1>Internal Server Error</h1>';
        $html .= '<p>HTTP 500</p>';
        if ($requestId) {
            $html .= sprintf('<p>Request ID: %s</p>', $requestId);
        }
        if ($includeDetails) {

            $html .= '<pre>';
            $html .= htmlspecialchars(get_class($exception) . ': ' . $exception->getMessage()) . PHP_EOL;
            $html .= htmlspecialchars($exception->__toString());
            $html .= '</pre>';


        }
        $response = new Response($html);
        return $response;
    }


}
