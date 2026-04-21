import { useState, useContext, createContext, useEffect, useMemo } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const existing = localStorage.getItem("cart");
    return existing ? JSON.parse(existing) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, type) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === productId) {
            const newQty =
              type === "inc" ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  const value = useMemo(
    () => ({ cart, setCart, addToCart, clearCart, updateQuantity }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
