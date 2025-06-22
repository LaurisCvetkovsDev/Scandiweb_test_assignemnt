<?php
namespace App\Schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OutputTypes
{
    public static function orderResult()
    {
        return new ObjectType([
            'name' => 'OrderResult',
            'fields' => [
                'success' => ['type' => Type::nonNull(Type::boolean())],
                'message' => ['type' => Type::nonNull(Type::string())],
                'orderId' => ['type' => Type::string()]
            ]
        ]);
    }
}