<?php

namespace App\Models;

class OrderItem
{
    public string $id;
    public string $order_id;
    public string $product_id;
    public int $quantity;
    public float $price_at_time;
    public string $currency;
    public array $attributes = [];

    public function __construct(
        string $id,
        string $order_id,
        string $product_id,
        int $quantity,
        float $price_at_time,
        string $currency = 'USD'
    ) {
        $this->id = $id;
        $this->order_id = $order_id;
        $this->product_id = $product_id;
        $this->quantity = $quantity;
        $this->price_at_time = $price_at_time;
        $this->currency = $currency;
    }
}