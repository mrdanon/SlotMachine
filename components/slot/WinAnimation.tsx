import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Dimensions } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Fireworks } from '../animations/Fireworks';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 50;
const COLORS = ['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#FFA500', '#00FFFF'];
const CENTER_OFFSET_Y = -100; // Move everything up by 100 units

interface WinAnimationProps {
  symbol: string;
  amount: number;
  onComplete: () => void;
}

interface FireworkParticle {
  position: Animated.ValueXY;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

export function WinAnimation({ symbol, amount, onComplete }: WinAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const symbolAnims = useRef([...Array(PARTICLE_COUNT)].map(() => ({
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    rotation: new Animated.Value(0),
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    // Animate price display
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(800),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete());

    // Animate bursting symbols
    symbolAnims.forEach((anim, index) => {
      const angle = (index * Math.PI * 2) / symbolAnims.length;
      const distance = Math.random() * 300 + 100;
      const duration = Math.random() * 800 + 800;

      Animated.sequence([
        Animated.parallel([
          Animated.timing(anim.position, {
            toValue: {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
            },
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.scale, {
              toValue: Math.random() * 0.5 + 0.5,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: Math.random() * 0.5 + 0.5,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim.rotation, {
            toValue: 360,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50], // Move up by 50 units during animation
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <View style={[styles.centerPoint, { transform: [{ translateY: CENTER_OFFSET_Y }] }]}>
        {/* Bursting symbols */}
        {symbolAnims.map((anim, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.symbol,
              {
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.position.x },
                  { translateY: anim.position.y },
                  { rotate: anim.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })},
                  { scale: anim.scale },
                ],
              },
            ]}
          >
            {symbol}
          </Animated.Text>
        ))}

        {/* Price display - moved after symbols to be on top */}
        <Animated.View 
          style={[
            styles.priceContainer, 
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: -50 }, // Fixed position above burst
              ],
              zIndex: 1, // Ensure it's above symbols
            }
          ]}
        >
          <ThemedText style={styles.priceText}>+{amount}</ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPoint: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    position: 'absolute',
    padding: 10, // Add padding to prevent text clipping
  },
  priceText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF0000',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Darker shadow
    textShadowOffset: { width: 3, height: 3 }, // Larger offset
    textShadowRadius: 5, // Larger radius
    includeFontPadding: false, // Fix Android text rendering
    textAlignVertical: 'center', // Fix Android text rendering
    lineHeight: 70, // Fix Android text rendering
  },
  symbol: {
    position: 'absolute',
    fontSize: 40,
    textAlignVertical: 'center', // Fix Android text rendering
    includeFontPadding: false, // Fix Android text rendering
  },
}); 