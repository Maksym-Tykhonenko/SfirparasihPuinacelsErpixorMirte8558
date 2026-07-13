import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Backdrop } from '../channels/Backdrop';
import { PageHead } from '../channels/PageHead';
import { ScrollChips } from '../channels/Chips';
import { SpotCard } from '../channels/SpotCard';
import { SPOTS } from '../atlas/data';
import { CategoryKey } from '../atlas/wording';
import { navBottomPadding } from '../channels/HelmBar';
import { useHelm } from '../modes/HelmMode';
import { palette } from '../atlas/palette';

export const RoutesScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { openSpot } = useHelm();
  const [cat, setCat] = useState<CategoryKey>('All');

  const list = useMemo(() => {
    if (cat === 'All') return SPOTS;
    return SPOTS.filter((s) => s.category === cat);
  }, [cat]);

  const featured = list[0];
  const rest = list.slice(1);

  return (
    <Backdrop>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PageHead
          eyebrow="American Water Atlas"
          title="Fishing Locations"
          subtitle="Prime spots across America"
        />
        <ScrollChips active={cat} onChange={setCat} />
        <Text style={styles.count}>{list.length} locations</Text>
      </View>

      <FlatList
        data={rest}
        keyExtractor={(it) => String(it.id)}
        ListHeaderComponent={
          featured ? (
            <View style={{ marginTop: 4 }}>
              <SpotCard featured item={featured} onPress={() => openSpot(featured.id)} index={0} />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <SpotCard item={item} onPress={() => openSpot(item.id)} index={index + 1} />
        )}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: navBottomPadding(insets.bottom),
        }}
        showsVerticalScrollIndicator={false}
      />
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  top: { paddingBottom: 4 },
  count: {
    color: palette.faint,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
});
