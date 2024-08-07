<?php

declare(strict_types=1);

namespace App\Entity;

use App\Gender;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Google\Protobuf\Timestamp;
use Rollerworks\Component\PasswordStrength\Validator\Constraints as RollerworksPassword;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherAwareInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: \App\Repository\UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[UniqueEntity('username', message: 'invalid_unique_entity_username')]
class User implements UserInterface, PasswordAuthenticatedUserInterface, PasswordHasherAwareInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255, unique: true)]
    #[Assert\NotBlank(message: 'invalid_assert_not_blank_username')]
    #[Assert\Email(message: 'invalid_assert_email_username')]
    private string $username;

    #[ORM\Column(type: 'simple_array')]
    private array $roles = ['ROLE_USER'];

    /**
     * @RollerworksPassword\PasswordRequirements(minLength=8, requireLetters=true, requireNumbers=true, requireSpecialCharacter=true)
     */
    #[ORM\Column(type: 'string', length: 100)]
    #[Assert\Length(max: 4096)]
    private string $password;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    #[Assert\Length(max: 50)]
    private ?string $firstName;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank(message: 'invalid_assert_not_blank_last_name')]
    #[Assert\Length(max: 50)]
    private string $lastName;

    #[ORM\Column(type: 'smallint', options: ['unsigned' => true, 'default' => 0])]
    #[Assert\Choice(callback: ['App\Entity\User', 'getGenders'], message: 'invalid_assert_choice_gender')] // 0: GENDER_NONE
    private int $gender = Gender::GENDER_NONE;

    #[ORM\Column(type: 'boolean')]
    private bool $disabled = false;

    #[ORM\Column(type: 'boolean')]
    private bool $deleted = false;

    #[ORM\Column(type: 'datetime')]
    private \DateTime $created;

    #[ORM\Column(type: 'datetime')]
    private \DateTime $updated;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $passwordChanged;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $lastLogin;

    /**
     * Update record (UPDATE)
     */
    #[ORM\PreUpdate]
    public function onPreUpdate(PreUpdateEventArgs $event): void
    {
        if (!$event->hasChangedField('lastlogin')) {
            $this->updated = new \DateTime();
        }

        if ($event->hasChangedField('password')) {
            $this->passwordChanged = new \DateTime();
        }
    }

    public function __toString(): string
    {
        return $this->username;
    }

    public static function getGenders(): array
    {
        return [Gender::GENDER_NONE, Gender::GENDER_MALE, Gender::GENDER_FEMALE, Gender::GENDER_MISC];
    }

    private function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }

    /** @see UserInterface */
    public function getSalt(): ?string
    {
        // not needed when using a modern hashing algorithm (e.g. bcrypt or sodium) in security.yaml
        return null;
    }

    /** @see UserInterface */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getPasswordHasherName(): ?string
    {
        // use the default passwordHasher
        return null;
    }

    public function toProtobuf(): \App\User
    {
        $pb = new \App\User();
        $pb->setId($this->getId() ?? '');
        $pb->setUsername($this->getUsername());
        $pb->setRoles($this->getRoles());
        $pb->setFirstName($this->getFirstName() ?? '');
        $pb->setLastName($this->getLastName());
        $pb->setGender($this->getGender());
        $pb->setIsAdmin($this->isAdmin());
        if ($this->getLastLogin()) {
            $lastLogin = new Timestamp();
            $lastLogin->fromDateTime($this->getLastLogin());
            $pb->setLastLogin($lastLogin);
        }

        return $pb;
    }

    public function getUserIdentifier(): string
    {
        return $this->getUsername();
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /******************************************************************************************
     * auto generated:
     */

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGender(): int
    {
        return $this->gender;
    }

    public function setGender(int $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    public function setDisabled(bool $disabled): self
    {
        $this->disabled = $disabled;

        return $this;
    }

    public function isDeleted(): bool
    {
        return $this->deleted;
    }

    public function setDeleted(bool $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getCreated(): \DateTime
    {
        return $this->created;
    }

    public function setCreated(\DateTime $created): self
    {
        $this->created = $created;

        return $this;
    }

    public function getUpdated(): \DateTime
    {
        return $this->updated;
    }

    public function setUpdated(\DateTime $updated): self
    {
        $this->updated = $updated;

        return $this;
    }

    public function getPasswordChanged(): ?\DateTime
    {
        return $this->passwordChanged;
    }

    public function setPasswordChanged(?\DateTime $passwordChanged): self
    {
        $this->passwordChanged = $passwordChanged;

        return $this;
    }

    public function getLastLogin(): ?\DateTime
    {
        return $this->lastLogin;
    }

    public function setLastLogin(?\DateTime $lastLogin): self
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }
}
