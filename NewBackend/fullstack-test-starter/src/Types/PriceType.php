<?php

namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class PriceType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Price',
            'fields' => [
                'currencyLabel' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The currency label'
                ],
                'currencySymbol' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The currency symbol'
                ],
                'amount' => [
                    'type' => Type::nonNull(Type::float()),
                    'description' => 'The price amount'
                ]
            ]
        ]);
    }
}