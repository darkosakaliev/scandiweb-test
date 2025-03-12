import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../graphql/mutations";
import { CartContextType, CartItem, Product, AttributeValue } from "../types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "eshop-cart";

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  } catch (error) {
    console.error("Error saving cart to storage", error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    if (typeof window !== "undefined") {
      const savedCart = window.sessionStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    }
  } catch (error) {
    console.error("Error loading cart from storage", error);
  }
  return [];
};

const stripTypename = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(stripTypename);
  }

  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (key !== "__typename") {
      newObj[key] = stripTypename(obj[key]);
    }
  });

  return newObj;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placeOrderMutation] = useMutation(PLACE_ORDER);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const savedCart = loadCartFromStorage();
      setCart(savedCart);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cart);
    }
  }, [cart, isInitialized]);

  const generateItemId = (
    productId: string,
    attributes: Record<string, AttributeValue>,
  ): string => {
    const attributeString = Object.entries(attributes)
      .map(([key, value]) => `${key}:${value.id}`)
      .sort()
      .join("-");
    return `${productId}-${attributeString}`;
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addToCart = (
    product: Product,
    selectedAttributes: Record<string, AttributeValue>,
  ) => {
    const missingAttributes = (product.attrs || []).filter(
      (attr) => !selectedAttributes[attr.name],
    );

    if (missingAttributes.length > 0) {
      console.error(
        `Missing attributes: ${missingAttributes.map((a) => a.name).join(", ")}`,
      );
      return false;
    }

    const itemId = generateItemId(product.id, selectedAttributes);

    const existingItemIndex = cart.findIndex((item) => item.id === itemId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          id: itemId,
          product,
          quantity: 1,
          selectedAttributes,
        },
      ]);
    }

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const increaseQuantity = (itemId: string) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (itemId: string) => {
    const item = cart.find((item) => item.id === itemId);

    if (item && item.quantity === 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error clearing cart storage", error);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.prices[0];
    return total + price.amount * item.quantity;
  }, 0);

  const placeOrder = async () => {
    try {
      const orderItems = cart.map((item) => {
        const priceInput = stripTypename(item.product.prices[0]);

        const attributesInput = Object.entries(item.selectedAttributes).map(
          ([name, value]) => ({
            name,
            type:
              item.product.attrs?.find((attr) => attr.name === name)?.type ||
              "text",
            items: [stripTypename(value)],
          }),
        );

        return {
          id: item.product.id,
          prices: [priceInput],
          name: item.product.name,
          quantity: item.quantity,
          attributes: attributesInput,
        };
      });

      console.log("Sending order items:", JSON.stringify(orderItems, null, 2));

      const { data } = await placeOrderMutation({
        variables: { order: orderItems },
      });

      if (data && data.placeOrder && data.placeOrder.message) {
        clearCart();
        return { success: true, message: data.placeOrder.message };
      }

      return { success: false, message: "Unknown error occurred" };
    } catch (error) {
      console.error("Error placing order:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
