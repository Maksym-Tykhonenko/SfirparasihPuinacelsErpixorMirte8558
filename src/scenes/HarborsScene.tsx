import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, MapPin, Waves, Anchor, Fish } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { PageHead } from '../channels/PageHead';
import { navBottomPadding } from '../channels/HelmBar';
import { Tappable } from '../channels/Tappable';
import { palette, tone } from '../atlas/palette';
import { useHarbor } from '../modes/HarborMode';
import { useHelm } from '../modes/HelmMode';
import { SPOTS } from '../atlas/data';
import { SpotRecord } from '../channels/SpotCard';

const TIPS = [
  { icon: Waves, text: 'Save freshwater spots for trout season planning' },
  { icon: Anchor, text: 'Bookmark coastal places before your beach trip' },
  { icon: Fish, text: 'Keep offshore charters saved for quick access' },
];

const accentFor = (cat: string) =>
  cat === 'Freshwater' ? tone.freshwater : cat === 'Coastal' ? tone.coastal : cat === 'DeepSea' ? tone.deepsea : tone.all;

const SavedCard: React.FC<{ item: SpotRecord; onPress: () => void; index: number }> = ({ item, onPress, index }) => {
  const o = useRef(new Animated.Value(0)).current;
  const t = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true }),
      Animated.spring(t, { toValue: 0, delay: index * 60, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [index, o, t]);
  const accent = accentFor(item.category);
  return (
    <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
      <Tappable onPress={onPress} style={styles.cardWrap}>
        <ImageBackground source={item.image} style={styles.card} imageStyle={styles.cardImg}>
          <LinearGradient
            colors={['rgba(5,10,26,0.0)', 'rgba(5,10,26,0.45)', 'rgba(5,10,26,0.92)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.cardTopRow}>
            <View style={styles.stateRow}>
              <MapPin size={11} color={accent} />
              <Text style={[styles.cardState, { color: accent }]}>{item.state}</Text>
            </View>
            <View style={styles.marker}>
              <Bookmark size={14} color="#fff" fill="#fff" />
            </View>
          </View>
          <View style={styles.cardFoot}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.species ? <Text style={styles.cardSpecies}>{item.species}</Text> : null}
          </View>
        </ImageBackground>
      </Tappable>
    </Animated.View>
  );
};

const EmptyState: React.FC = () => {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1900, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1900, useNativeDriver: true }),
      ]),
    ).start();
  }, [float]);
  const ty = float.interpolate({ inputRange: [0, 1], outputRange: [-3, 3] });
  return (
    <View style={styles.empty}>
      <Animated.View style={[styles.emptyIcon, { transform: [{ translateY: ty }] }]}>
        <LinearGradient
          colors={['rgba(58,123,255,0.18)', 'rgba(58,123,255,0)']}
          style={StyleSheet.absoluteFill}
        />
        <Bookmark size={36} color={palette.mist} />
      </Animated.View>
      <Text style={styles.emptyTitle}>No Saved Locations</Text>
      <Text style={styles.emptySub}>
        Explore outdoor locations and tap the bookmark icon to save your favorites here.
      </Text>
      <View style={styles.tipsLabel}>
        <View style={styles.tipLine} />
        <Text style={styles.tipsLabelText}>Tips for your trip</Text>
        <View style={styles.tipLine} />
      </View>
      {TIPS.map((tip, i) => {
        const Icon = tip.icon;
        return (
          <View key={i} style={styles.tipRow}>
            <View style={styles.tipIcon}>
              <Icon size={14} color={palette.azure} />
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        );
      })}
    </View>
  );
};

export const HarborsScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { saved } = useHarbor();
  const { openSpot } = useHelm();

  const list = useMemo(() => SPOTS.filter((s) => saved.includes(s.id)), [saved]);

  return (
    <Backdrop>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PageHead
          eyebrow="My Collection"
          title="Saved Spots"
          subtitle={`${list.length} ${list.length === 1 ? 'location' : 'locations'} saved`}
        />
      </View>
      {list.length === 0 ? (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: navBottomPadding(insets.bottom) }}>
          <EmptyState />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item, index }) => <SavedCard item={item} index={index} onPress={() => openSpot(item.id)} />}
          contentContainerStyle={{
            paddingTop: 6,
            paddingBottom: navBottomPadding(insets.bottom),
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  top: { paddingBottom: 4 },
  cardWrap: { marginBottom: 14, borderRadius: 18, overflow: 'hidden' },
  card: { height: 130, justifyContent: 'space-between', padding: 14 },
  cardImg: { borderRadius: 18 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardState: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  marker: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#FF4B36',
    alignItems: 'center', justifyContent: 'center',
  },
  cardFoot: {},
  cardTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  cardSpecies: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  emptyIcon: {
    width: 96, height: 96, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(20,36,78,0.55)',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.18)',
    overflow: 'hidden',
  },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 16 },
  emptySub: { color: palette.faint, fontSize: 13, textAlign: 'center', marginTop: 8, maxWidth: 260, lineHeight: 18 },
  tipsLabel: { flexDirection: 'row', alignItems: 'center', marginTop: 32, marginBottom: 12, gap: 10, alignSelf: 'stretch', paddingHorizontal: 12 },
  tipLine: { flex: 1, height: 1, backgroundColor: 'rgba(120,170,255,0.18)' },
  tipsLabelText: { color: palette.faint, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  tipRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    alignSelf: 'stretch', paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: 'rgba(20,36,78,0.55)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(120,170,255,0.12)',
    marginBottom: 10,
  },
  tipIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(58,123,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  tipText: { color: palette.paper, fontSize: 12.5, flex: 1, lineHeight: 17 },
});
