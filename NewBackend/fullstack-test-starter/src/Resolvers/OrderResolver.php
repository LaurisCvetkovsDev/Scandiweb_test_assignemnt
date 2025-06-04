<?php

namespace App\Resolvers;

use Exception;
use App\Repositories\OrderRepository;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemAttribute;

class OrderResolver
{
    private $orderRepository;

    public function __construct()
    {
        try {
            require_once __DIR__ . '/../Database.php';
            require_once __DIR__ . '/../repositories/OrderRepository.php';

            $dbConn = \Database::getInstance();
            $this->orderRepository = new OrderRepository($dbConn);
        } catch (Exception $e) {
            error_log("OrderResolver constructor error: " . $e->getMessage());
            throw $e;
        }
    }

    public function createOrder(array $input): array
    {
        try {
            $order = new Order(
                '',
                '',
                $input['total_amount'],
                $input['currency'] ?? 'USD',
                'pending'
            );

            $items = [];
            foreach ($input['items'] as $itemInput) {
                $item = new OrderItem(
                    '',
                    '',
                    $itemInput['product_id'],
                    $itemInput['quantity'],
                    $itemInput['price_at_time'],
                    $itemInput['currency'] ?? 'USD'
                );

                if (isset($itemInput['attributes'])) {
                    $item->attributes = array_map(function ($attr) {
                        return new OrderItemAttribute(
                            '',
                            '',
                            $attr['name'],
                            $attr['type'],
                            $attr['selected_value'],
                            $attr['selected_display_value']
                        );
                    }, $itemInput['attributes']);
                }

                $items[] = $item;
            }

            $orderId = $this->orderRepository->createOrder($order, $items);
            return $this->orderRepository->getOrderById($orderId);
        } catch (Exception $e) {
            error_log("createOrder error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getOrder(string $id): ?array
    {
        try {
            return $this->orderRepository->getOrderById($id);
        } catch (Exception $e) {
            error_log("getOrder error: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateOrderStatus(string $id, string $status): bool
    {
        try {
            return $this->orderRepository->updateOrderStatus($id, $status);
        } catch (Exception $e) {
            error_log("updateOrderStatus error: " . $e->getMessage());
            throw $e;
        }
    }
}