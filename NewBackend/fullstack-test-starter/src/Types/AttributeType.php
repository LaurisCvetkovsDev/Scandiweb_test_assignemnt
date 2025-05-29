<?php

namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Attribute',
            'fields' => [
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the attribute'
                ],
                'type' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The type of the attribute'
                ],
                'items' => [
                    'type' => Type::listOf(new AttributeItemType()),
                    'description' => 'The items of the attribute'
                ]
            ]
        ]);
    }
}