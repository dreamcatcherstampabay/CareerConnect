import { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface CartContextType {
  cart: number[];
  addToCart: (mentorId: number) => void;
  removeFromCart: (mentorId: number) => void;
  clearCart: () => void;
  isInCart: (mentorId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState<number[]>(() => {
    const savedCart = localStorage.getItem("mentor-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("mentor-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (mentorId: number) => {
    setCart((prevCart) => {
      if (!prevCart.includes(mentorId)) {
        return [...prevCart, mentorId];
      }
      return prevCart;
    });
  };

  const removeFromCart = (mentorId: number) => {
    setCart((prevCart) => prevCart.filter((id) => id !== mentorId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (mentorId: number) => {
    return cart.includes(mentorId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
