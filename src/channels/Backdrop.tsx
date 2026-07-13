import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette } from '../atlas/palette';

export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const glow1 = useRef(new Animated.Value(0)).current;
  const glow2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (v: Animated.Value, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: dur, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: dur, useNativeDriver: true }),
        ]),
      ).start();
    loop(glow1, 5200);
    loop(glow2, 7800);
  }, [glow1, glow2]);

  const t1 = glow1.interpolate({ inputRange: [0, 1], outputRange: [-40, 40] });
  const t2 = glow2.interpolate({ inputRange: [0, 1], outputRange: [30, -30] });

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[palette.abyss, palette.midnight, palette.deepBay]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { top: -120, left: -80, transform: [{ translateX: t1 }, { translateY: t1 }] }]}
      >
        <LinearGradient
          colors={['rgba(58,123,255,0.30)', 'rgba(58,123,255,0)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { bottom: -100, right: -100, transform: [{ translateX: t2 }, { translateY: t2 }] }]}
      >
        <LinearGradient
          colors={['rgba(124,92,255,0.22)', 'rgba(124,92,255,0)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: palette.abyss },
  glow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 200,
    overflow: 'hidden',
  },
});
