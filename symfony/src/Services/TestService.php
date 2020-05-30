<?php


namespace App\Services;


use App\LuckyNumberRequest;
use App\LuckyNumberResponse;
use App\TestCallRequest;
use App\TestCallResponse;
use App\TestServiceInterface;
use Exception;
use Google\Protobuf\GPBEmpty;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class TestService implements TestServiceInterface
{


    public function testCall(TestCallRequest $request): TestCallResponse
    {
        $amount = $request->getAmount();
        $searchText = $request->getSearchText();
        $response = new TestCallResponse();
        $response->setOk(true);
        $response->setResult("You sent amount = {$amount} and search text = '{$searchText}'");
        return $response;
    }


    public function luckyNumber(LuckyNumberRequest $request): LuckyNumberResponse
    {
        $response = new LuckyNumberResponse();
        $response->setNumber(
            random_int(0, 100)
        );
        return $response;
    }

    public function badRequestError(GPBEmpty $request): GPBEmpty
    {
        // throwing any kind of HttpException will show the message to the user

        throw new BadRequestHttpException('Your request does not look so good....');
        // alternatively: throw new HttpException(Response::HTTP_BAD_REQUEST, '...')
    }

    public function processingError(GPBEmpty $request): GPBEmpty
    {
        throw new UnprocessableEntityHttpException("I'm afraid I can't do that, Dave.");
        // alternatively: throw new HttpException(Response::HTTP_UNPROCESSABLE_ENTITY, '...')
    }

    public function unexpectedError(GPBEmpty $request): GPBEmpty
    {
        // throwing any other exception will show a generic message to the user

        throw new Exception("Something went really wrong, don't know what :/");
    }
}
