<?php
/**
 * Created by PhpStorm.
 * User: ts
 * Date: 10.05.18
 * Time: 02:08
 */

namespace App\EventSubscriber;


use Exception;
use LogicException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FinishRequestEvent;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;


/**
 * Class RequestTagger
 *
 * Adds a unique tag to each request.
 * Adds that tag to each log record made during the request.
 *
 * This makes it possible to show the id in user-facing error
 * messages, and look up details in the log.
 *
 */
class RequestTagger implements EventSubscriberInterface
{

    public const REQUEST_ATTRIBUTE_NAME = '_request_id';
    private const LISTENER_PRIORITY = 100;

    public static function getSubscribedEvents()
    {
        // return the subscribed events, their methods and priorities
        return array(
            KernelEvents::REQUEST => [
                ['tagRequest', self::LISTENER_PRIORITY]
            ],
            KernelEvents::FINISH_REQUEST => [
                ['popRequest', self::LISTENER_PRIORITY]
            ]
        );
    }


    /**
     * This is a monolog record processor.
     *
     * @param array $record
     * @return array
     */
    public function __invoke(array $record): array
    {
        if (empty($this->currentRequestTag)) {
            return $record;
        }
        $record['extra']['request_id'] = $this->joinTag();
        return $record;
    }


    public function tagRequest(RequestEvent $event)
    {
        $isSubRequest = $event->getRequestType() == KernelInterface::SUB_REQUEST;
        $this->currentRequestTag[] = $this->generateTag($isSubRequest);
        $tag = $this->joinTag();
        $request = $event->getRequest();
        $request->attributes->set(self::REQUEST_ATTRIBUTE_NAME, $tag);
    }

    public function popRequest(FinishRequestEvent $event)
    {
        array_pop($this->currentRequestTag);
    }


    /**
     * @var array
     */
    private $currentRequestTag = [];


    protected function generateTag(bool $forSubRequest): string
    {
        if ($forSubRequest) {
            return strval(count($this->currentRequestTag));
        }
        $length = 18;
        $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $max = mb_strlen($chars, '8bit') - 1;
        $str = '';
        try {
            for ($i = 0; $i < $length; ++$i) {
                $str .= $chars[random_int(0, $max)];
            }
        } catch (Exception $exception) {
            throw new LogicException('Failed to generate secure random string: ' . $exception->getMessage(), 0, $exception);
        }
        return $str;
    }


    protected function joinTag(): string
    {
        return join('.', $this->currentRequestTag);
    }


}
