import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Tappable } from './Tappable';

type Variant = 'glass' | 'solid' | 'flat';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  style?: StyleProp<ViewStyle>;
};

const SZ: Record<Size, number> = { sm: 32, md: 38, lg: 44 };

const STYLE: Record<Variant, ViewStyle> = {
  glass: {
    backgroundColor: 'rgba(20,36,78,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.18)',
  },
  solid: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  flat: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
};

export const IconButton: React.FC<Props> = ({ onPress, children, variant = 'glass', size = 'md', style }) => {
  const d = SZ[size];
  return (
    <Tappable onPress={onPress} scaleTo={0.9} style={[styles.wrap, { width: d, height: d, borderRadius: d / 2 }, style]}>
      <View
        style={[
          { width: d, height: d, borderRadius: d / 2 },
          styles.inner,
          STYLE[variant],
        ]}
      >
        {children}
      </View>
    </Tappable>
  );
};

const styles = StyleSheet.create({
  wrap: {},
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
