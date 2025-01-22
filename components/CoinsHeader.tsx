import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useCoins } from '@/context/CoinsContext';

export function CoinsHeader() {
  const { coins } = useCoins();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.coinsContainer}>
        <ThemedText style={styles.coinIcon}>💰</ThemedText>
        <ThemedText style={styles.coinsText}>{coins}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A1CEDC',
    alignItems: 'flex-end',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 