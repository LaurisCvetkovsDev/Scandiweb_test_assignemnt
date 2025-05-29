<?php

namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class GalleryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Gallery',
            'fields' => [
                'url' => [
                    'type' => Type::nonNull(Type::string()),
                    'description' => 'The URL of the image'
                ]
            ]
        ]);
    }
}