<?php


namespace App\Controller;

use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Annotation\Route;


class TestController
{

    /**
     * @Route("/api/lucky-number")
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function number(): JsonResponse
    {
        $number = random_int(0, 100);
        return new JsonResponse($number);
    }


    /**
     * @Route("/api/bad-request")
     */
    public function badRequestError(): void
    {
        // throwing any kind of HttpException will show the message to the user

        throw new BadRequestHttpException('Your request does not look so good....');
        // alternatively: throw new HttpException(Response::HTTP_BAD_REQUEST, '...')
    }

    /**
     * @Route("/api/processing-error")
     */
    public function processingError(): void
    {
        throw new UnprocessableEntityHttpException("I'm afraid I can't do that, Dave.");
        // alternatively: throw new HttpException(Response::HTTP_UNPROCESSABLE_ENTITY, '...')
    }

    /**
     * @Route("/api/unexpected-error")
     * @throws Exception
     */
    public function unexpectedError(): void
    {
        // throwing any other exception will show a generic message to the user

        throw new Exception("Something went really wrong, don't know what :/");
    }

}
