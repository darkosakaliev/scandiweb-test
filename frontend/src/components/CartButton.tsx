import React from "react";
import { useCart } from "../context/CartContext";

const CartButton: React.FC = () => {
  const { toggleCart, cartCount, isCartOpen } = useCart();

  if (isCartOpen) {
    return null;
  }

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 bg-white text-black hover:bg-gray-100 rounded cursor-pointer"
      data-testid="cart-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {cartCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {cartCount}
        </div>
      )}
    </button>
  );
};

export default CartButton;
