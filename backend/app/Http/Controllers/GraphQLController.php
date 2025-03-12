<?php

namespace App\Http\Controllers;

use App\Graphql\Resolvers\RootResolver;
use GraphQL\GraphQL;
use App\Models\Category;
use GraphQL\Error\DebugFlag;
use GraphQL\Type\Schema;
use GraphQL\Utils\BuildSchema;

class GraphQLController
{
    public function index()
    {
        $schema = BuildSchema::build(
            file_get_contents(__DIR__ . "/../../../graphql/schema.graphql")
        );

        $rawInput = file_get_contents("php://input");

        if (!$rawInput) {
            throw new \Exception("Empty GraphQL query received.");
        }

        $requestData = json_decode($rawInput, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception("Invalid JSON: " . json_last_error_msg());
        }

        $query = $requestData["query"] ?? ($requestData["mutation"] ?? null);
        $variables = $requestData["variables"] ?? null;

        try {
            $result = GraphQL::executeQuery(
                $schema,
                $query,
                RootResolver::getResolvers(),
                null,
                $variables
            )->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE);
        } catch (\Exception $e) {
            $result = [
                "errors" => [
                    [
                        "message" => $e->getMessage(),
                    ],
                ],
            ];
        }
        header("Content-Type: application/json");
        echo json_encode($result, JSON_THROW_ON_ERROR);
    }
}
