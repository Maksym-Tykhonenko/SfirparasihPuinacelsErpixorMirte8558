import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Droplet, Waves, Anchor, Fish } from 'lucide-react-native';
import { Tappable } from './Tappable';
import LinearGradient from 'react-native-linear-gradient';
import { palette, tone } from '../atlas/palette';
import { CATEGORY_LABELS, CATEGORY_ORDER, CategoryKey } from '../atlas/wording';

const Icon = ({ k, size = 16, color }: { k: CategoryKey; size?: number; color: string }) => {
  if (k === 'All') return <Droplet size={size} color={color} fill={color} />;
  if (k === 'Freshwater') return <Waves size={size} color={color} />;
  if (k === 'Coastal') return <Anchor size={size} color={color} />;
  return <Fish size={size} color={color} />;
};

type Props = {
  active: CategoryKey;
  onChange: (k: CategoryKey) => void;
};

export const CategoryChips: React.FC<Props> = ({ active, onChange }) => {
  return (
    <View style={styles.row}>
      {CATEGORY_ORDER.map((k) => {
        const isActive = k === active;
        const accent = k === 'All' ? tone.all : k === 'Freshwater' ? tone.freshwater : k === 'Coastal' ? tone.coastal : tone.deepsea;
        return (
          <Tappable key={k} onPress={() => onChange(k)} style={styles.chipWrap}>
            <View style={styles.chip}>
              {isActive ? (
                <LinearGradient
                  colors={[accent, accent + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.chipIdle]} />
              )}
              <Icon k={k} color={isActive ? (k === 'All' ? '#1A1100' : '#fff') : palette.mist} />
              <Text style={[styles.chipText, { color: isActive ? (k === 'All' ? '#1A1100' : '#fff') : palette.mist }]}>
                {CATEGORY_LABELS[k]}
              </Text>
            </View>
          </Tappable>
        );
      })}
    </View>
  );
};

export const ScrollChips: React.FC<Props> = (p) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
    <CategoryChips {...p} />
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  scroll: { paddingVertical: 4 },
  chipWrap: { borderRadius: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    overflow: 'hidden',
    gap: 6,
    minWidth: 78,
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: 'rgba(20,36,78,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.12)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
