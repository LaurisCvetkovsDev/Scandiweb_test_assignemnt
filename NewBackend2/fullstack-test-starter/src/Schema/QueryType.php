<?php
namespace App\Schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\Resolver\CategoryResolver;
use App\Resolver\ProductResolver;

class QueryType
{
    public static function build()
    {
        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::nonNull(Type::listOf(Types::category())),
                    'resolve' => function () {
                        // Здесь будет вызов resolver'а
                        return CategoryResolver::getAll();
                    }
                ],
                'products' => [
                    'type' => Type::nonNull(Type::listOf(Types::product())),
                    'resolve' => function () {
                        return ProductResolver::getAll();
                    }
                ]
            ]
        ]);
    }
}