<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 03.05.18
 * Time: 20:17
 */

namespace App\EventSubscriber;


use Symfony\Component\HttpFoundation\AcceptHeaderItem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

abstract class ExceptionFormatter
{

    abstract public function supportsAccept(AcceptHeaderItem $headerItem): bool;


    /**
     * Creates a adequate Response for the given HttpException.
     *
     * @param HttpExceptionInterface $exception
     * @param null|string $requestId
     * @param bool $includeDetails
     * @return Response
     */
    abstract public function formatHttpException(HttpExceptionInterface $exception, ?string $requestId, bool $includeDetails): Response;


    /**
     * Create a Response for the given unexpected exception.
     *
     * @param Throwable $exception
     * @param null|string $requestId
     * @param bool $includeDetails
     * @return Response
     */
    abstract public function formatInternalException(Throwable $exception, ?string $requestId, bool $includeDetails): Response;


}
