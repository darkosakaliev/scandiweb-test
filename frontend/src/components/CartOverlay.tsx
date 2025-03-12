import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

const CartOverlay: React.FC = () => {
  const { isCartOpen, toggleCart, cart, cartTotal, cartCount, placeOrder } =
    useCart();

  const [orderStatus, setOrderStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCartOpen &&
        cartPanelRef.current &&
        !cartPanelRef.current.contains(event.target as Node)
      ) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  useEffect(() => {
    let timer: number | undefined;

    if (orderStatus) {
      timer = window.setTimeout(() => {
        setOrderStatus(null);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [orderStatus]);

  if (!isCartOpen) return null;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setIsPlacingOrder(true);
    setOrderStatus(null);

    try {
      const result = await placeOrder();
      setOrderStatus(result);
    } catch (error) {
      setOrderStatus({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      data-testid="cart-overlay"
    >
      <div
        ref={cartPanelRef}
        className="absolute right-0 top-0 w-full sm:w-96 max-w-full bg-white h-screen shadow-lg p-4 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            My Bag:{" "}
            <span className="font-normal">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </span>
          </h2>
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Close cart"
            data-testid="cart-btn"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 my-10">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="pt-4">
              <div
                className="flex justify-between font-bold mb-6"
                data-testid="cart-total"
              >
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || isPlacingOrder}
                  className={`flex-1 py-2 px-4 bg-green-500 text-white text-center cursor-pointer ${
                    cart.length === 0 || isPlacingOrder
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </>
        )}
        {orderStatus && (
          <div
            className={`p-3 mb-4 rounded ${orderStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {orderStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
