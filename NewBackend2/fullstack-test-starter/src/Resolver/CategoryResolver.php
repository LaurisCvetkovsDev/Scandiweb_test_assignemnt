<?php

namespace App\Resolver;
use App\Database\Database;
use PDO;

class CategoryResolver
{
    public static function getAll()
    {
        $db = Database::getInstance();
        $sql = "SELECT DISTINCT name FROM categories";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $categories;
    }
}
