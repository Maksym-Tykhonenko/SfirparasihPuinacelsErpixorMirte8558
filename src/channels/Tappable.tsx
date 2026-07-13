import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Props = PressableProps & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export const Tappable: React.FC<Props> = ({
  scaleTo = 0.96,
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      {...rest}
      style={style}
      onPressIn={(e) => {
        Animated.spring(s, { toValue: scaleTo, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[styles.inner, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
