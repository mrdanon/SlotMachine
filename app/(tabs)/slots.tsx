import React from 'react';
import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { CoinsHeader } from '@/components/CoinsHeader';
import { MACHINE_CONFIGS } from '@/constants/MachineConfigs';

const MACHINES = [
  { 
    id: 'fruit', 
    name: MACHINE_CONFIGS.fruit.name, 
    symbols: MACHINE_CONFIGS.fruit.symbols,
    spinCost: MACHINE_CONFIGS.fruit.spinCost,
  },
  { 
    id: 'diamond', 
    name: MACHINE_CONFIGS.diamond.name, 
    symbols: MACHINE_CONFIGS.diamond.symbols,
    spinCost: MACHINE_CONFIGS.diamond.spinCost,
  },
  { 
    id: 'classic', 
    name: MACHINE_CONFIGS.classic.name, 
    symbols: MACHINE_CONFIGS.classic.symbols,
    spinCost: MACHINE_CONFIGS.classic.spinCost,
  },
];

export default function SlotsScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <CoinsHeader />
      <ScrollView style={styles.scrollContainer}>
        <ThemedText type="title" style={styles.title}>Select Machine</ThemedText>
        
        {MACHINES.map(machine => (
          <Pressable 
            key={machine.id} 
            onPress={() => router.push(`/machine/${machine.id}`)}
          >
            <ThemedView style={styles.machineCard}>
              <ThemedText type="subtitle">{machine.name}</ThemedText>
              <ThemedText style={styles.costText}>Cost: {machine.spinCost} coins</ThemedText>
              <View style={styles.symbolsContainer}>
                {machine.symbols.map((symbol, index) => (
                  <ThemedText key={index} style={styles.symbol}>
                    {symbol}
                  </ThemedText>
                ))}
              </View>
            </ThemedView>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  machineCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    minHeight: 100,
  },
  costText: {
    marginTop: 5,
    opacity: 0.8,
  },
  symbolsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 40,
  },
  symbol: {
    fontSize: 24,
    lineHeight: 32,
    textAlignVertical: 'center',
    includeFontPadding: false,
    marginHorizontal: 4,
  },
}); 