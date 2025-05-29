<?php

namespace App\Controller;

use Exception;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

require_once __DIR__ . '/../Resolvers/ProductResolver.php';

use App\Resolvers\ProductResolver;

class GraphQL
{
    static public function handle()
    {
        // Set content type for JSON response
        header('Content-Type: application/json; charset=UTF-8');

        try {
            $productResolver = new ProductResolver();

            // Define types inline to avoid potential issues
            $priceType = new ObjectType([
                'name' => 'Price',
                'fields' => [
                    'currencyLabel' => ['type' => Type::string()],
                    'currencySymbol' => ['type' => Type::string()],
                    'amount' => ['type' => Type::float()],
                ]
            ]);

            $galleryType = new ObjectType([
                'name' => 'Gallery',
                'fields' => [
                    'url' => ['type' => Type::string()],
                ]
            ]);

            $attributeItemType = new ObjectType([
                'name' => 'AttributeItem',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'value' => ['type' => Type::string()],
                    'displayValue' => ['type' => Type::string()],
                ]
            ]);

            $attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'name' => ['type' => Type::string()],
                    'type' => ['type' => Type::string()],
                    'items' => ['type' => Type::listOf($attributeItemType)],
                ]
            ]);

            $productType = new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'name' => ['type' => Type::string()],
                    'description' => ['type' => Type::string()],
                    'inStock' => ['type' => Type::boolean()],
                    'category' => ['type' => Type::string()],
                    'prices' => ['type' => Type::listOf($priceType)],
                    'gallery' => ['type' => Type::listOf($galleryType)],
                    'attributes' => ['type' => Type::listOf($attributeType)],
                ]
            ]);

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf($productType),
                        'description' => 'Get all products',
                        'resolve' => function () use ($productResolver) {
                            try {
                                return $productResolver->getAllProducts();
                            } catch (Exception $e) {
                                error_log("Products resolve error: " . $e->getMessage());
                                throw $e;
                            }
                        },
                    ],
                    'product' => [
                        'type' => $productType,
                        'description' => 'Get a single product by ID',
                        'args' => [
                            'id' => [
                                'type' => Type::nonNull(Type::string()),
                                'description' => 'The ID of the product'
                            ]
                        ],
                        'resolve' => function ($rootValue, array $args) use ($productResolver) {
                            try {
                                return $productResolver->getProductById($args['id']);
                            } catch (Exception $e) {
                                error_log("Product resolve error: " . $e->getMessage());
                                throw $e;
                            }
                        },
                    ],
                    'productsByCategory' => [
                        'type' => Type::listOf($productType),
                        'description' => 'Get products by category',
                        'args' => [
                            'category' => [
                                'type' => Type::nonNull(Type::string()),
                                'description' => 'The category name (all, tech, clothes)'
                            ]
                        ],
                        'resolve' => function ($rootValue, array $args) use ($productResolver) {
                            try {
                                return $productResolver->getProductsByCategory($args['category']);
                            } catch (Exception $e) {
                                error_log("ProductsByCategory resolve error: " . $e->getMessage());
                                throw $e;
                            }
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

            error_log("GraphQL Query: " . $query);
            error_log("GraphQL Variables: " . json_encode($variableValues));

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();

            if (isset($output['errors'])) {
                error_log("GraphQL Errors: " . json_encode($output['errors']));
            }

        } catch (Throwable $e) {
            error_log("GraphQL Controller Error: " . $e->getMessage() . " in " . $e->getFile() . " line " . $e->getLine());
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