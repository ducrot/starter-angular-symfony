<?php


namespace App\Controller;

use InvalidArgumentException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\Annotation\Route;


/**
 * Delivers assets of the frontend.
 *
 * Class FrontendController
 * @package App\Controller
 */
class FrontendController
{


    /** @var string */
    private $frontendDir;


    /**
     * FrontendController constructor.
     * @param string $frontendDir
     */
    public function __construct(string $frontendDir)
    {
        $this->frontendDir = realpath($frontendDir);
        if ($this->frontendDir === false) {
            throw new InvalidArgumentException(sprintf('Frontend dir does not exist: %s', $frontendDir));
        }
    }


    /**
     * Deliver the frontend index.html and assets.
     *
     * Unless the requested path starts with one of the exceptions
     * in the "requirements" expression, any request will be caught
     * by this route.
     *
     * If the request path points to an existing file in the
     * frontend directory, it will be delivered.
     *
     * If no file was found, the index.html will be delivered.
     *
     * @Route(
     *     path="/{path}",
     *     requirements={"path" = "^(?!api|api-pb|_profiler).*$"},
     *     methods={"GET"},
     *     name="frontend-asset"
     * )
     *
     * @param string $path
     * @return Response
     */
    public function action(string $path): Response
    {
        if ($path === '') {
            return $this->sendIndex();
        }
        $path = realpath($this->frontendDir . '/' . $path);

        if ($path === false || is_dir($path)) {
            // path does not exist or points to a directory
            return $this->sendIndex();
        }
        if (strpos($path, $this->frontendDir) !== 0) {
            // path is outside of frontend directory
            return $this->sendIndex();
        }

        return $this->sendAsset($path);
    }


    /**
     * Sends the index.html from the frontend directory.
     *
     * We make sure that changes to the index.html are picked up
     * by browsers by providing e-tag and max-age, as recommended
     * by google: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching
     *
     * @return BinaryFileResponse
     */
    private function sendIndex(): BinaryFileResponse
    {
        $path = $this->frontendDir . '/index.html';
        return (new BinaryFileResponse($path))
            ->setPublic()
            ->setMaxAge(60)
            ->setSharedMaxAge(60)
            ->setAutoEtag();
    }


    /**
     * Sends an asset from the frontend directory.
     *
     * If the filename contains a hash, the browser is instructed
     * to cache the file practically indefinitely.
     *
     * Example filename with hash: main.753600caa48968f81869.js
     *
     * @param string $path
     * @return BinaryFileResponse
     */
    private function sendAsset(string $path): BinaryFileResponse
    {
        // detect mime type, bypassing the guesser and using only the file extension
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $types = MimeTypes::getDefault()->getMimeTypes($ext);
        $type = empty($types) ? 'application/octet-stream' : $types[0];

        // detect whether to file name contains a hash (generated by the angular build process)
        $containsHash = preg_match('/[a-zA-Z0-9_-]+\.[a-f0-9]{20}\.[a-z]+/', pathinfo($path, PATHINFO_BASENAME));

        // configure response
        $response = new BinaryFileResponse($path);
        $response->headers->set('Content-Type', $type);
        if ($containsHash) {
            $response
                ->setPublic()
                ->setImmutable(true)
                ->setTtl(3600 * 24 * 30)
                ->setClientTtl(3600 * 24 * 30);
        } else {
            $response->setPublic()
                ->setMaxAge(60)
                ->setSharedMaxAge(60);
        }
        return $response;
    }


}
