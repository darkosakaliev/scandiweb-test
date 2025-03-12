<?php

namespace App\Graphql\Resolvers;

use App\Models\Order;

class OrderResolver
{
    public static function placeOrder(array $rootValue, array $args): array
    {
        $total = 0;
        foreach ($args["order"] as $product) {
            $total += $product["prices"][0]["amount"];
        }

        try {
            $order = Order::create([
                "order_details" => $args["order"],
                "order_status" => "pending",
                "total" => $total,
                "created_at" => date("Y-m-d H:i:s"),
            ]);

            error_log(
                "Order created with ID: " . ($order ? $order->id : "null")
            );

            if ($order) {
                return [
                    "message" => "Order #{$order->id} placed successfully!",
                ];
            } else {
                throw new \Exception("Failed to create order");
            }
        } catch (\Exception $e) {
            error_log("Error placing order: " . $e->getMessage());
            throw new \Exception("Error placing order: " . $e->getMessage());
        }
    }
}
