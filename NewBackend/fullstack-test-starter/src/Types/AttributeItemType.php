<?php

namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'AttributeItem',
            'fields' => [
                'id' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The ID of the attribute item'
                ],
                'value' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The value of the attribute item'
                ],
                'displayValue' => [
                    'type' => Type::string(),
                    'description' => 'The display value of the attribute item'
                ]
            ]
        ]);
    }
}