<?php
namespace App\Resolver;
use Exception;
use App\Database\Database;

class OrderResolver
{
    private static function saveOrderToDatabase($input, $db)
    {
        $db->beginTransaction();
        try {
            $orderId = uniqid('order_');
            $totalAmount = 0; // будет рассчитан ниже

            $orderSql = "INSERT INTO orders (id, total_amount, currency, status, created_at) 
                         VALUES (?, ?, 'USD', 'pending', NOW())";
            $db->prepare($orderSql)->execute([$orderId, 0]);

            foreach ($input['products'] as $product) {
                $priceSql = "SELECT amount FROM product_prices WHERE product_id = ? AND currency_label = 'USD' LIMIT 1";
                $priceStmt = $db->prepare($priceSql);
                $priceStmt->execute([$product['id']]);
                $priceData = $priceStmt->fetch();

                $priceAtTime = $priceData ? (float) $priceData['amount'] : 0;
                $itemTotal = $priceAtTime * $product['quantity'];
                $totalAmount += $itemTotal;

                $itemId = uniqid('item_');
                $itemSql = "INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time, currency) 
                            VALUES (?, ?, ?, ?, ?, 'USD')";
                $db->prepare($itemSql)->execute([$itemId, $orderId, $product['id'], $product['quantity'], $priceAtTime]);

                foreach ($product['selectedAttributes'] as $attr) {
                    $attrSql = "INSERT INTO order_item_attributes (id, order_item_id, attribute_name, selected_value, selected_display_value) 
                                VALUES (?, ?, ?, ?, ?)";
                    $db->prepare($attrSql)->execute([uniqid('attr_'), $itemId, $attr['attributeId'], $attr['value'], $attr['value']]);
                }
            }

            $updateOrderSql = "UPDATE orders SET total_amount = ? WHERE id = ?";
            $db->prepare($updateOrderSql)->execute([$totalAmount, $orderId]);

            $db->commit();
            return $orderId;
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
    }
    public static function createOrder($input)
    {
        try {
            $db = Database::getInstance();
            $orderId = self::saveOrderToDatabase($input, $db);

            return [
                'success' => true,
                'message' => 'Order created successfully',
                'orderId' => $orderId
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
                'orderId' => null
            ];
        }
    }
}