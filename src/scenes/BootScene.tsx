import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, Dimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { palette } from '../atlas/palette';
import { Backdrop } from '../channels/Backdrop';

const { width: W } = Dimensions.get('window');

const AnimCircle = Animated.createAnimatedComponent(Circle);

type Props = { onDone: () => void };

export const BootScene: React.FC<Props> = ({ onDone }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;
  const pct = useRef(0);
  const [pctText, setPctText] = React.useState(0);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    const id = progress.addListener(({ value }) => {
      pct.current = value;
      setPctText(Math.round(value * 100));
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 3400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(fade, { toValue: 0, duration: 380, useNativeDriver: true }).start();
    });

    Animated.loop(
      Animated.timing(wave, { toValue: 1, duration: 2600, useNativeDriver: true, easing: Easing.linear }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    ).start();

    const bub = (v: Animated.Value, dly: number, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(dly),
          Animated.timing(v, { toValue: 1, duration: dur, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    bub(bubble1, 0, 2400);
    bub(bubble2, 800, 2400);
    bub(bubble3, 1400, 2400);

    return () => {
      progress.removeListener(id);
    };
  }, [fade, progress, wave, ring, bubble1, bubble2, bubble3, onDone]);

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, W * 0.6] });
  const ringR = ring.interpolate({ inputRange: [0, 1], outputRange: [44, 110] });
  const ringO = ring.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });
  const waveT = wave.interpolate({ inputRange: [0, 1], outputRange: [0, -W] });

  return (
    <Backdrop>
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, { opacity: fade }]}>
        <View style={styles.hookHolder}>
          <AnimCircle r={ringR as any} opacity={ringO as any} fill="none" stroke={palette.azure} strokeWidth={1.2} cx={0} cy={0} />
          <Svg width={180} height={180} viewBox="-90 -90 180 180">
            <Defs>
              <RadialGradient id="g" cx="0" cy="0" rx="60" ry="60" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#3A7BFF" stopOpacity="0.9" />
                <Stop offset="1" stopColor="#3A7BFF" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle r="62" fill="url(#g)" />
            <Circle r="34" fill="#0E1B3D" stroke={palette.azure} strokeWidth={1.4} />
            <Path
              d="M 0 -22 Q 14 -22 14 -8 Q 14 8 0 14 Q -10 16 -10 8"
              stroke="#FFD024"
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx={-10} cy={8} r={2.6} fill="#FFD024" />
          </Svg>
          <Animated.View style={[styles.bubble, { transform: [{ translateY: bubble1.interpolate({ inputRange: [0, 1], outputRange: [0, -90] }) }], opacity: bubble1.interpolate({ inputRange: [0, 0.2, 0.9, 1], outputRange: [0, 1, 1, 0] }) }]} />
          <Animated.View style={[styles.bubble, { left: 18, transform: [{ translateY: bubble2.interpolate({ inputRange: [0, 1], outputRange: [10, -80] }) }], opacity: bubble2.interpolate({ inputRange: [0, 0.2, 0.9, 1], outputRange: [0, 0.9, 0.9, 0] }) }]} />
          <Animated.View style={[styles.bubble, { right: 20, width: 4, height: 4, transform: [{ translateY: bubble3.interpolate({ inputRange: [0, 1], outputRange: [16, -100] }) }], opacity: bubble3.interpolate({ inputRange: [0, 0.2, 0.9, 1], outputRange: [0, 1, 1, 0] }) }]} />
        </View>

        <Text style={styles.brand}>Splash Places</Text>
        <Text style={styles.brandSub}>Explore Time</Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
          <Animated.View pointerEvents="none" style={[styles.shine, { transform: [{ translateX: waveT }] }]} />
        </View>
        <Text style={styles.pct}>{pctText}%</Text>
      </Animated.View>
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  hookHolder: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  bubble: {
    position: 'absolute',
    bottom: 30,
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(180,220,255,0.85)',
  },
  brand: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.4, marginTop: 18 },
  brandSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 2 },
  barTrack: {
    marginTop: 36,
    width: '60%',
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: palette.azure,
    borderRadius: 4,
  },
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  pct: { color: palette.mist, fontSize: 12, marginTop: 12, fontWeight: '700', letterSpacing: 1 },
});
