import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { NavLink, useLocation } from "react-router-dom";
import { GET_CATEGORIES } from "../graphql/queries";
import CartButton from "./CartButton";

const CATEGORY_CONFIG = {
  c1: { path: "all", name: "All" },
  c2: { path: "clothes", name: "Clothes" },
  c3: { path: "tech", name: "Tech" },
};

const Header: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const location = useLocation();

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; path: string }>
  >([]);

  useEffect(() => {
    const defaultCategories = [
      { id: "c1", name: "All", path: "all" },
      { id: "c2", name: "Clothes", path: "clothes" },
      { id: "c3", name: "Tech", path: "tech" },
    ];

    if (data?.categories) {
      const mappedCategories = data.categories.map((cat: any) => {
        const id =
          cat.id ||
          Object.keys(CATEGORY_CONFIG).find(
            (key) =>
              CATEGORY_CONFIG[key].name.toLowerCase() ===
              cat.name.toLowerCase(),
          ) ||
          "c1";

        return {
          id,
          name: cat.name || CATEGORY_CONFIG[id].name,
          path: CATEGORY_CONFIG[id].path,
        };
      });

      setCategories(mappedCategories);
    } else {
      setCategories(defaultCategories);
    }
  }, [data]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center h-16">
        <nav>
          <ul className="flex space-x-6">
            {categories.map((category) => {
              const isActive = location.pathname === `/${category.path}`;

              return (
                <li key={category.id}>
                  <NavLink
                    to={`/${category.path}`}
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold text-green-500 uppercase pb-2 border-b-2 border-green-500"
                        : "text-gray-700 uppercase hover:text-green-500"
                    }
                    data-testid={
                      isActive ? "active-category-link" : "category-link"
                    }
                  >
                    {category.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center">
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
