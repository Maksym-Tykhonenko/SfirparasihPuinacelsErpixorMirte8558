import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Tappable } from './Tappable';
import { palette } from '../atlas/palette';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'beam' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

const SIZE: Record<ButtonSize, { h: number; px: number; font: number; radius: number; gap: number }> = {
  sm: { h: 38, px: 14, font: 12.5, radius: 12, gap: 6 },
  md: { h: 48, px: 18, font: 14, radius: 14, gap: 8 },
  lg: { h: 56, px: 22, font: 15, radius: 16, gap: 10 },
};

type Skin = {
  colors: string[];
  text: string;
  border?: string;
  glass?: boolean;
};

const SKIN: Record<ButtonVariant, Skin> = {
  primary: { colors: ['#3A7BFF', '#1F4FE0'], text: '#fff' },
  danger: { colors: ['#FF6A4A', '#FF3B1F'], text: '#fff' },
  beam: { colors: ['#FFD024', '#F2A40C'], text: '#1A1100' },
  secondary: {
    colors: ['rgba(30,50,100,0.65)', 'rgba(18,30,72,0.65)'],
    text: '#fff',
    border: 'rgba(120,170,255,0.22)',
    glass: true,
  },
  ghost: {
    colors: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)'],
    text: palette.paper,
    border: 'rgba(120,170,255,0.12)',
    glass: true,
  },
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  style,
  textStyle,
  disabled,
}) => {
  const s = SIZE[size];
  const k = SKIN[variant];

  return (
    <Tappable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.wrap,
        { borderRadius: s.radius },
        fullWidth ? { alignSelf: 'stretch' } : null,
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}
      scaleTo={0.96}
    >
      <View
        style={[
          styles.body,
          {
            height: s.h,
            borderRadius: s.radius,
            paddingHorizontal: s.px,
          },
        ]}
      >
        <LinearGradient
          colors={k.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {k.border ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { borderRadius: s.radius, borderWidth: 1, borderColor: k.border }]}
          />
        ) : null}
        <View style={[styles.row, { gap: s.gap }]}>
          {iconLeft}
          <Text
            style={[styles.label, { color: k.text, fontSize: s.font }, textStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconRight}
        </View>
      </View>
    </Tappable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  body: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
