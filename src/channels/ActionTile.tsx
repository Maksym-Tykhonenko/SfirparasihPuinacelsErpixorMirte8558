import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Tappable } from './Tappable';
import { palette } from '../atlas/palette';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  Icon: any;
  onPress?: () => void;
  variant?: Variant;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

const COLOR: Record<Variant, { grad: string[]; border?: string }> = {
  primary: { grad: ['#3A7BFF', '#1F4FE0'] },
  danger: { grad: ['#FF6A4A', '#FF3B1F'] },
  secondary: {
    grad: ['rgba(30,50,100,0.55)', 'rgba(18,30,72,0.55)'],
    border: 'rgba(120,170,255,0.22)',
  },
};

const TILE_HEIGHT = 64;

export const ActionTile: React.FC<Props> = ({
  label,
  Icon,
  onPress,
  variant = 'secondary',
  active,
  style,
}) => {
  const c = COLOR[variant];
  const fillIcon = active && variant === 'danger';
  return (
    <Tappable onPress={onPress} scaleTo={0.95} style={[styles.wrap, style]}>
      <View style={styles.body}>
        <LinearGradient
          colors={c.grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {c.border ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.border, { borderColor: c.border }]}
          />
        ) : null}
        <View style={styles.content}>
          <Icon size={18} color="#fff" fill={fillIcon ? '#fff' : 'transparent'} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>
    </Tappable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: TILE_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderRadius: 14,
    borderWidth: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    color: palette.ivory,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
