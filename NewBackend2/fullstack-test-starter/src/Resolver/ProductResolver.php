<?php

namespace App\Resolver;

use App\Database\Database;
use App\Model\Product;
use PDO;

class ProductResolver
{
    public static function getAll($args = [])
    {
        $db = Database::getInstance();

        $sql = "SELECT * FROM products";
        if (isset($args['category'])) {
            $sql .= " WHERE category = ?";
            $params = [$args['category']];
        } else {
            $params = [];
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $productsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $products = [];
        foreach ($productsData as $productData) {
            $productData['prices'] = self::getProductPrices($db, $productData['id']);
            $productData['gallery'] = self::getProductGallery($db, $productData['id']);
            $productData['attributes'] = self::getProductAttributes($db, $productData['id']);

            $productData['inStock'] = (bool) $productData['in_stock']; // Переименовываем поле
            $productData['brand'] = $productData['brand'] ?? '';
            $productData['description'] = $productData['description'] ?? '';

            $products[] = $productData;
        }

        return $products;
    }

    private static function getProductPrices($db, $productId)
    {
        $sql = "SELECT amount, currency_label, currency_symbol FROM product_prices WHERE product_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$productId]);
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($prices as $price) {
            $result[] = [
                'amount' => (float) $price['amount'],
                'currency' => [
                    'label' => $price['currency_label'],
                    'symbol' => $price['currency_symbol']
                ]
            ];
        }
        return $result;
    }

    private static function getProductGallery($db, $productId)
    {
        $sql = "SELECT image_url FROM product_gallery WHERE product_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$productId]);
        $gallery = $stmt->fetchAll(PDO::FETCH_COLUMN);
        return $gallery;
    }

    private static function getProductAttributes($db, $productId)
    {
        $sql = "SELECT DISTINCT attr_id, name, type FROM product_attributes WHERE product_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$productId]);
        $attributes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($attributes as $attr) {

            $itemsSql = "SELECT item_id, value, display_value FROM attribute_items WHERE product_id = ? AND attr_id = ?";
            $itemsStmt = $db->prepare($itemsSql);
            $itemsStmt->execute([$productId, $attr['attr_id']]);
            $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

            $result[] = [
                'id' => $attr['attr_id'],
                'name' => $attr['name'],
                'type' => $attr['type'],
                'items' => array_map(function ($item) {
                    return [
                        'id' => $item['item_id'],
                        'value' => $item['value'],
                        'displayValue' => $item['display_value']
                    ];
                }, $items)
            ];
        }
        return $result;
    }
}