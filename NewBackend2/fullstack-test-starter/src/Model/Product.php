<?php
namespace App\Model;
use Exception;
abstract class Product
{
    protected $id;
    protected $name;
    protected $brand;
    protected $description;
    protected $category;
    protected $prices;
    protected $gallery;
    protected $attributes;
    protected $inStock;
    protected $type;

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->brand = $data['brand'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->category = $data['category'];
        $this->prices = $data['prices'] ?? [];
        $this->gallery = $data['gallery'] ?? [];
        $this->attributes = $data['attributes'] ?? [];
        $this->inStock = $data['in_stock'] ?? false;
        $this->type = $data['type'] ?? 'simple';
    }

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

    public function getPrices()
    {
        return $this->prices;
    }

    public function getGallery()
    {
        return $this->gallery;
    }

    public function getAttributes()
    {
        return $this->attributes;
    }

    public function getInStock()
    {
        return $this->inStock;
    }

    public function getType()
    {
        return $this->type;
    }

    abstract public function getPrice($currency = 'USD');

    public function isConfigurable()
    {
        return count($this->attributes) > 0;
    }

    public static function createFromArray($data)
    {

        if (!empty($data['attributes'])) {
            return new ConfigurableProduct($data);
        } else {
            return new SimpleProduct($data);
        }
    }
}