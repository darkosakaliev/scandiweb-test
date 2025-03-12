import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Product, AttributeValue } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const price = product.prices[0];

  const hasAttributes = () => {
    return Boolean(
      product.attrs && Array.isArray(product.attrs) && product.attrs.length > 0,
    );
  };

  const getDefaultAttributes = () => {
    const defaultAttributes: Record<string, AttributeValue> = {};

    if (!product.attrs || !Array.isArray(product.attrs)) {
      return defaultAttributes;
    }

    product.attrs.forEach((attr) => {
      if (attr.items && attr.items.length > 0) {
        defaultAttributes[attr.name] = attr.items[0];
      }
    });

    return defaultAttributes;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    try {
      if (hasAttributes()) {
        const defaultAttributes = getDefaultAttributes();
        const success = addToCart(product, defaultAttributes);

        if (success) {
          setAddSuccess(true);
          setTimeout(() => setAddSuccess(false), 1500);
        }
      } else {
        const success = addToCart(product, {});

        if (success) {
          setAddSuccess(true);
          setTimeout(() => setAddSuccess(false), 1500);
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-${product.id}`}
      className="block transition-all duration-300 hover:shadow-lg"
    >
      <div
        className="relative group border bg-white h-full transition-transform hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square mb-4 bg-gray-100 overflow-hidden">
          {product.gallery && product.gallery.length > 0 ? (
            <img
              src={product.gallery[0]}
              alt={product.name}
              className={`w-full h-full object-contain ${!product.inStock ? "opacity-50" : ""}`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x300?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl text-gray-500 font-medium">
                OUT OF STOCK
              </span>
            </div>
          )}

          {product.inStock && isHovered && (
            <div className="absolute bottom-4 right-4">
              {addSuccess && (
                <div className="absolute bottom-12 right-0 bg-green-100 text-green-700 p-2 rounded text-xs w-48 text-center">
                  Added to cart!
                </div>
              )}
              <button
                onClick={handleQuickAdd}
                className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg cursor-pointer"
                aria-label="Add to cart"
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
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`text-lg ${!product.inStock ? "text-gray-400" : ""}`}>
            {product.name}
          </h3>
          <p
            className={`font-bold mt-1 ${!product.inStock ? "text-gray-400" : ""}`}
          >
            {price?.currency?.symbol || "$"}
            {price?.amount?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
