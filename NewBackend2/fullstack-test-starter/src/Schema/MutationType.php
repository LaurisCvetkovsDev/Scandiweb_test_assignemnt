<?php
namespace App\Schema;

use GraphQL\Type\Definition\ObjectType;
use App\Resolver\OrderResolver;

class MutationType
{
  public static function build()
  {
    return new ObjectType([
      'name' => 'Mutation',
      'fields' => [
        'placeOrder' => [
          'type' => OutputTypes::orderResult(),
          'args' => [
            'input' => ['type' => InputTypes::orderInput()]
          ],
          'resolve' => function ($root, $args) {
            return OrderResolver::createOrder($args['input']);
          }
        ]
      ]
    ]);
  }
}