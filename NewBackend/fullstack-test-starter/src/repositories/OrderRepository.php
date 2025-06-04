<?php

namespace App\Repositories;

use PDO;
use Exception;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemAttribute;

require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';
require_once __DIR__ . '/../models/OrderItemAttribute.php';

class OrderRepository
{
    private PDO $conn;

    public function __construct(PDO $conn)
    {
        $this->conn = $conn;
    }

    public function createOrder(Order $order, array $items): string
    {
        try {
            $this->conn->beginTransaction();

            // Insert order
            $orderId = uniqid('order_');
            $stmt = $this->conn->prepare("
                INSERT INTO orders (id, total_amount, currency, status)
                VALUES (:id, :total_amount, :currency, :status)
            ");
            $stmt->execute([
                'id' => $orderId,
                'total_amount' => $order->total_amount,
                'currency' => $order->currency,
                'status' => $order->status
            ]);

            // Insert order items
            foreach ($items as $item) {
                $itemId = uniqid('item_');
                $stmt = $this->conn->prepare("
                    INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time, currency)
                    VALUES (:id, :order_id, :product_id, :quantity, :price_at_time, :currency)
                ");
                $stmt->execute([
                    'id' => $itemId,
                    'order_id' => $orderId,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price_at_time' => $item->price_at_time,
                    'currency' => $item->currency
                ]);

                // Insert item attributes if any
                if (isset($item->attributes) && is_array($item->attributes)) {
                    foreach ($item->attributes as $attr) {
                        $attrId = uniqid('attr_');
                        $stmt = $this->conn->prepare("
                            INSERT INTO order_item_attributes 
                            (id, order_item_id, attribute_name, attribute_type, selected_value, selected_display_value)
                            VALUES (:id, :order_item_id, :attribute_name, :attribute_type, :selected_value, :selected_display_value)
                        ");
                        $stmt->execute([
                            'id' => $attrId,
                            'order_item_id' => $itemId,
                            'attribute_name' => $attr->attribute_name,
                            'attribute_type' => $attr->attribute_type,
                            'selected_value' => $attr->selected_value,
                            'selected_display_value' => $attr->selected_display_value
                        ]);
                    }
                }
            }

            $this->conn->commit();
            return $orderId;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getOrderById(string $id): ?array
    {
        // Get order details
        $stmt = $this->conn->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            return null;
        }

        // Get order items
        $stmt = $this->conn->prepare("
            SELECT oi.*, p.name as product_name, p.description as product_description
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = :order_id
        ");
        $stmt->execute(['order_id' => $id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get item attributes
        foreach ($items as &$item) {
            $stmt = $this->conn->prepare("
                SELECT 
                    id,
                    attribute_name as name,
                    attribute_type as type,
                    selected_value,
                    selected_display_value
                FROM order_item_attributes
                WHERE order_item_id = :order_item_id
            ");
            $stmt->execute(['order_item_id' => $item['id']]);
            $item['attributes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return [
            'order' => $order,
            'items' => $items
        ];
    }

    public function updateOrderStatus(string $id, string $status): bool
    {
        $stmt = $this->conn->prepare("
            UPDATE orders 
            SET status = :status 
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'status' => $status
        ]);
    }
}