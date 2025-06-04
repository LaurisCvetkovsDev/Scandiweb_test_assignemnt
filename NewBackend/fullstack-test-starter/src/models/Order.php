<?php

namespace App\Models;

class Order
{
    public string $id;
    public string $created_at;
    public float $total_amount;
    public string $currency;
    public string $status;

    public function __construct(
        string $id,
        string $created_at,
        float $total_amount,
        string $currency = 'USD',
        string $status = 'pending'
    ) {
        $this->id = $id;
        $this->created_at = $created_at;
        $this->total_amount = $total_amount;
        $this->currency = $currency;
        $this->status = $status;
    }
}