<?php

declare(strict_types=1);

namespace App\Services\UserManagement;

use App\CreateUserRequest;
use App\CreateUserResponse;
use App\Entity\User;
use App\ListUserRequest;
use App\ListUserResponse;
use App\UpdateUserRequest;
use App\UpdateUserResponse;
use App\UserManagementServiceInterface;
use SymfonyTwirpHandler\TwirpError;

class UserManagementService implements UserManagementServiceInterface
{
    private UserListBuilder $listBuilder;
    private UserDto $userDto;

    public function __construct(UserListBuilder $listBuilder, UserDto $userDto)
    {
        $this->listBuilder = $listBuilder;
        $this->userDto = $userDto;
    }

    public function create(CreateUserRequest $request): CreateUserResponse
    {
        $this->userDto->reset();
        $this->userDto->create();
        $this->userDto->setUsername($request->getUsername());
        $this->userDto->setPassword($request->getPassword());
        $this->userDto->setFirstName($request->getFirstName());
        $this->userDto->setLastName($request->getLastName());
        $this->userDto->setGender($request->getGender());
        $this->userDto->setAdmin($request->getIsAdmin());

        if ($this->userDto->save()) {
            $response = new CreateUserResponse();
            $response->setUser(
                $this->userDto->getUser()->toProtobuf()
            );

            return $response;
        }

        throw new TwirpError($this->getErrorMessage(), TwirpError::INVALID_ARGUMENT);
    }

    public function update(UpdateUserRequest $request): UpdateUserResponse
    {
        $this->userDto->reset();
        $this->userDto->load($request->getId());
        $this->userDto->setUsername($request->getUsername());
        $this->userDto->setFirstName($request->getFirstName());
        $this->userDto->setLastName($request->getLastName());
        $this->userDto->setGender($request->getGender());
        $this->userDto->setAdmin($request->getIsAdmin());

        if ($this->userDto->save()) {
            $response = new UpdateUserResponse();
            $response->setUser(
                $this->userDto->getUser()->toProtobuf()
            );

            return $response;
        }

        throw new TwirpError($this->getErrorMessage(), TwirpError::INVALID_ARGUMENT);
    }

    //    public function delete(DeleteRequest $request): DeleteResponse
    //    {
    //        throw new LogicException('not implemented');
    //    }

    public function list(ListUserRequest $request): ListUserResponse
    {
        $this->listBuilder->reset();
        $this->listBuilder->search = $request->getSearchText();
        switch ($request->getDisabled()) {
            case ListUserRequest\Disabled::YES:
                $this->listBuilder->disabled = true;
                break;
            case ListUserRequest\Disabled::NO:
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

        $response = new ListUserResponse();
        $response->setStatus(
            $this->listBuilder->getStatus()
        );
        $response->setItems(
            $this->listBuilder->getResultArray(fn (User $u) => $u->toProtobuf())
        );

        return $response;
    }

    public function getErrorMessage()
    {
        $error = $this->userDto->getErrors()->get(0);

        return sprintf(
            '%s%s',
            $error->getMessage(),
            in_array($error->getPropertyPath(), ['password', 'password_repeat', 'password_confirm']) ? '' : (' '.$error->getInvalidValue())
        );
    }
}
