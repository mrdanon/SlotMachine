import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SlotMachine } from '@/components/slot/SlotMachine';
import { useCoins } from '@/context/CoinsContext';
import { MACHINE_CONFIGS } from '@/constants/MachineConfigs';
import { CoinsHeader } from '@/components/CoinsHeader';

const MACHINES = {
  fruit: {
    name: 'Fruit Machine',
    symbols: ['🍎', '🍌', '🍇', '🍋', '🍒'],
  },
  diamond: {
    name: 'Diamond Machine',
    symbols: ['💎', '💍', '👑', '💰', '⭐'],
  },
  classic: {
    name: 'Classic Machine',
    symbols: ['7️⃣', '👾', '🎱', '🎰', '♠️'],
  },
};

export default function MachineScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { coins, addCoins, removeCoins } = useCoins();
  const machine = MACHINES[id as keyof typeof MACHINES];

  const handleWin = useCallback((amount: number) => {
    addCoins(250); // Fixed win amount of 250 coins
  }, [addCoins]);

  const handleSpin = useCallback((cost: number) => {
    removeCoins(cost);
  }, [removeCoins]);

  const handleBack = () => {
    router.push('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <CoinsHeader />
      <ThemedView style={styles.header}>
        <Pressable 
          onPress={handleBack}
          style={styles.backButton}
        >
          <ThemedText type="subtitle">← Back to Menu</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>{machine.name}</ThemedText>
        <SlotMachine
          machineId={id as 'fruit' | 'diamond' | 'classic'}
          onWin={handleWin}
          onSpin={handleSpin}
          disabled={coins < MACHINE_CONFIGS[id as keyof typeof MACHINE_CONFIGS].spinCost}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A1CEDC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  coins: {
    marginBottom: 20,
  },
  warning: {
    color: '#ff4444',
    marginTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
}); 