import { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (mentorId: number) => void;
  removeFromFavorites: (mentorId: number) => void;
  isFavorite: (mentorId: number) => boolean;
  toggleFavorite: (mentorId: number) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('mentorFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('mentorFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (mentorId: number) => {
    if (!favorites.includes(mentorId)) {
      setFavorites(prev => [...prev, mentorId]);
    }
  };

  const removeFromFavorites = (mentorId: number) => {
    setFavorites(prev => prev.filter(id => id !== mentorId));
  };

  const isFavorite = (mentorId: number): boolean => {
    return favorites.includes(mentorId);
  };

  const toggleFavorite = (mentorId: number) => {
    if (isFavorite(mentorId)) {
      removeFromFavorites(mentorId);
    } else {
      addToFavorites(mentorId);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}