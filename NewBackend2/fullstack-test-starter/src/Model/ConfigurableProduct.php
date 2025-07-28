<?php
namespace App\Model;

class ConfigurableProduct extends Product
{
    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->brand = $data['brand'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->category = $data['category'];
        $this->prices = $data['prices'] ?? [];
        $this->gallery = $data['gallery'];
        $this->attributes = $data['attributes'] ?? [];
        $this->inStock = $data['in_stock'] ?? false; // Исправлено поле из базы
        $this->type = $this instanceof ConfigurableProduct ? 'configurable' : 'simple';
    }
    public function getAttributes()
    {
        return $this->attributes;
    }
    public function getPrice($currency = 'USD')
    {
        foreach ($this->prices as $price) {
            if ($price['currency']['label'] === $currency) {
                return $price['amount'];
            }
        }
        return null; // цена не найдена
    }
    public function isInStock()
    {
        return $this->inStock;
    }
}