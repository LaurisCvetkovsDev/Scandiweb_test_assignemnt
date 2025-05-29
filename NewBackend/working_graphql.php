<?php
// Simple working GraphQL endpoint
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['message' => 'CORS preflight OK']);
    exit();
}

// Include the original backend files
require_once __DIR__ . '/../Backend/Database.php';
require_once __DIR__ . '/../Backend/repositories/ProductRepository.php';

try {
    // Get the input
    $input = json_decode(file_get_contents('php://input'), true);
    $query = $input['query'] ?? '';

    // Simple query parsing (not a full GraphQL parser, just for testing)
    if (strpos($query, 'products') !== false && strpos($query, 'productsByCategory') === false) {
        // Get all products
        $dbConn = Database::getInstance();
        $productRepo = new ProductRepository($dbConn);
        $products = $productRepo->getAll();

        echo json_encode([
            'data' => [
                'products' => $products
            ]
        ]);
    } elseif (strpos($query, 'productsByCategory') !== false) {
        // Extract category from query (simple regex)
        preg_match('/productsByCategory\s*\(\s*category:\s*"([^"]+)"/', $query, $matches);
        $category = $matches[1] ?? 'all';

        $dbConn = Database::getInstance();
        $productRepo = new ProductRepository($dbConn);
        $allProducts = $productRepo->getAll();

        if ($category === 'all') {
            $filteredProducts = $allProducts;
        } else {
            $filteredProducts = array_filter($allProducts, function ($product) use ($category) {
                return $product['category'] && strtolower($product['category']['name']) === strtolower($category);
            });
        }

        echo json_encode([
            'data' => [
                'productsByCategory' => array_values($filteredProducts)
            ]
        ]);
    } elseif (strpos($query, 'product(') !== false) {
        // Extract product ID
        preg_match('/product\s*\(\s*id:\s*"([^"]+)"/', $query, $matches);
        $id = $matches[1] ?? '';

        if ($id) {
            $dbConn = Database::getInstance();
            $productRepo = new ProductRepository($dbConn);
            $product = $productRepo->findById($id);

            echo json_encode([
                'data' => [
                    'product' => $product
                ]
            ]);
        } else {
            echo json_encode([
                'errors' => [['message' => 'Product ID required']]
            ]);
        }
    } else {
        echo json_encode([
            'errors' => [['message' => 'Unknown query']]
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'errors' => [
            [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]
        ]
    ]);
}
?>