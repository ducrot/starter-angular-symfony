<?php


namespace App\Services;


use App\CreateUserRequest;
use App\CreateUserResponse;
use App\Listings\UserListBuilder;
use App\ListUsersRequest;
use App\ListUsersResponse;
use App\UserManagementServiceInterface;
use Psr\Log\LoggerInterface;

class UserManagementService implements UserManagementServiceInterface
{


    private UserListBuilder $listBuilder;
    private LoggerInterface $logger;


    public function __construct(UserListBuilder $listBuilder, LoggerInterface $logger)
    {
        $this->listBuilder = $listBuilder;
        $this->logger = $logger;
    }


    public function createUser(CreateUserRequest $request): CreateUserResponse
    {
        throw new \LogicException('not implemented');
    }


    public function listUsers(ListUsersRequest $request): ListUsersResponse
    {

        $this->listBuilder->reset();
        $this->listBuilder->search = $request->getSearchText();
        switch ($request->getDisabled()) {
            case ListUsersRequest\Disabled::YES:
                $this->listBuilder->disabled = true;
                break;
            case ListUsersRequest\Disabled::NO:
                $this->listBuilder->disabled = false;
                break;
            default:
                $this->listBuilder->disabled = null;
                break;
        }
        if ($request->getPage() > 0) {
            $this->listBuilder->page = $request->getPage();
        }
        if ($request->getPageSize() > 0) {
            $this->listBuilder->pageSize = $request->getPageSize();
        }


        $response = new ListUsersResponse();
        $response->setStatus(
            $this->listBuilder->getStatus()
        );
        $response->setItems(
            $this->listBuilder->getResultArray()
        );

        return $response;
    }
}
