import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Bookmark, Map as MapIcon, BookOpen, Lightbulb, HelpCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, NAV_HEIGHT } from '../atlas/palette';
import { useHelm, TabKey } from '../modes/HelmMode';

const TABS: { key: TabKey; label: string; Icon: any }[] = [
  { key: 'routes', label: 'Locations', Icon: MapPin },
  { key: 'harbors', label: 'Saved', Icon: Bookmark },
  { key: 'chart', label: 'Map', Icon: MapIcon },
  { key: 'articles', label: 'Blog', Icon: BookOpen },
  { key: 'facts', label: 'Facts', Icon: Lightbulb },
  { key: 'quiz', label: 'Quiz', Icon: HelpCircle },
];

const TabSlot: React.FC<{
  isActive: boolean;
  label: string;
  Icon: any;
  onPress: () => void;
}> = ({ isActive, label, Icon, onPress }) => {
  const press = useRef(new Animated.Value(1)).current;
  const active = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(active, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  }, [isActive, active]);

  const onIn = () =>
    Animated.spring(press, { toValue: 0.9, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  const onOut = () =>
    Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  const indicatorScale = active.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const indicatorOpacity = active;
  const iconLift = active.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const color = isActive ? palette.beam : palette.mist;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onIn}
      onPressOut={onOut}
      style={styles.slot}
      hitSlop={6}
    >
      <Animated.View
        style={[
          styles.slotInner,
          { transform: [{ scale: press }, { translateY: iconLift }] },
        ]}
      >
        <Icon size={20} color={color} strokeWidth={isActive ? 2.4 : 2} />
        <Text
          style={[
            styles.slotLabel,
            { color, fontWeight: isActive ? '800' : '600' },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          { opacity: indicatorOpacity, transform: [{ scaleX: indicatorScale }] },
        ]}
      />
    </Pressable>
  );
};

export const HelmBar: React.FC = () => {
  const { tab, setTab } = useHelm();
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={styles.bar}>
      <View style={[styles.barInner, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        <LinearGradient
          colors={['rgba(8,14,32,0.86)', 'rgba(8,14,32,0.97)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.hairline} />
        <View style={styles.row}>
          {TABS.map((t) => (
            <TabSlot
              key={t.key}
              isActive={tab === t.key}
              label={t.label}
              Icon={t.Icon}
              onPress={() => setTab(t.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const navBottomPadding = (safeBottom: number) => NAV_HEIGHT + safeBottom + 24;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  barInner: {
    overflow: 'hidden',
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(120,170,255,0.18)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: NAV_HEIGHT,
    paddingHorizontal: 4,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  slotInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: 10,
    letterSpacing: 0.15,
    marginTop: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    width: 18,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: palette.beam,
    shadowColor: palette.beam,
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
