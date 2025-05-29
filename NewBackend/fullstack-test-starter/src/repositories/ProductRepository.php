<?php
require_once __DIR__ . '/../models/Product.php';

class ProductRepository
{
    private PDO $conn;

    public function __construct(PDO $conn)
    {
        $this->conn = $conn;
    }

    public function getAll(): array
    {
        $query = "SELECT * FROM products";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($products as $product) {
            $result[] = $this->buildProductData($product);
        }
        return $result;
    }

    public function findById(string $id): ?array
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$product) {
            return null;
        }

        return $this->buildProductData($product);
    }

    public function getByCategory(string $category): array
    {
        if ($category === 'all') {
            return $this->getAll();
        }

        $query = "SELECT * FROM products WHERE category = :category";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":category", $category);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($products as $product) {
            $result[] = $this->buildProductData($product);
        }
        return $result;
    }

    private function buildProductData(array $product): array
    {
        // Get prices
        $prices = $this->getPrices($product['id']);

        // Get gallery images
        $gallery = $this->getGallery($product['id']);

        // Get attributes
        $attributes = $this->getAttributes($product['id']);

        return [
            'id' => $product['id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'inStock' => (bool) $product['in_stock'],
            'category' => $product['category'],
            'prices' => $prices,
            'gallery' => $gallery,
            'attributes' => $attributes
        ];
    }

    private function getPrices(string $productId): array
    {
        $query = "SELECT * FROM product_prices WHERE product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $productId);
        $stmt->execute();
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($price) {
            return [
                'amount' => (float) $price['amount'],
                'currencyLabel' => $price['currency_label'],
                'currencySymbol' => $price['currency_symbol']
            ];
        }, $prices);
    }

    private function getGallery(string $productId): array
    {
        $query = "SELECT * FROM product_gallery WHERE product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $productId);
        $stmt->execute();
        $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($image) {
            return ['url' => $image['image_url']];
        }, $gallery);
    }

    private function getAttributes(string $productId): array
    {
        $query = "
            SELECT pa.name, pa.type, 
                   ai.item_id, ai.display_value as displayValue, ai.value
            FROM product_attributes pa
            LEFT JOIN attribute_items ai ON pa.attr_id = ai.attr_id AND pa.product_id = ai.product_id
            WHERE pa.product_id = :product_id
            ORDER BY pa.name, ai.item_id
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $productId);
        $stmt->execute();
        $attributeData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group attributes by name
        $attributes = [];
        $currentAttr = null;

        foreach ($attributeData as $row) {
            if (!$currentAttr || $currentAttr['name'] !== $row['name']) {
                if ($currentAttr) {
                    $attributes[] = $currentAttr;
                }
                $currentAttr = [
                    'name' => $row['name'],
                    'type' => $row['type'],
                    'items' => []
                ];
            }

            if ($row['item_id']) {
                $currentAttr['items'][] = [
                    'id' => $row['item_id'],
                    'displayValue' => $row['displayValue'],
                    'value' => $row['value']
                ];
            }
        }

        if ($currentAttr) {
            $attributes[] = $currentAttr;
        }

        return $attributes;
    }
}
?>