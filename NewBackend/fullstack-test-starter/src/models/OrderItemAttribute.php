<?php

namespace App\Models;

class OrderItemAttribute
{
    public string $id;
    public string $order_item_id;
    public string $attribute_name;
    public string $attribute_type;
    public string $selected_value;
    public string $selected_display_value;

    public function __construct(
        string $id,
        string $order_item_id,
        string $attribute_name,
        string $attribute_type,
        string $selected_value,
        string $selected_display_value
    ) {
        $this->id = $id;
        $this->order_item_id = $order_item_id;
        $this->attribute_name = $attribute_name;
        $this->attribute_type = $attribute_type;
        $this->selected_value = $selected_value;
        $this->selected_display_value = $selected_display_value;
    }
}