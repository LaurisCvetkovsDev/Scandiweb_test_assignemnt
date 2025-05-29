<?php

namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/PriceType.php';
require_once __DIR__ . '/GalleryType.php';
require_once __DIR__ . '/AttributeType.php';

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => [
                'id' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The ID of the product'
                ],
                'name' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The name of the product'
                ],
                'description' => [
                    'type' => Type::string(),
                    'description' => 'The description of the product'
                ],
                'inStock' => [
                    'type' => Type::nonNull(Type::boolean()),
                    'description' => 'Whether the product is in stock'
                ],
                'category' => [
                    'type' => Type::string(),
                    'description' => 'The category of the product'
                ],
                'prices' => [
                    'type' => Type::listOf(new PriceType()),
                    'description' => 'The prices of the product'
                ],
                'gallery' => [
                    'type' => Type::listOf(new GalleryType()),
                    'description' => 'The gallery images of the product'
                ],
                'attributes' => [
                    'type' => Type::listOf(new AttributeType()),
                    'description' => 'The attributes of the product'
                ]
            ]
        ]);
    }
}