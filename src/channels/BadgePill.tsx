import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';

type Props = {
  label: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
};

export const BadgePill: React.FC<Props> = ({ label, color = 'rgba(58,123,255,0.85)', style, textColor = '#fff' }) => (
  <View style={[styles.pill, { backgroundColor: color }, style]}>
    <Text style={[styles.text, { color: textColor }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
});
