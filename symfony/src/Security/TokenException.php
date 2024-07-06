<?php

namespace App\Security;

use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

class TokenException extends \RuntimeException
{
    public static function wrapJWTDecode(\Exception $exception, string $tokenName = ''): self
    {
        if ($exception->getMessage() === '"kid" invalid, unable to lookup correct key') {
            return new self($exception->getMessage(), $tokenName, $exception);
        } elseif ($exception instanceof SignatureInvalidException) {
            return new self($exception->getMessage(), $tokenName, $exception);
        } elseif ($exception instanceof BeforeValidException) {
            return new self($exception->getMessage(), $tokenName, $exception);
        } elseif ($exception instanceof ExpiredException) {
            return new self($exception->getMessage(), $tokenName, $exception);
        } elseif ($exception instanceof \UnexpectedValueException) {
            $msg = 'Unable to parse token: '.$exception->getMessage();

            return new self($msg, $tokenName, $exception, 'invalid_request');
        } elseif ($exception instanceof \DomainException) {
            // json decoding error
            $msg = 'JSON decoding: '.$exception->getMessage();

            return new self($msg, $tokenName, $exception, 'invalid_request');
        } else {
            $msg = 'Unknown error: '.$exception->getMessage();

            return new self($msg, $tokenName, $exception, 'invalid_request');
        }
    }

    /** @var string */
    private $tokenName;

    /** @var string */
    private $errorCode;

    public function __construct(string $message = '', string $tokenName = '', ?\Throwable $previous = null, $error_code = 'invalid_token')
    {
        parent::__construct($message, 0, $previous);
        $this->tokenName = $tokenName;
        $this->errorCode = $error_code;
    }

    public function getTokenName(): string
    {
        return $this->tokenName;
    }

    /**
     * invalid_request / invalid_token / insufficient_scope
     *
     * @see RFC 6750
     */
    public function getTokenErrorCode(): string
    {
        return $this->errorCode;
    }
}
