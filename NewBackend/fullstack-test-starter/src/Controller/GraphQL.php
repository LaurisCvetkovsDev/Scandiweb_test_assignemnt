<?php

namespace App\Controller;

use Exception;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

require_once __DIR__ . '/../Resolvers/ProductResolver.php';
require_once __DIR__ . '/../Resolvers/OrderResolver.php';

use App\Resolvers\ProductResolver;
use App\Resolvers\OrderResolver;

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

            // Add these types before the QueryType definition
            $orderItemAttributeType = new ObjectType([
                'name' => 'OrderItemAttribute',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'name' => ['type' => Type::string()],
                    'type' => ['type' => Type::string()],
                    'selected_value' => ['type' => Type::string()],
                    'selected_display_value' => ['type' => Type::string()]
                ]
            ]);

            $orderItemType = new ObjectType([
                'name' => 'OrderItem',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'product_id' => ['type' => Type::string()],
                    'product_name' => ['type' => Type::string()],
                    'product_description' => ['type' => Type::string()],
                    'quantity' => ['type' => Type::int()],
                    'price_at_time' => ['type' => Type::float()],
                    'currency' => ['type' => Type::string()],
                    'attributes' => ['type' => Type::listOf($orderItemAttributeType)]
                ]
            ]);

            $orderType = new ObjectType([
                'name' => 'Order',
                'fields' => [
                    'id' => ['type' => Type::string()],
                    'created_at' => ['type' => Type::string()],
                    'total_amount' => ['type' => Type::float()],
                    'currency' => ['type' => Type::string()],
                    'status' => ['type' => Type::string()],
                    'items' => ['type' => Type::listOf($orderItemType)]
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
                    'order' => [
                        'type' => $orderType,
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::string())]
                        ],
                        'resolve' => function ($root, $args) {
                            $resolver = new \App\Resolvers\OrderResolver();
                            return $resolver->getOrder($args['id']);
                        }
                    ]
                ],
            ]);

            // Add these to the MutationType fields
            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'createOrder' => [
                        'type' => $orderType,
                        'args' => [
                            'input' => [
                                'type' => new InputObjectType([
                                    'name' => 'CreateOrderInput',
                                    'fields' => [
                                        'total_amount' => ['type' => Type::nonNull(Type::float())],
                                        'currency' => ['type' => Type::string()],
                                        'items' => [
                                            'type' => Type::nonNull(Type::listOf(new InputObjectType([
                                                'name' => 'OrderItemInput',
                                                'fields' => [
                                                    'product_id' => ['type' => Type::nonNull(Type::string())],
                                                    'quantity' => ['type' => Type::nonNull(Type::int())],
                                                    'price_at_time' => ['type' => Type::nonNull(Type::float())],
                                                    'currency' => ['type' => Type::string()],
                                                    'attributes' => [
                                                        'type' => Type::listOf(new InputObjectType([
                                                            'name' => 'OrderItemAttributeInput',
                                                            'fields' => [
                                                                'name' => ['type' => Type::nonNull(Type::string())],
                                                                'type' => ['type' => Type::nonNull(Type::string())],
                                                                'selected_value' => ['type' => Type::nonNull(Type::string())],
                                                                'selected_display_value' => ['type' => Type::nonNull(Type::string())]
                                                            ]
                                                        ]))
                                                    ]
                                                ]
                                            ])))
                                        ]
                                    ]
                                ])
                            ]
                        ],
                        'resolve' => function ($root, $args) {
                            $resolver = new \App\Resolvers\OrderResolver();
                            return $resolver->createOrder($args['input']);
                        }
                    ],
                    'updateOrderStatus' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::string())],
                            'status' => ['type' => Type::nonNull(Type::string())]
                        ],
                        'resolve' => function ($root, $args) {
                            $resolver = new \App\Resolvers\OrderResolver();
                            return $resolver->updateOrderStatus($args['id'], $args['status']);
                        }
                    ]
                ]
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
                    ->setMutation($mutationType)
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