import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../atlas/palette';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  eyebrowColor?: string;
  right?: React.ReactNode;
};

export const PageHead: React.FC<Props> = ({ eyebrow, title, subtitle, eyebrowColor = palette.ember, right }) => {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: eyebrowColor }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6 },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 6 },
});
