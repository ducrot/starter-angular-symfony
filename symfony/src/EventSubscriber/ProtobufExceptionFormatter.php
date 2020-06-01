<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 03.05.18
 * Time: 20:18
 */

namespace App\EventSubscriber;


use Common\ServiceError;
use Exception;
use LogicException;
use Symfony\Component\HttpFoundation\AcceptHeaderItem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class ProtobufExceptionFormatter extends ExceptionFormatter
{


    public function supportsAccept(AcceptHeaderItem $headerItem): bool
    {
        return $headerItem->getValue() === 'application/protobuf';
    }


    public function formatHttpException(HttpExceptionInterface $exception, ?string $requestId, bool $includeDetails): Response
    {
        if (!$exception instanceof Exception) {
            throw new LogicException();
        }
        $err = new ServiceError();
        $err->setMessage($exception->getMessage());
        if ($requestId) {
            $err->setRequestId($requestId);
        }
        if ($includeDetails) {
            $err->setStack($exception->__toString());
        }
        $response = new Response($err->serializeToString());
        $response->headers->set('Content-Type', 'application/protobuf');
        return $response;
    }


    public function formatInternalException(Throwable $exception, ?string $requestId, bool $includeDetails): Response
    {
        $err = new ServiceError();
        $err->setMessage('Internal Server Error');
        if ($requestId) {
            $err->setRequestId($requestId);
        }
        if ($includeDetails) {
            $err->setStack($exception->__toString());
        }
        $response = new Response($err->serializeToString());
        $response->headers->set('Content-Type', 'application/protobuf');
        return $response;
    }

}
