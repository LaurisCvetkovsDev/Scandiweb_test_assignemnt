<?php
namespace App\Model;

class SwatchAttribute extends Attribute
{
    protected $items;      // например, "#FF0000"

    public function __construct($data)
    {
        $this->id = $data['id'];              // ← отсутствует!
        $this->name = $data['name'];          // ← отсутствует!
        $this->type = $data['type'];          // ← отсутствует!
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
