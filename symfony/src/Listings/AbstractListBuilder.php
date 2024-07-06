<?php

namespace App\Listings;

use Common\ListStatus;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * Class AbstractListBuilder
 *
 * Helps with building lists that are paginated, filterable and sortable.
 *
 * To create a basic list builder that only supports pagination,
 * extend this class and override buildQuery().
 *
 *
 * ### Filtering
 *
 * For filtering, just add a public property and use it in buildQuery().
 * The following rules apply:
 * - all public properties are considered to be filters
 * - filters must be of a scalar type
 * - filter must be initialized with a value that does not filter anything
 * - if you want to provide a default filter value, override setup()
 *   and do it there
 *
 *
 * ### Empty
 *
 * To distinguish between a list that is empty because all items have been
 * filtered away and a list that is empty because no items exist, use
 * isResultEmpty().
 *
 *
 * ### Constraints
 *
 * Sometimes you need filters that should be hidden from the user.
 * You can use constraints for that.
 *
 * Example: You have several customers. Every customer should only see
 * data that belongs to him. If you use a filter for that, isResultEmpty()
 * might be false because items exists for other customers.
 *
 *
 * ### Summary
 *
 * A summary can contain counts for alternative filters. If you have a
 * filter for "enabled", you could add a summary item for "enabledCount"
 * and a summary item for "disabledCount":
 *
 * protected function provideSummary(): Generator
 * {
 *   $this->disabled = false;
 *   yield "enabledCount";
 *
 *   $this->disabled = true;
 *   yield "disabledCount";
 * }
 *
 * Each time you yield, the list builder will query the count for
 * the current filters and then reset the filters again.
 */
abstract class AbstractListBuilder
{
    public int $page = 1;
    public int $pageSize = -1;

