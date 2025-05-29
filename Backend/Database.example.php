<?php
/**
 * Database Configuration Template
 * 
 * Copy this file to Database.php and update the credentials for your environment
 */

class Database
{
    private static ?PDO $instance = null;

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            // Database configuration - UPDATE THESE VALUES FOR YOUR ENVIRONMENT
            $host = 'localhost';        // Your database host
            $db = 'pruductdb';          // Your database name
            $user = 'root';             // Your database username
            $pass = '';                 // Your database password
            $charset = 'utf8mb4';       // Character set

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                throw new PDOException($e->getMessage(), (int) $e->getCode());
            }
        }

        return self::$instance;
    }
}