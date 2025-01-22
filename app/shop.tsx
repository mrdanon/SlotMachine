import React from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useCoins } from '@/context/CoinsContext';

const COIN_PACKAGES = [
  { id: 'small', coins: 1000, price: '$0.99', realPrice: 0.99 },
  { id: 'medium', coins: 5000, price: '$4.99', realPrice: 4.99 },
  { id: 'large', coins: 10000, price: '$9.99', realPrice: 9.99 },
  { id: 'huge', coins: 25000, price: '$24.99', realPrice: 24.99 },
];

export default function ShopScreen() {
  const router = useRouter();
  const { coins, addCoins } = useCoins();

  const handlePurchase = (packageCoins: number) => {
    // In a real app, you would handle actual payment here
    addCoins(packageCoins);
    alert(`Successfully purchased ${packageCoins} coins!`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable 
          onPress={() => router.push('/(tabs)')}
          style={styles.backButton}
        >
          <ThemedText type="subtitle">← Back to Menu</ThemedText>
        </Pressable>
        <ThemedText type="subtitle" style={styles.balance}>
          Current Balance: {coins} coins
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Shop</ThemedText>
        
        {COIN_PACKAGES.map(pkg => (
          <Pressable 
            key={pkg.id}
            onPress={() => handlePurchase(pkg.coins)}
          >
            <ThemedView style={styles.packageCard}>
              <ThemedText type="subtitle">{pkg.coins} Coins</ThemedText>
              <ThemedText>{pkg.price}</ThemedText>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A1CEDC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  packageCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#A1CEDC',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  balance: {
    marginLeft: 'auto',
  },
}); 