    private EntityManagerInterface $entityManager;
    private int $pageSizeDefault = 100;
    private int $pageSizeMax = 100;
    private array $filterEmpty;
    private array $filterDefaults;
    private ?array $filterLastExecuted = null;
    private array $constraintDefaults;
    private ?array $constraintLastExecuted = null;
    private int $resultCount = 0;
    private bool $resultEmpty = false;
    private array $resultSummary = [];
    private ?iterable $resultRows;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->filterEmpty = $this->captureFilters();
        $this->setup();
        $this->filterDefaults = $this->captureFilters();
        $this->constraintDefaults = $this->captureConstraints();
    }

    /**
     * Override this method to set max / default page size
     * or to set default filter values.
     *
     * You should really only do this here, else there will
     * be side effects.
     */
    protected function setup(): void
    {
        // $this->setPageSizeMax(50);
        // $this->setPageSizeDefault(10);
    }

    /**
     * Override this method to convert the result rows to a different format,
     * expand the data with additional queries, etc.
     */
    protected function mapResultRow(object $row): object
    {
        return $row;
    }

    /**
     * Implement your query here. Use your filter properties as you like.
     *
     * This method might be invoked multiple times with different filter values
     * to calculate the summary and the empty status.
     */
    abstract protected function buildQuery(EntityManagerInterface $entityManager): Query;

    /**
     * Override this method to provide a summary.
     */
    protected function provideSummary(): \Generator
    {
        yield from [];
    }

    final public function getStatus(): ListStatus
    {
        $status = new ListStatus();
        $status->setPage($this->page);
        $status->setPageSize($this->getActualPageSize());
        $status->setCount($this->getResultCount());
        $status->setEmpty($this->isResultEmpty());
        $status->setSummary($this->getResultSummary());

        return $status;
    }

    final public function getPageSizeDefault(): int
    {
        return $this->pageSizeDefault;
    }

    final protected function setPageSizeDefault(int $size): void
    {
        if ($size < 0) {
            throw new \InvalidArgumentException(sprintf('Page size %s is too small, must be 0 or greater. ', $size));
        }
        $this->pageSizeDefault = $size;
    }

    final public function getPageSizeMax(): int
    {
        return $this->pageSizeMax;
    }

    final protected function setPageSizeMax(int $size): void
    {
        if ($size < 0) {
            throw new \InvalidArgumentException(sprintf('Max page size %s is too small, must be 0 or greater. ', $size));
        }
        $this->pageSizeMax = $size;
    }

    final public function getActualPageSize(): int
    {
        $m = $this->getPageSizeMax();
        $d = $this->getPageSizeDefault();
        $a = $this->pageSize;

        return min($a < 0 ? $d : $a, $m);
    }

    /**
     * Executes the query if necessary and returns the resulting rows.
     *
     * The rows may have already been processed by this list builder,
     * but you can further manipulate the rows by passing the $map
     * argument. The map function takes one row item and can return
     * any object.
     */
    final public function getResult(?callable $map = null): iterable
    {
        $this->ensureExecuted();
        if ($map === null) {
            yield from $this->resultRows;

            return;
        }
        foreach ($this->resultRows as $row) {
            try {
                yield $map($row);
            } catch (\Exception $exception) {
                throw new \LogicException('Result mapping function threw an exception: '.$exception->getMessage(), 0, $exception);
            }
        }
    }

    /**
     * Same as getResult(), but converts the rows to an array.
     */
    final public function getResultArray(?callable $map = null): array
    {
        $a = [];
        array_push($a, ...$this->getResult($map));

        return $a;
    }

    final public function getResultCount(): int
    {
        $this->ensureExecuted();

        return $this->resultCount;
    }

    final public function isResultEmpty(): bool
    {
        $this->ensureExecuted();

        return $this->resultEmpty;
    }

    final public function getResultSummary(): array
    {
        $this->ensureExecuted();

        return $this->resultSummary;
    }

    private function execute(): void
    {
        // backup filter we're executing now
        $filterBackup = $this->captureFilters();

        // build a query with filters
        $filtered_query = $this->buildQuery($this->entityManager);

        // apply pagination
        if ($this->page <= 0) {
            throw new \OutOfRangeException(sprintf('Provided page number %s is out of range. Page numbers start with 1.', $this->page));
        }
        if ($filtered_query->getMaxResults() !== null) {
            throw new \LogicException('Max result is set on query provided by buildQuery(). Do not set max result, it will be overridden by pagination.');
        }
        $filtered_query
            ->setFirstResult($this->getActualPageSize() * ($this->page - 1))
            ->setMaxResults($this->getActualPageSize());

        // execute
        $filtered_pag = new Paginator($filtered_query, false);
        $this->resultRows = $this->mapResultRows($filtered_pag);
        $this->resultCount = (int) $filtered_pag->count();

        // calculate empty
        $this->resultEmpty = false;
        if ($filtered_pag->count() === 0) {
            $this->restoreFilters($this->filterEmpty);
            $unfiltered_query = $this->buildQuery($this->entityManager);
            $unfiltered_pag = new Paginator($unfiltered_query);
            if ($unfiltered_pag->count() === 0) {
                $this->resultEmpty = true;
            }
            $this->restoreFilters($filterBackup);
        }

        // calculate summary
        foreach ($this->provideSummary() as $name) {
            $summary_query = $this->buildQuery($this->entityManager);
            $summary_pag = new Paginator($summary_query);
            $this->restoreFilters($filterBackup);
            $this->resultSummary[$name] = $summary_pag->count();
        }

        // remember executed filters
        $this->filterLastExecuted = $filterBackup;
    }

    final public function reset()
    {
        $this->page = -1;
        $this->pageSize = -1;
        $this->resultEmpty = false;
        $this->resultCount = 0;
        $this->resultSummary = [];
        $this->resultRows = null;
        $this->restoreFilters($this->filterDefaults);
        $this->restoreConstraints($this->constraintDefaults);
    }

    final protected function ensureExecuted(): void
    {
        if ($this->filterLastExecuted === null) {
            $this->execute();

            return;
        }
        if ($this->constraintLastExecuted === null) {
            $this->execute();

            return;
        }
        $diff = array_diff($this->captureFilters(), $this->filterLastExecuted);
        if (!empty($diff)) {
            $this->execute();

            return;
        }
        $diff = array_diff($this->captureConstraints(), $this->constraintLastExecuted);
        if (!empty($diff)) {
            $this->execute();

            return;
        }
    }

    private function mapResultRows(iterable $rows): iterable
    {
        foreach ($rows as $row) {
            yield $this->mapResultRow($row);
        }
    }

    private function captureFilters(): array
    {
        $filters = [];
        try {
            $ref = new \ReflectionClass($this);
            foreach ($ref->getProperties(\ReflectionProperty::IS_PUBLIC) as $property) {
                $name = $property->getName();
                if (str_starts_with(strtolower($name), 'constraint')) {
                    continue;
                }
                $value = $property->getValue($this);
                if (null !== $value && !is_scalar($value)) {
                    throw new \LogicException(sprintf('Detected non-scalar public property "%s" on %s. All public properties of %s instances must be scalar.', $name, static::class, self::class));
                }
                $filters[$name] = $value;
            }

            return $filters;
        } catch (\ReflectionException $exception) {
            throw new \LogicException('Caught reflection exception while trying to capture filters: '.$exception->getMessage(), 0, $exception);
        }
    }

    private function restoreFilters(array $vars): void
    {
        foreach ($vars as $key => $value) {
            $this->{$key} = $value;
        }
    }

    private function captureConstraints(): array
    {
        $constraints = [];
        try {
            $ref = new \ReflectionClass($this);
            foreach ($ref->getProperties(\ReflectionProperty::IS_PUBLIC) as $property) {
                $name = $property->getName();
                if (!str_starts_with(strtolower($name), 'constraint')) {
                    continue;
                }
                $value = $property->getValue($this);
                if (null !== $value && !is_scalar($value)) {
                    throw new \LogicException(sprintf('Detected non-scalar public property "%s" on %s. All public properties of %s instances must be scalar.', $name, static::class, self::class));
                }
                $constraints[$name] = $value;
            }

            return $constraints;
        } catch (\ReflectionException $exception) {
            throw new \LogicException('Caught reflection exception while trying to capture constraints: '.$exception->getMessage(), 0, $exception);
        }
    }

    private function restoreConstraints(array $vars): void
    {
        foreach ($vars as $key => $value) {
            $this->{$key} = $value;
        }
    }
}
