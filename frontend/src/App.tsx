import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartOverlay from "./components/CartOverlay";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/all" replace />} />
              <Route path="/all" element={<CategoryPage categoryId="c1" />} />
              <Route
                path="/clothes"
                element={<CategoryPage categoryId="c2" />}
              />
              <Route path="/tech" element={<CategoryPage categoryId="c3" />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="*" element={<Navigate to="/all" replace />} />
            </Routes>
          </main>

          <CartOverlay />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
