import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, GET_CATEGORY } from "../graphql/queries";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";

const CATEGORY_DISPLAY = {
  c1: "All Products",
  c2: "Clothes",
  c3: "Tech",
};

interface CategoryPageProps {
  categoryId: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const id = categoryId;

  const query = id === "c1" ? GET_CATEGORIES : GET_CATEGORY;
  const variables = id === "c1" ? {} : { id };

  const { loading, error, data } = useQuery(query, {
    variables,
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-xl">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-xl text-red-500">
          Error loading products: {error.message}
        </p>
        <p className="mt-4">
          Please check the backend connection and try again.
        </p>
      </div>
    );

  let categoryName = CATEGORY_DISPLAY[id] || id;
  let products: Product[] = [];

  if (id === "c1" && data?.categories) {
    data.categories.forEach((category: any) => {
      if (category.products && Array.isArray(category.products)) {
        products = [...products, ...category.products];
      }
    });
  } else if (data?.category) {
    categoryName = data.category.name || CATEGORY_DISPLAY[id] || id;
    products = data.category.products || [];
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 capitalize">{categoryName}</h1>

      {products.length === 0 ? (
        <p className="text-xl text-center py-10">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
