<?php

// Include the composer autoloader
require __DIR__ . "/../vendor/autoload.php";

// Define constants
define("CONFIG_PATH", __DIR__ . "/../config/");

// Simple error handling
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Simple exception handling
set_exception_handler(function ($exception) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode([
        "errors" => [
            [
                "message" => $exception->getMessage(),
                "file" => $exception->getFile(),
                "line" => $exception->getLine(),
            ],
        ],
    ]);
});

// API routing
$path = trim($_SERVER["REQUEST_URI"], "/");

// Route all requests to GraphQL endpoint
if ($path === "graphql") {
    $app = App\App::getInstance();
    $app->handleGraphQL();
} else {
    // Simple API status endpoint
    header("Content-Type: application/json");
    echo json_encode([
        "status" => "running",
        "message" => "GraphQL API is available at /graphql",
    ]);
}
