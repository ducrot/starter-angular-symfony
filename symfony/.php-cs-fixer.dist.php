<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude('src-pb')
    ->exclude('var')
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        // '@PHP81Migration' => true,
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'array_syntax' => ['syntax' => 'short'],
        'combine_nested_dirname' => true,
        'fopen_flags' => false,
        'native_constant_invocation' => true,
        'php_unit_dedicate_assert' => ['target' => '5.6'],
        'protected_to_private' => false,

        // Customize for your own style
        'method_argument_space' => true,
        'native_function_invocation' => false,
        'phpdoc_separation' => ['groups' => [['ORM\*', 'Assert\*'], ['deprecated', 'link', 'see', 'since'], ['author', 'copyright', 'license'], ['category', 'package', 'subpackage'], ['property', 'property-read', 'property-write']]],
        'phpdoc_summary' => false,
        'yoda_style' => false,
    ])
    ->setFinder($finder);
