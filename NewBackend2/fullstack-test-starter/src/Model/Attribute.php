<?php
namespace App\Model;
use Exception;
abstract class Attribute
{
    protected $id;
    protected $name;
    protected $type;

    // Общие методы
    public function getId()
    {
        return $this->id;
    }
    public function getName()
    {
        return $this->name;
    }

    // Каждый тип атрибута отображается по-разному
    abstract public function getValue();
    abstract public function getDisplayValue();

    public static function createFromArray($data)
    {
        if ($data['type'] === 'text') {
            return new TextAttribute($data);
        } elseif ($data['type'] === 'swatch') {
            return new SwatchAttribute($data);
        } elseif ($data['type'] === 'gallery') {
            return new GalleryAttribute($data);
        }
        throw new Exception("Unknown attribute type: " . $data['type']);
    }

}
