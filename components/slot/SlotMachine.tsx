import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Reel } from './Reel';
import { MACHINE_CONFIGS } from '@/constants/MachineConfigs';
import { WinAnimation } from './WinAnimation';

const DEFAULT_SYMBOLS = ['🍎', '🍌', '🍇', '🍋', '🍒', '7'];
const AUTO_SPIN_DELAY = 1000; // 1 second delay between auto-spins

interface SlotMachineProps {
  machineId: 'fruit' | 'diamond' | 'classic';
  onWin?: (amount: number) => void;
  onSpin?: (cost: number) => void;
  disabled?: boolean;
}

export function SlotMachine({ 
  machineId,
  onWin,
  onSpin,
  disabled = false
}: SlotMachineProps) {
  const machineConfig = MACHINE_CONFIGS[machineId];
  const { symbols, combinations, spinCost } = machineConfig;
  const [spinning, setSpinning] = useState(false);
  const [autoSpinning, setAutoSpinning] = useState(false);
  const [reelResults, setReelResults] = useState<string[]>(Array(3).fill(symbols[0]));
  const [completedReels, setCompletedReels] = useState(0);
  const autoSpinTimeout = useRef<NodeJS.Timeout | null>(null);
  const spinInProgress = useRef(false);
  const [winAnimation, setWinAnimation] = useState<{symbol: string, amount: number} | null>(null);

  const getWeightedRandomSymbol = (symbols: string[], weights: number[]) => {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < symbols.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return symbols[i];
      }
    }
    return symbols[symbols.length - 1];
  };

  const handleSpin = useCallback(() => {
    if (disabled || spinInProgress.current) return;
    
    spinInProgress.current = true;
    onSpin?.(spinCost);
    setSpinning(true);
    setCompletedReels(0);
    
    setTimeout(() => {
      const newResults = Array(3).fill('').map(() => 
        getWeightedRandomSymbol(symbols, machineConfig.symbolWeights)
      );
      setReelResults(newResults);
    }, 0);
  }, [disabled, onSpin, spinCost, symbols, machineConfig.symbolWeights]);

  const checkWin = useCallback(() => {
    const symbolCounts = reelResults.reduce((counts: Record<string, number>, symbol) => {
      counts[symbol] = (counts[symbol] || 0) + 1;
      return counts;
    }, {});

    let winAmount = 0;
    let winningSymbol = '';
    let maxCount = 0;

    Object.entries(symbolCounts).forEach(([symbol, count]) => {
      if (count > maxCount) {
        maxCount = count;
        winningSymbol = symbol;
      }
    });

    if (maxCount === 3) {
      winAmount = combinations.three[winningSymbol as keyof typeof combinations.three] || 0;
    } else if (maxCount === 2) {
      winAmount = combinations.two[winningSymbol as keyof typeof combinations.two] || 
                 combinations.two.default;
    }

    if (winAmount > 0 && onWin) {
      setWinAnimation({ symbol: winningSymbol, amount: winAmount });
      setTimeout(() => {
        onWin(winAmount);
      }, 0);
    }
  }, [reelResults, combinations, onWin]);

  const scheduleNextAutoSpin = useCallback(() => {
    if (autoSpinning && !disabled) {
      autoSpinTimeout.current = setTimeout(() => {
        handleSpin();
      }, AUTO_SPIN_DELAY);
    }
  }, [autoSpinning, disabled, handleSpin]);

  const handleReelComplete = useCallback(() => {
    setCompletedReels(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setSpinning(false);
        spinInProgress.current = false;
        checkWin();
        scheduleNextAutoSpin();
      }
      return newCount;
    });
  }, [checkWin, scheduleNextAutoSpin]);

  const toggleAutoSpin = useCallback(() => {
    setAutoSpinning(prev => {
      const newValue = !prev;
      if (newValue && !disabled && !spinning) {
        // Start first spin immediately when enabling auto-spin
        handleSpin();
      }
      return newValue;
    });
  }, [disabled, spinning, handleSpin]);

  // Cleanup auto-spin on unmount or when disabled
  useEffect(() => {
    if (disabled || !autoSpinning) {
      if (autoSpinTimeout.current) {
        clearTimeout(autoSpinTimeout.current);
        autoSpinTimeout.current = null;
      }
      setAutoSpinning(false);
    }

    return () => {
      if (autoSpinTimeout.current) {
        clearTimeout(autoSpinTimeout.current);
        autoSpinTimeout.current = null;
      }
    };
  }, [disabled, autoSpinning]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <View style={styles.reelsContainer}>
          {Array(3).fill('').map((_, index) => (
            <Reel
              key={index}
              symbols={symbols}
              spinning={spinning}
              onSpinComplete={handleReelComplete}
              finalSymbol={reelResults[index]}
              machineType={machineId}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            onPress={handleSpin}
            disabled={spinning || disabled}
            style={({ pressed }) => [
              styles.spinButton,
              (spinning || disabled) && styles.spinButtonDisabled,
              pressed && styles.spinButtonPressed
            ]}
          >
            <View style={styles.spinButtonContent}>
              <ThemedText style={styles.spinButtonText}>
                SPIN!
              </ThemedText>
              <ThemedText style={styles.spinCostText}>
                {spinCost} coins
              </ThemedText>
            </View>
          </Pressable>

          <Pressable 
            onPress={toggleAutoSpin}
            disabled={disabled}
            style={({ pressed }) => [
              styles.autoSpinButton,
              autoSpinning && styles.autoSpinButtonActive,
              disabled && styles.spinButtonDisabled,
              pressed && styles.spinButtonPressed
            ]}
          >
            <ThemedText type="subtitle">
              {autoSpinning ? 'Stop Auto' : 'Auto Spin'}
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.combinationsTitle}>Winning Combinations</ThemedText>
        
        <View style={styles.combinationSection}>
          <ThemedText style={styles.sectionTitle}>Three of a Kind</ThemedText>
          {Object.entries(combinations.three).map(([symbol, prize]) => (
            <View key={symbol} style={styles.combination}>
              <ThemedText style={styles.symbols}>{symbol} {symbol} {symbol}</ThemedText>
              <ThemedText style={styles.prize}>{prize} coins</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.combinationSection}>
          <ThemedText style={styles.sectionTitle}>Two of a Kind</ThemedText>
          {Object.entries(combinations.two)
            .filter(([key]) => key !== 'default')
            .map(([symbol, prize]) => (
              <View key={symbol} style={styles.combination}>
                <ThemedText style={styles.symbols}>{symbol} {symbol} ⚪️</ThemedText>
                <ThemedText style={styles.prize}>{prize} coins</ThemedText>
              </View>
          ))}
          <View style={styles.combination}>
            <ThemedText style={styles.symbols}>Any Two Same</ThemedText>
            <ThemedText style={styles.prize}>{combinations.two.default} coins</ThemedText>
          </View>
        </View>

        {winAnimation && (
          <WinAnimation
            symbol={winAnimation.symbol}
            amount={winAnimation.amount}
            onComplete={() => setWinAnimation(null)}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  reelsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  spinButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B8860B',
  },
  autoSpinButton: {
    backgroundColor: '#DCA1A1',
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  autoSpinButtonActive: {
    backgroundColor: '#47DC47',
  },
  spinButtonDisabled: {
    opacity: 0.5,
  },
  spinButtonPressed: {
    opacity: 0.8,
    backgroundColor: '#B8860B',
  },
  spinButtonContent: {
    alignItems: 'center',
  },
  spinButtonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  spinCostText: {
    color: '#000000',
    fontSize: 14,
  },
  combinationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  combinationSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  combination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 40,
  },
  symbols: {
    fontSize: 24,
    lineHeight: 32,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  prize: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 