<?php

namespace App\Graphql\Resolvers;

use App\Models\Category;

class CategoryResolver
{
    public static function getCategories(array $rootValue, array $args): array
    {
        return Category::with("products")->get();
    }

    public static function getCategory(array $rootValue, array $args): ?Category
    {
        return Category::find($args["id"]);
    }
}
