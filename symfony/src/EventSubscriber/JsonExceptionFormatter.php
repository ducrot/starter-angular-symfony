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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class JsonExceptionFormatter extends ExceptionFormatter
{


    public function supportsAccept(AcceptHeaderItem $headerItem): bool
    {
        return $headerItem->getValue() === 'application/json';
    }


    public function formatHttpException(HttpExceptionInterface $exception, ?string $requestId, bool $includeDetails): Response
    {
        if (!$exception instanceof Exception) {
            throw new LogicException();
        }
        $data = [
            'message' => $exception->getMessage()
        ];
        if ($requestId) {
            $data['request_id'] = $requestId;
        }
        if ($includeDetails) {
            $data['stack'] = $exception->__toString();
        }
        return new JsonResponse($data);
    }


    public function formatInternalException( Throwable $exception, ?string $requestId, bool $includeDetails): Response
    {
        $data = [
            'message' => 'Internal Server Error'
        ];
        if ($requestId) {
            $data['request_id'] = $requestId;
        }
        if ($includeDetails) {
            $data['stack'] = $exception->__toString();
        }
        return new JsonResponse($data);
    }

}
