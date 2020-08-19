<?php


namespace App\Services;


use App\LuckyNumberRequest;
use App\LuckyNumberResponse;
use SymfonyTwirpHandler\TwirpError;
use App\TestCallRequest;
use App\TestCallResponse;
use App\TestServiceInterface;
use Exception;
use Google\Protobuf\GPBEmpty;

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
        // throwing a TwirpException will show the message to the user

        throw new TwirpError('Your request does not look so good....', TwirpError::INVALID_ARGUMENT);
    }

    public function processingError(GPBEmpty $request): GPBEmpty
    {
        throw new TwirpError("I'm afraid I can't do that, Dave.", TwirpError::ALREADY_EXISTS);
    }

    public function unexpectedError(GPBEmpty $request): GPBEmpty
    {
        // throwing any other exception will show a generic message to the user

        throw new Exception("Something went really wrong, don't know what :/");
    }
}
