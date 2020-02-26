<?php


namespace App\Security;


use DateInterval;
use Exception;
use Firebase\JWT\JWT;

class UserToken
{

    const TOKEN_NAME = 'User Token';
    const JWT_ALG = 'HS256';
    const SUBJECT_TYPE = 'standard_user';


    /**
     * Create a token to authenticate a user request from the frontend.
     *
     * @param string $username
     * @param string $issuer
     * @param string $secret
     * @param DateInterval $ttl
     * @return string
     * @throws Exception
     */
    public static function create(string $username, string $issuer, string $secret, DateInterval $ttl): string
    {
        $now = date_create_immutable();

        $claims = [

            // Issuer Claim, RFC7519
            'iss' => $issuer,

            // Subject Claim, RFC7519
            'sub' => $username,

            'sub_type' => self::SUBJECT_TYPE,

            // Not Before Claim, RFC7519
            'nbf' => $now->getTimestamp(),

            // Issued At Claim, RFC7519
            'iat' => $now->getTimestamp(),

            // Expiration Time Claim, RFC7519
            'exp' => $now->add($ttl)->getTimestamp()

        ];

        return JWT::encode(
            $claims,
            $secret,
            self::JWT_ALG
        );
    }


    public static function supports(string $token): bool
    {
        $tks = explode('.', $token);
        if (count($tks) != 3) {
            return false;
        }
        if (false === $body = JWT::urlsafeB64Decode($tks[1])) {
            return false;
        }
        try {
            $payload = JWT::jsonDecode($body);
        } catch (Exception $exception) {
            return false;
        }
        if ($payload === null || !isset($payload->sub_type)) {
            return false;
        }
        return $payload->sub_type === self::SUBJECT_TYPE;
    }


    /**
     * Validate a users token.
     *
     * @param string $token
     * @param string $issuer
     * @param string $secret
     * @return string username
     * @throws TokenException
     */
    public static function validate(string $token, string $issuer, string $secret): string
    {
        $payload = null;

        try {
            $payload = (array)JWT::decode($token, $secret, [self::JWT_ALG]);
        } catch (Exception $exception) {
            throw TokenException::wrapJWTDecode($exception, self::TOKEN_NAME);
        }

        $actual_iss = $payload['iss'] ?? '';
        $expected_iss = $issuer;
        if ($actual_iss !== $expected_iss) {
            $msg = sprintf('Issuer "%s" does not match expected issuer.', $actual_iss);
            throw new TokenException($msg, self::TOKEN_NAME);
        }

        $subject = $payload['sub'] ?? null;
        if (empty($subject)) {
            $msg = 'Missing subject claim.';
            throw new TokenException($msg, self::TOKEN_NAME);
        }

        return $subject;

    }
}
