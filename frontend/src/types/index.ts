export interface Currency {
  label: string;
  symbol: string;
  __typename?: string;
}

export interface Price {
  amount: number;
  currency: Currency;
  __typename?: string;
}

export interface AttributeValue {
  id: string;
  value: string;
  display_value: string;
  selected?: boolean;
  __typename?: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
  items: AttributeValue[];
  __typename?: string;
}

export interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description?: string;
  attrs?: Attribute[];
  prices: Price[];
  brand?: string;
  __typename?: string;
}

export interface Category {
  name: string;
  products: Product[];
  __typename?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, AttributeValue>;
}

export interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    attributes: Record<string, AttributeValue>,
  ) => boolean;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
}
