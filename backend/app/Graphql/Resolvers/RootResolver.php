<?php

namespace App\Graphql\Resolvers;

use App\Graphql\Resolvers\CategoryResolver;
use App\Graphql\Resolvers\OrderResolver;
use App\Graphql\Resolvers\ProductResolver;

class RootResolver
{
    public static function getResolvers(): array
    {
        return [
            "categories" => fn(
                array $rootValue,
                array $args
            ) => CategoryResolver::getCategories($rootValue, $args),
            "category" => fn(
                array $rootValue,
                array $args
            ) => CategoryResolver::getCategory($rootValue, $args),
            "products" => fn(
                array $rootValue,
                array $args
            ) => ProductResolver::getProducts($rootValue, $args),
            "product" => fn(
                array $rootValue,
                array $args
            ) => ProductResolver::getProduct($rootValue, $args),
            "placeOrder" => fn(
                array $rootValue,
                array $args
            ) => OrderResolver::placeOrder($rootValue, $args),
        ];
    }
}
