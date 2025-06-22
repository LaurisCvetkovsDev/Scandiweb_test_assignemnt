<?php
namespace App\Schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class Types
{

  public static function product()
  {
    return new ObjectType([
      'name' => 'Product',
      'fields' => [
        'id' => ['type' => Type::nonNull(Type::string())],
        'name' => ['type' => Type::nonNull(Type::string())],
        'inStock' => ['type' => Type::nonNull(Type::boolean())],
        'brand' => ['type' => Type::nonNull(Type::string())],
        'description' => ['type' => Type::string()],
        'category' => ['type' => Type::nonNull(Type::string())],
        'prices' => ['type' => Type::nonNull(Type::listOf(self::price()))],
        'gallery' => ['type' => Type::nonNull(Type::listOf(Type::string()))],
        'attributes' => ['type' => Type::nonNull(Type::listOf(self::attribute()))],
      ]
    ]);
  }
  public static function price()
  {
    return new ObjectType([
      'name' => 'Price',
      'fields' => [
        'amount' => ['type' => Type::nonNull(Type::float())],
        'currency' => ['type' => Type::nonNull(self::currency())], // ← объект!
      ]
    ]);
  }

  public static function currency()
  {
    return new ObjectType([
      'name' => 'Currency',
      'fields' => [
        'label' => ['type' => Type::nonNull(Type::string())],
        'symbol' => ['type' => Type::nonNull(Type::string())],
      ]
    ]);
  }
  public static function gallery()
  {
    return new ObjectType([
      'name' => 'Gallery',
      'fields' => [
        'id' => ['type' => Type::nonNull(Type::string())],
        'url' => ['type' => Type::nonNull(Type::string())],
      ]
    ]);
  }
  public static function attribute()
  {
    return new ObjectType([
      'name' => 'Attribute',
      'fields' => [
        'id' => ['type' => Type::nonNull(Type::string())],
        'name' => ['type' => Type::nonNull(Type::string())],
        'type' => ['type' => Type::nonNull(Type::string())],
        'items' => ['type' => Type::nonNull(Type::listOf(self::attributeItem()))],
      ]
    ]);
  }
  public static function attributeItem()
  {
    return new ObjectType([
      'name' => 'AttributeItem',
      'fields' => [
        'id' => ['type' => Type::nonNull(Type::string())],
        'value' => ['type' => Type::nonNull(Type::string())],
        'displayValue' => ['type' => Type::nonNull(Type::string())],
      ]
    ]);
  }
  public static function category()
  {
    return new ObjectType([
      'name' => 'Category',
      'fields' => [
        'name' => ['type' => Type::nonNull(Type::string())],
      ]
    ]);
  }
}