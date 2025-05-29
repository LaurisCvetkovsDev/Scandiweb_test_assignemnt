<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

require_once __DIR__ . '/../Types/ProductType.php';
require_once __DIR__ . '/../Types/CategoryType.php';
require_once __DIR__ . '/../Types/PriceType.php';
require_once __DIR__ . '/../Types/GalleryType.php';
require_once __DIR__ . '/../Types/AttributeType.php';
require_once __DIR__ . '/../Types/AttributeItemType.php';
require_once __DIR__ . '/../Resolvers/ProductResolver.php';

use App\Types\ProductType;
use App\Resolvers\ProductResolver;

class GraphQL
{
    static public function handle()
    {
        // Set content type for JSON response
        header('Content-Type: application/json; charset=UTF-8');

        try {
            $productResolver = new ProductResolver();

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf(new ProductType()),
                        'description' => 'Get all products',
                        'resolve' => function () use ($productResolver) {
                            return $productResolver->getAllProducts();
                        },
                    ],
                    'product' => [
                        'type' => new ProductType(),
                        'description' => 'Get a single product by ID',
                        'args' => [
                            'id' => [
                                'type' => Type::nonNull(Type::string()),
                                'description' => 'The ID of the product'
                            ]
                        ],
                        'resolve' => function ($rootValue, array $args) use ($productResolver) {
                            return $productResolver->getProductById($args['id']);
                        },
                    ],
                    'productsByCategory' => [
                        'type' => Type::listOf(new ProductType()),
                        'description' => 'Get products by category',
                        'args' => [
                            'category' => [
                                'type' => Type::nonNull(Type::string()),
                                'description' => 'The category name (all, tech, clothes)'
                            ]
                        ],
                        'resolve' => function ($rootValue, array $args) use ($productResolver) {
                            return $productResolver->getProductsByCategory($args['category']);
                        },
                    ],
                ],
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('Invalid JSON input');
            }

            $query = $input['query'] ?? '';
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'errors' => [
                    [
                        'message' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]
                ],
            ];
        }

        return json_encode($output);
    }
}