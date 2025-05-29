<?php
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/CategoryRepository.php';
require_once __DIR__ . '/PriceRepository.php';
require_once __DIR__ . '/GalleryRepository.php';
require_once __DIR__ . '/AttributeRepository.php';
require_once __DIR__ . '/AttributeItemRepository.php';

class ProductRepository
{
    private PDO $conn;
    private CategoryRepository $categoryRepo;
    private PriceRepository $priceRepo;
    private GalleryRepository $imageRepo;
    private AttributeRepository $attributeRepo;
    private AttributeItemRepository $attributeItemRepo;

    public function __construct(PDO $conn)
    {
        $this->conn = $conn;
        $this->categoryRepo = new CategoryRepository($conn);
        $this->priceRepo = new PriceRepository($conn);
        $this->imageRepo = new GalleryRepository($conn);
        $this->attributeRepo = new AttributeRepository($conn);
        $this->attributeItemRepo = new AttributeItemRepository($conn);
    }

    // Получить все товары
    public function getAll(): array
    {
        $query = "SELECT * FROM products";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $products = [];
        foreach ($rows as $row) {
            $products[] = $this->buildProductData($row);
        }
        return $products;
    }

    // Найти товар по id
    public function findById(string $id): ?array
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return $this->buildProductData($row);
    }

    // Собрать полный ProductData
    private function buildProductData(array $row): array
    {
        // Use getByProductId methods that return arrays instead of objects
        $category = $this->categoryRepo->findByName($row['category']);
        $prices = $this->priceRepo->getByProductId($row['id']);
        $gallery = $this->imageRepo->getByProductId($row['id']);

        // For attributes, we'll need to check what methods are actually available
        $attributeData = [];
        try {
            $attributes = $this->attributeRepo->findByProductId($row['id']);
            foreach ($attributes as $attr) {
                $items = $this->attributeItemRepo->findByAttrIdAndProductId($attr->attr_id, $attr->product_id);
                $itemData = [];
                foreach ($items as $item) {
                    $itemData[] = [
                        'id' => $item->item_id,
                        'value' => $item->value,
                        'displayValue' => $item->display_value
                    ];
                }

                $attributeData[] = [
                    'name' => $attr->name,
                    'type' => $attr->type,
                    'items' => $itemData
                ];
            }
        } catch (Exception $e) {
            // If attributes fail, just return empty array
            $attributeData = [];
        }

        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'inStock' => boolval($row['in_stock']),
            'category' => $category ? ['id' => $category->id, 'name' => $category->name] : null,
            'prices' => array_map(function ($price) {
                return [
                    'currencyLabel' => $price['currency_label'],
                    'currencySymbol' => $price['currency_symbol'],
                    'amount' => floatval($price['amount'])
                ];
            }, $prices),
            'gallery' => array_map(function ($img) {
                return ['url' => $img['image_url']];
            }, $gallery),
            'attributes' => $attributeData
        ];
    }
}

?>