<?php
namespace App\Model;

class TextAttribute extends Attribute
{
    protected $items; // массив вариантов

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->type = $data['type'];
        $this->items = $data['items']; // массив значений
    }

    public function getValue()
    {
        return $this->items; // все варианты
    }
    public function getDisplayValue()
    {
        return !empty($this->items) ? $this->items[0]['displayValue'] : '';
    }
}