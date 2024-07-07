<?php

declare(strict_types=1);

use Rector\CodeQuality\Rector\Class_\InlineConstructorDefaultToPropertyRector;
use Rector\Config\RectorConfig;
use Rector\Doctrine\Set\DoctrineSetList;
use Rector\Set\ValueObject\LevelSetList;
use Rector\Set\ValueObject\SetList;
use Rector\Symfony\Set\SymfonySetList;
use Rector\TypeDeclaration\Rector\ClassMethod\AddVoidReturnTypeWhereNoReturnRector;
use Rector\ValueObject\PhpVersion;

/*
 * Best practices:
 * - Add one rule at a time
 * - Run rector after adding each rule
 * - Check the diff
 * - If it's good, commit
 * - If it's not, rollback and debug
 */
return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/config',
        __DIR__.'/src',
        __DIR__.'/tests',
    ])
    ->withRules([
        // InlineConstructorDefaultToPropertyRector::class,
        // AddVoidReturnTypeWhereNoReturnRector::class,
        // ConvertImplicitVariablesToExplicitGlobalsRector::class,
    ])
    ->withPhpVersion(PhpVersion::PHP_82)
    // ->withPhpSets(php82: true)
    ->withSets([
        DoctrineSetList::ANNOTATIONS_TO_ATTRIBUTES,
        SymfonySetList::ANNOTATIONS_TO_ATTRIBUTES,
        // LevelSetList::UP_TO_PHP_82,
        // SetList::CODE_QUALITY,
        // SetList::CODING_STYLE,
        // SetList::DEAD_CODE,
    ])
;
