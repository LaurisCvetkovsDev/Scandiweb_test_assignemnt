<?php
namespace App\Model;
use Exception;
abstract class Product
{
    // Основные идентификаторы - есть у всех
    protected $id;           // уникальный ID в базе

    // Основная информация - есть у всех
    protected $name;         // название товара
    protected $brand;        // бренд товара
    protected $description;  // описание товара

    // Категория - есть у всех
    protected $category;     // к какой категории относится

    // Базовые цены - есть у всех (но считаются по-разному!)
    protected $prices;       // массив цен в разных валютах

    // Изображения - есть у всех
    protected $gallery;      // массив изображений

    // Атрибуты - есть у всех (но разные!)
    protected $attributes;   // массив атрибутов

    // Статус товара - есть у всех
    protected $inStock;      // в наличии или нет

    // Тип товара - нужен для полиморфизма

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }
    public function getBrand()
    {
        return $this->brand;
    }
    public function getDescription()
    {
        return $this->description;
    }
    public function getCategory()
    {
        return $this->category;
    }
    public function getGallery()
    {
        return $this->gallery;
    }

    public function getPrices()
    {
        return $this->prices;
    }

    public function getInStock()
    {
        return $this->inStock;
    }

    // Абстрактные методы (каждый тип реализует по-своему)
    abstract public function getPrice($currency = 'USD');
    abstract public function getAttributes();
    abstract public function isInStock();
    public static function createFromArray($data)
    {
        // Если есть атрибуты с вариантами - это configurable
        if (!empty($data['attributes'])) {
            return new ConfigurableProduct($data);
        } else {
            return new SimpleProduct($data);
        }
    }

}