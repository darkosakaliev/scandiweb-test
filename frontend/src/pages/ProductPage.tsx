import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";
import { useCart } from "../context/CartContext";
import { Attribute, AttributeValue } from "../types";

const toKebabCase = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "-");
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, AttributeValue>
  >({});
  const [attributeErrors, setAttributeErrors] = useState<string[]>([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  useEffect(() => {
    if (data?.product?.attrs) {
      setSelectedAttributes({});
      setAttributeErrors([]);
    }
  }, [data?.product?.id]);

  if (loading)
    return (
      <div className="container mx-auto py-10 px-4">Loading product...</div>
    );
  if (error)
    return (
      <div className="container mx-auto py-10 px-4">
        Error loading product: {error.message}
      </div>
    );

  const product = data?.product;

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4">Product not found</div>
    );
  }

  if (!selectedImage && product.gallery && product.gallery.length > 0) {
    setSelectedImage(product.gallery[0]);
  }

  const handleAttributeSelect = (
    attribute: Attribute,
    value: AttributeValue,
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attribute.name]: value,
    }));

    setAttributeErrors((prev) =>
      prev.filter((err) => !err.includes(attribute.name)),
    );
  };

  const isAttributeSelected = (
    attributeName: string,
    valueId: string,
  ): boolean => {
    return selectedAttributes[attributeName]?.id === valueId;
  };

  const validateAttributes = (): boolean => {
    if (!product.attrs || product.attrs.length === 0) return true;

    const errors: string[] = [];
    product.attrs.forEach((attr) => {
      if (!selectedAttributes[attr.name]) {
        errors.push(`Please select a ${attr.name}`);
      }
    });

    setAttributeErrors(errors);
    return errors.length === 0;
  };

  const areAllAttributesSelected = (): boolean => {
    if (!product.attrs || product.attrs.length === 0) return true;

    return product.attrs.every((attr) => !!selectedAttributes[attr.name]);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (!validateAttributes()) {
      return;
    }

    const success = addToCart(product, selectedAttributes);

    if (success) {
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 2000);
    }
  };

  const price = product.prices[0];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div
          className="w-full md:w-1/2 flex flex-col sm:flex-row"
          data-testid="product-gallery"
        >
          {product.gallery.length > 1 && (
            <div className="w-full sm:w-24 flex overflow-x-auto sm:block sm:overflow-x-hidden sm:mr-4 sm:space-y-4 sm:max-h-screen sm:overflow-y-auto mb-4 sm:mb-0 space-x-4 sm:space-x-0">
              {product.gallery.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`border ${selectedImage === image ? "border-green-500" : "border-gray-200"} cursor-pointer w-1/5 flex-shrink-0 sm:w-full`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x100?text=No+Image";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 relative bg-gray-100">
            <img
              src={selectedImage || product.gallery[0]}
              alt={product.name}
              className={`w-full h-auto ${!product.inStock ? "opacity-50" : ""}`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl text-gray-500 font-medium">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {product.attrs &&
            product.attrs.map((attr) => {
              const attrNameKebab = toKebabCase(attr.name);

              return (
                <div
                  key={attr.id}
                  className="mt-6"
                  data-testid={`product-attribute-${attrNameKebab}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{attr.name}:</h3>

                    {attributeErrors.find((err) => err.includes(attr.name)) && (
                      <span className="text-red-500 text-sm">Required</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attr.items.map((item) => {
                      const isSelected = isAttributeSelected(
                        attr.name,
                        item.id,
                      );

                      const baseTestId = `product-attribute-${attrNameKebab}`;
                      const testId =
                        attr.type === "swatch"
                          ? `${baseTestId}-${item.value}`
                          : `${baseTestId}-${item.display_value}`;

                      if (attr.type === "swatch") {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeSelect(attr, item)}
                            className={`w-10 h-10 border ${isSelected ? "ring-2 ring-offset-1 ring-black" : ""}`}
                            style={{ backgroundColor: item.value }}
                            title={item.display_value}
                            aria-label={`${attr.name} ${item.display_value}`}
                            data-testid={testId}
                          />
                        );
                      } else {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAttributeSelect(attr, item)}
                            className={`cursor-pointer min-w-10 h-10 px-3 flex items-center justify-center border ${
                              isSelected
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
                            aria-label={`${attr.name} ${item.display_value}`}
                            data-testid={testId}
                          >
                            {item.display_value}
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Price:</h3>
            <p className="text-2xl font-bold">
              {price.currency.symbol}
              {price.amount.toFixed(2)}
            </p>
          </div>

          {addToCartSuccess && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              Product added to cart!
            </div>
          )}

          {attributeErrors.length > 0 && !addToCartSuccess && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              {attributeErrors[0]}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || !areAllAttributesSelected()}
            className={`cursor-pointer mt-8 w-full py-4 bg-green-500 text-white font-medium ${
              !product.inStock || !areAllAttributesSelected()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
            data-testid="add-to-cart"
          >
            {!product.inStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>

          <div
            className="mt-8 prose max-w-none"
            data-testid="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
