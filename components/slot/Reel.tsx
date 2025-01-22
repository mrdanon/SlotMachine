import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface ReelProps {
  symbols: string[];
  spinning: boolean;
  onSpinComplete: () => void;
  finalSymbol?: string;
  machineType?: 'fruit' | 'diamond' | 'classic';
}

export function Reel({ symbols, spinning, onSpinComplete, finalSymbol, machineType = 'fruit' }: ReelProps) {
  const [displayedSymbol, setDisplayedSymbol] = useState(symbols[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (spinning) {
      // Clear any existing intervals/timeouts
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Start spinning animation
      intervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        setDisplayedSymbol(symbols[randomIndex]);
      }, 100);

      // Set timeout to stop spinning
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayedSymbol(finalSymbol || symbols[0]);
        onSpinComplete();
      }, 2000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spinning, finalSymbol, symbols, onSpinComplete]);

  return (
    <View style={[
      styles.container,
      styles.shadow,
      machineType === 'classic' && styles.classicContainer,
      machineType === 'diamond' && styles.diamondContainer,
      machineType === 'fruit' && styles.fruitContainer,
    ]}>
      <ThemedText style={[
        styles.symbol,
        machineType === 'classic' && styles.classicSymbol
      ]}>
        {displayedSymbol}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  classicContainer: {
    backgroundColor: '#c0c0c0',
    borderWidth: 1,
    borderColor: '#a0a0a0',
  },
  diamondContainer: {
    backgroundColor: '#e8f4f8',
    borderWidth: 1,
    borderColor: '#A1CEDC',
  },
  fruitContainer: {
    backgroundColor: '#f0f8f0',
    borderWidth: 1,
    borderColor: '#90EE90',
  },
  symbol: {
    fontSize: 40,
    lineHeight: 60,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  classicSymbol: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 