<?php
namespace App\Schema;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class InputTypes
{
    public static function orderInput()
    {
        return new InputObjectType([
            'name' => 'OrderInput',
            'fields' => [
                'products' => [
                    'type' => Type::nonNull(Type::listOf(
                        Type::nonNull(self::orderProductInput())
                    ))
                ]
            ]
        ]);
    }

    public static function orderProductInput()
    {
        return new InputObjectType([
            'name' => 'OrderProductInput',
            'fields' => [
                'id' => ['type' => Type::nonNull(Type::string())],
                'quantity' => ['type' => Type::nonNull(Type::int())],
                'selectedAttributes' => [
                    'type' => Type::nonNull(Type::listOf(
                        Type::nonNull(self::selectedAttributeInput())
                    ))
                ]
            ]
        ]);
    }

    public static function selectedAttributeInput()
    {
        return new InputObjectType([
            'name' => 'SelectedAttributeInput',
            'fields' => [
                'attributeId' => ['type' => Type::nonNull(Type::string())],
                'value' => ['type' => Type::nonNull(Type::string())]
            ]
        ]);
    }
}