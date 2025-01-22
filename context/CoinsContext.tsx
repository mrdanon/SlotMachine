import React, { createContext, useContext, useState } from 'react';

interface CoinsContextType {
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
}

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(1000); // Starting coins

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const removeCoins = (amount: number) => {
    setCoins(prev => prev - amount);
  };

  return (
    <CoinsContext.Provider value={{ coins, addCoins, removeCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const context = useContext(CoinsContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinsProvider');
  }
  return context;
} 