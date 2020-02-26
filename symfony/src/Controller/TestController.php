<?php


namespace App\Controller;

use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
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

}
