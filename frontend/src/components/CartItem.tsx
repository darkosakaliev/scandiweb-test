import React from "react";
import { useCart } from "../context/CartContext";
import { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

const toKebabCase = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "-");
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity } = useCart();
  const { product, quantity, selectedAttributes } = item;

  const price = product.prices[0];

  return (
    <div className="flex space-x-4 border-b pb-4">
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="font-bold mt-1">
          {price.currency.symbol}
          {price.amount.toFixed(2)}
        </p>

        {product.attrs &&
          product.attrs.map((attr) => {
            const attrNameKebab = toKebabCase(attr.name);
            const selectedOption = selectedAttributes[attr.name];

            if (!selectedOption) return null;

            const baseTestId = `cart-item-attribute-${attrNameKebab}`;
            const valueTestId =
              attr.type === "swatch"
                ? `${baseTestId}-${selectedOption.value}`
                : `${baseTestId}-${selectedOption.display_value}`;

            const testId = `${valueTestId}-selected`;

            return (
              <div
                key={attr.id}
                className="mt-2"
                data-testid={`cart-item-attribute-${attrNameKebab}`}
              >
                <p className="text-sm font-medium">{attr.name}:</p>
                <div className="flex mt-1 gap-2">
                  {attr.type === "swatch" ? (
                    <div
                      key={selectedOption.id}
                      className="w-6 h-6 border ring-2 ring-offset-1 ring-black"
                      style={{ backgroundColor: selectedOption.value }}
                      data-testid={testId}
                    />
                  ) : (
                    <div
                      key={selectedOption.id}
                      className="text-xs"
                      data-testid={testId}
                    >
                      {selectedOption.display_value}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex flex-col justify-between items-center">
        <button
          onClick={() => increaseQuantity(item.id)}
          className="w-6 h-6 border flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          data-testid="cart-item-amount-increase"
          aria-label="Increase quantity"
        >
          +
        </button>

        <span data-testid="cart-item-amount">{quantity}</span>

        <button
          onClick={() => decreaseQuantity(item.id)}
          className="w-6 h-6 border flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          data-testid="cart-item-amount-decrease"
          aria-label="Decrease quantity"
        >
          -
        </button>
      </div>

      <div className="w-20 h-20 bg-gray-100">
        {product.gallery && product.gallery.length > 0 && (
          <img
            src={product.gallery[0]}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/80x80?text=No+Image";
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CartItem;
