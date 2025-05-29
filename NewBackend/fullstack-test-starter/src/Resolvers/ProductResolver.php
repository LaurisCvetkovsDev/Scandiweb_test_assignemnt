<?php

namespace App\Resolvers;

use Exception;

class ProductResolver
{
    private $productRepository;

    public function __construct()
    {
        try {
            // Use absolute paths relative to the current file
            require_once __DIR__ . '/../Database.php';
            require_once __DIR__ . '/../repositories/ProductRepository.php';

            $dbConn = \Database::getInstance();

            // Test database connection
            $dbConn->query("SELECT 1");
            error_log("Database connection successful");

            $this->productRepository = new \ProductRepository($dbConn);
        } catch (Exception $e) {
            error_log("ProductResolver constructor error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getAllProducts(): array
    {
        try {
            $result = $this->productRepository->getAll();
            return $result;
        } catch (Exception $e) {
            error_log("getAllProducts error: " . $e->getMessage());
            return [];
        }
    }

    public function getProductById(string $id): ?array
    {
        try {
            return $this->productRepository->findById($id);
        } catch (Exception $e) {
            error_log("getProductById error: " . $e->getMessage());
            return null;
        }
    }

    public function getProductsByCategory(string $category): array
    {
        try {
            return $this->productRepository->getByCategory($category);
        } catch (Exception $e) {
            error_log("getProductsByCategory error: " . $e->getMessage());
            return [];
        }
    }
}