<?php


namespace App\Services\UserManagement;


use App\CreateRequest;
use App\CreateResponse;
use App\Entity\User;
use App\ListRequest;
use App\ListResponse;
use App\UpdateRequest;
use App\UpdateResponse;
use App\UserManagementServiceInterface;
use LogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserManagementService implements UserManagementServiceInterface
{


    private UserListBuilder $listBuilder;
    private UserCreator $creator;
    private LoggerInterface $logger;


    public function __construct(UserListBuilder $listBuilder, UserCreator $creator, LoggerInterface $logger)
    {
        $this->listBuilder = $listBuilder;
        $this->creator = $creator;
        $this->logger = $logger;
    }


    public function create(CreateRequest $request): CreateResponse
    {
        $this->creator->reset();
        $this->creator->setUsername($request->getUsername());
        $this->creator->setPassword($request->getPassword());
        $this->creator->setAdmin($request->getIsAdmin());

        if ($this->creator->create()) {
            $response = new CreateResponse();
            $response->setUser(
                $this->creator->getUser()->toProtobuf()
            );
            return $response;
        }

        $e = $this->creator->getErrors()->get(0);
        $msg = $e->getPropertyPath() . ': ' . $e->getMessage() . " " . $e->getInvalidValue();
        throw new BadRequestHttpException($msg);
    }


    public function update(UpdateRequest $request): UpdateResponse
    {
        throw new LogicException('not implemented');
    }


    public function list(ListRequest $request): ListResponse
    {

        $this->listBuilder->reset();
        $this->listBuilder->search = $request->getSearchText();
        switch ($request->getDisabled()) {
            case ListRequest\Disabled::YES:
                $this->listBuilder->disabled = true;
                break;
            case ListRequest\Disabled::NO:
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


        $response = new ListResponse();
        $response->setStatus(
            $this->listBuilder->getStatus()
        );
        $response->setItems(
            $this->listBuilder->getResultArray(fn(User $u) => $u->toProtobuf())
        );

        return $response;
    }

}
