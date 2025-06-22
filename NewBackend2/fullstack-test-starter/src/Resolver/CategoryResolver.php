<?php

namespace App\Resolver;
use App\Database\Database;
use PDO;

class CategoryResolver
{
    public static function getAll()
    {
        $db = Database::getInstance();
        $sql = "SELECT DISTINCT category as name FROM products";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $categories;
    }
}
