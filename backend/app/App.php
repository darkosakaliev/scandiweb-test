<?php

namespace App;

use App\Database;
use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use GraphQL\Utils\BuildSchema;
use GraphQL\Error\DebugFlag;
use App\Graphql\Resolvers\RootResolver;

class App
{
    private static $instance = null;
    private $db = null;

    /**
     * Get singleton instance
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Private constructor for singleton
     */
    private function __construct()
    {
        $this->db = Database::instance();
    }

    /**
     * Get database instance
     */
    public function getDatabase()
    {
        return $this->db;
    }

    /**
     * Handle GraphQL request
     */
    public function handleGraphQL()
    {
        // CORS headers for API
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");

        // Handle preflight OPTIONS request
        if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
            header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
            exit();
        }

        // Load GraphQL schema
        $schema = BuildSchema::build(
            file_get_contents(__DIR__ . "/../graphql/schema.graphql")
        );

        // Get request data
        $rawInput = file_get_contents("php://input");

        if (!$rawInput) {
            $this->jsonResponse(
                ["errors" => [["message" => "Empty GraphQL query received."]]],
                400
            );
            return;
        }

        $requestData = json_decode($rawInput, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->jsonResponse(
                [
                    "errors" => [
                        ["message" => "Invalid JSON: " . json_last_error_msg()],
                    ],
                ],
                400
            );
            return;
        }

        $query = $requestData["query"] ?? ($requestData["mutation"] ?? null);
        $variables = $requestData["variables"] ?? null;

        try {
            // Execute GraphQL query
            $result = GraphQL::executeQuery(
                $schema,
                $query,
                RootResolver::getResolvers(),
                null,
                $variables
            )->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE);

            $this->jsonResponse($result);
        } catch (\Exception $e) {
            $this->jsonResponse(
                [
                    "errors" => [["message" => $e->getMessage()]],
                ],
                500
            );
        }
    }

    /**
     * Send JSON response
     */
    private function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header("Content-Type: application/json");
        echo json_encode($data, JSON_THROW_ON_ERROR);
    }
}
