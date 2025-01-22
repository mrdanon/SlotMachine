import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 50;
const COLORS = ['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#FFA500', '#00FFFF'];

interface FireworkParticle {
  position: Animated.ValueXY;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

export function Fireworks() {
  const particles = useRef<FireworkParticle[]>(
    [...Array(PARTICLE_COUNT)].map(() => ({
      position: new Animated.ValueXY({ x: 0, y: 0 }),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  ).current;

  useEffect(() => {
    const createFirework = (offsetX: number, offsetY: number) => {
      return particles.map((particle) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 100;
        const duration = Math.random() * 800 + 800;

        return Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.position, {
              toValue: {
                x: Math.cos(angle) * distance + offsetX,
                y: Math.sin(angle) * distance + offsetY,
              },
              duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(particle.scale, {
                toValue: Math.random() * 0.5 + 0.5,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: duration * 0.8,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.5 + 0.5,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: duration * 0.8,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]);
      });
    };

    const allAnimations = [
      ...createFirework(-width * 0.25, -height * 0.25),
      ...createFirework(width * 0.25, -height * 0.25),
      ...createFirework(0, 0),
      ...createFirework(-width * 0.25, height * 0.25),
      ...createFirework(width * 0.25, height * 0.25),
    ];

    Animated.stagger(50, allAnimations).start();

    return () => {
      particles.forEach(particle => {
        particle.position.setValue({ x: 0, y: 0 });
        particle.scale.setValue(0);
        particle.opacity.setValue(0);
      });
    };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.position.x },
                { translateY: particle.position.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        >
          <View style={styles.particleTrail} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: height / 2,
    left: width / 2,
  },
  particleTrail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ scale: 1.5 }],
  },
}); 