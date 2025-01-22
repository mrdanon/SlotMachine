import React from 'react';
import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const MACHINES = [
  { id: 'fruit', name: 'Fruit Machine', symbols: ['🍎', '🍌', '🍇', '🍋', '🍒'] },
  { id: 'diamond', name: 'Diamond Machine', symbols: ['💎', '💍', '👑', '💰', '⭐'] },
  { id: 'classic', name: 'Classic Machine', symbols: ['7️⃣', '👾', '🎱', '🎰', '♠️'] },
];

export default function SlotsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Select Machine</ThemedText>
      
      {MACHINES.map(machine => (
        <Pressable 
          key={machine.id} 
          onPress={() => router.push(`/machine/${machine.id}`)}
        >
          <ThemedView style={styles.machineCard}>
            <ThemedText type="subtitle">{machine.name}</ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: {
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