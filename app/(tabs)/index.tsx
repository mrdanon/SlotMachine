import { StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Casino Slots</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <Pressable onPress={() => router.push('/slots')}>
          <ThemedView style={styles.button}>
            <ThemedText type="subtitle">Play</ThemedText>
          </ThemedView>
        </Pressable>

        <Pressable onPress={() => router.push('/shop')}>
          <ThemedView style={styles.button}>
            <ThemedText type="subtitle">Shop</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 20,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
});
