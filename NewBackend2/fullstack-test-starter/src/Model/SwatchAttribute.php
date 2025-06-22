<?php
namespace App\Model;

class SwatchAttribute extends Attribute
{
    protected $items;

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->type = $data['type'];
        $this->items = $data['items'];
    }
    public function getValue()
    {
        return $this->items;
    }

    public function getDisplayValue()
    {
        return !empty($this->items) ? $this->items[0]['displayValue'] : '';
    }
}
