import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { palette, tone } from '../atlas/palette';
import { Tappable } from './Tappable';

export type SpotRecord = {
  id: number;
  category: string;
  title: string;
  state: string;
  coordinates: string;
  image: any;
  content: string;
  species?: string;
};

const accentFor = (cat: string) =>
  cat === 'Freshwater' ? tone.freshwater : cat === 'Coastal' ? tone.coastal : cat === 'DeepSea' ? tone.deepsea : tone.all;

type Props = {
  item: SpotRecord;
  onPress: () => void;
  featured?: boolean;
  index?: number;
  rightSlot?: React.ReactNode;
};

export const SpotCard: React.FC<Props> = ({ item, onPress, featured, index = 0, rightSlot }) => {
  const o = useRef(new Animated.Value(0)).current;
  const t = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 380, delay: index * 60, useNativeDriver: true }),
      Animated.spring(t, { toValue: 0, delay: index * 60, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [index, o, t]);

  const accent = accentFor(item.category);

  if (featured) {
    return (
      <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
        <Tappable onPress={onPress} style={styles.featuredWrap}>
          <ImageBackground source={item.image} style={styles.featured} imageStyle={styles.image}>
            <LinearGradient
              colors={['rgba(5,10,26,0.05)', 'rgba(5,10,26,0.85)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>★ FEATURED</Text>
            </View>
            <View style={styles.featuredFoot}>
              <View>
                <Text style={[styles.stateText, { color: accent }]}>{item.state}</Text>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                {item.species ? <Text style={styles.featuredSub}>{item.species}</Text> : null}
              </View>
              <View style={styles.chev}>
                <ChevronRight size={18} color="#fff" />
              </View>
            </View>
          </ImageBackground>
        </Tappable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
      <Tappable onPress={onPress} style={styles.rowWrap}>
        <View style={styles.row}>
          <ImageBackground source={item.image} style={styles.thumb} imageStyle={styles.thumbImg}>
            <LinearGradient
              colors={['rgba(5,10,26,0.1)', 'rgba(5,10,26,0.55)']}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
          <View style={styles.rowBody}>
            <View style={styles.rowStateRow}>
              <MapPin size={11} color={accent} />
              <Text style={[styles.rowState, { color: accent }]}>{item.state}</Text>
            </View>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.species ? (
              <Text style={styles.rowSpecies} numberOfLines={1}>
                {item.species}
              </Text>
            ) : null}
          </View>
          {rightSlot ?? (
            <View style={styles.rowChev}>
              <ChevronRight size={16} color={palette.mist} />
            </View>
          )}
        </View>
      </Tappable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  featuredWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  featured: {
    height: 188,
    justifyContent: 'flex-end',
  },
  image: { borderRadius: 20 },
  featuredBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: palette.coralBadge,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  featuredFoot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 16,
  },
  stateText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, marginBottom: 4 },
  featuredTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  featuredSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
  chev: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowWrap: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,36,78,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.12)',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  thumb: {
    width: 76,
    height: 76,
    overflow: 'hidden',
    borderRadius: 14,
  },
  thumbImg: { borderRadius: 14 },
  rowBody: {
    flex: 1,
    paddingHorizontal: 14,
  },
  rowStateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  rowState: { fontSize: 11, fontWeight: '700' },
  rowTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  rowSpecies: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 },
  rowChev: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
