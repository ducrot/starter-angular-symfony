<?php
declare(strict_types=1);

namespace App\Entity;

use App\Gender;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Google\Protobuf\Timestamp;
use Rollerworks\Component\PasswordStrength\Validator\Constraints as RollerworksPassword;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class User implements UserInterface
{
    const
        GENDER_NONE = 0,
        GENDER_MALE = 1,
        GENDER_FEMALE = 2,
        GENDER_MISC = 3;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="guid")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\NotBlank(message="Eine gültige E-Mail-Adresse muss eingegeben werden.")
     * @Assert\Email(message="Eine gültige E-Mail-Adresse muss eingegeben werden.")
     */
    private $username;

    /**
     * @var array
     * @ORM\Column(type="array")
     */
    private $roles = ['ROLE_USER'];

    /**
     * @var string
     * @ORM\Column(type="string", length=100)
     * @Assert\Length(max=4096)
     * @RollerworksPassword\PasswordRequirements(minLength=8, requireLetters=true, requireNumbers=true, requireSpecialCharacter=true)
     */
    private $password;

    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Assert\Length(max=50)
     */
    private $firstName;

    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Assert\Length(max=50)
     */
    private $lastName;

    /**
     * @var integer
     * @ORM\Column(type="smallint", options={"unsigned"=true, "default"=0})
     * @Assert\Choice(callback={"App\Entity\User", "getGenders"})
     *
     * 0: none
     * 1: male
     * 2: female
     * 3: misc
     */
    private $gender = self::GENDER_NONE;

    /**
     * @var int
     * @ORM\Column(type="boolean")
     */
    private $disabled = false;

    /**
     * @var int
     * @ORM\Column(type="boolean")
     */
    private $deleted = false;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     */
    private $created;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     */
    private $updated;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $passwordChanged;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastLogin;

    /**
     * Update record (UPDATE)
     *
     * @ORM\PreUpdate
     */
    public function onPreUpdate(PreUpdateEventArgs $event)
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

    /**
     * Roles helper function.
     *
     * @return array
     */
    public static function getGenders(): array
    {
        return [self::GENDER_NONE, self::GENDER_MALE, self::GENDER_FEMALE, self::GENDER_MISC];
    }

    private function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }

    /** @see UserInterface */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /** @see UserInterface */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function toProtobuf(): \App\User
    {
        $pb = new \App\User();
        $pb->setId($this->getId() ?? "");
        $pb->setUsername($this->getUsername() ?? "");
        $pb->setRoles($this->getRoles());
        $pb->setFirstName($this->getFirstName() ?? "");
        $pb->setLastName($this->getLastName() ?? "");
        $pb->setGender($this->getGender() ?? Gender::NONE);
        $pb->setIsAdmin($this->isAdmin());
        if ($this->getLastLogin()) {
            $lastLogin = new Timestamp();
            $lastLogin->fromDateTime($this->getLastLogin());
            $pb->setLastLogin($lastLogin);
        }
        return $pb;
    }


    /******************************************************************************************
     * auto generated:
     */

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
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

    public function getPassword(): ?string
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

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGender(): ?int
    {
        return $this->gender;
    }

    public function setGender(int $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getDisabled(): ?int
    {
        return $this->disabled;
    }

    public function setDisabled(int $disabled): self
    {
        $this->disabled = $disabled;

        return $this;
    }

    public function getDeleted(): ?int
    {
        return $this->deleted;
    }

    public function setDeleted(int $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getCreated(): ?\DateTimeInterface
    {
        return $this->created;
    }

    public function setCreated(\DateTimeInterface $created): self
    {
        $this->created = $created;

        return $this;
    }

    public function getUpdated(): ?\DateTimeInterface
    {
        return $this->updated;
    }

    public function setUpdated(\DateTimeInterface $updated): self
    {
        $this->updated = $updated;

        return $this;
    }

    public function getPasswordChanged(): ?\DateTimeInterface
    {
        return $this->passwordChanged;
    }

    public function setPasswordChanged(?\DateTimeInterface $passwordChanged): self
    {
        $this->passwordChanged = $passwordChanged;

        return $this;
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->lastLogin;
    }

    public function setLastLogin(?\DateTimeInterface $lastLogin): self
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

}
