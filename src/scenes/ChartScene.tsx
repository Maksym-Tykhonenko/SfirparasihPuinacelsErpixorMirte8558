import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLG, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight, MapPin, X } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { PageHead } from '../channels/PageHead';
import { ScrollChips } from '../channels/Chips';
import { Tappable } from '../channels/Tappable';
import { IconButton } from '../channels/IconButton';
import { Button } from '../channels/Button';
import { navBottomPadding } from '../channels/HelmBar';
import { palette, tone } from '../atlas/palette';
import { SPOTS } from '../atlas/data';
import { CategoryKey } from '../atlas/wording';
import { useHelm } from '../modes/HelmMode';

const { width: W } = Dimensions.get('window');
const MAP_H = 460;
const MAP_W = W;

const LAT_MIN = 24;
const LAT_MAX = 49.5;
const LNG_MIN = -125;
const LNG_MAX = -67;

const project = (coordStr: string) => {
  const [lat, lng] = coordStr.split(',').map((p) => parseFloat(p.trim()));
  if (Number.isNaN(lat) || Number.isNaN(lng)) return { x: MAP_W / 2, y: MAP_H / 2 };
  const cLat = Math.max(LAT_MIN, Math.min(LAT_MAX, lat));
  const cLng = Math.max(LNG_MIN, Math.min(LNG_MAX, lng));
  const x = ((cLng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (MAP_W - 60) + 30;
  const y = ((LAT_MAX - cLat) / (LAT_MAX - LAT_MIN)) * (MAP_H - 120) + 50;
  return { x, y };
};

const accentFor = (cat: string) =>
  cat === 'Freshwater' ? tone.freshwater : cat === 'Coastal' ? tone.coastal : cat === 'DeepSea' ? tone.deepsea : tone.all;

const US_OUTLINE =
  'M 30,180 L 70,140 L 130,120 L 200,110 L 270,108 L 320,118 L 350,140 L 380,128 L 410,138 L 470,158 L 540,170 L 610,172 L 660,200 L 700,210 L 740,222 L 780,232 L 810,232 L 838,222 L 856,222 L 876,238 L 898,266 L 902,300 L 880,316 L 838,318 L 818,330 L 798,332 L 764,322 L 720,322 L 678,328 L 642,328 L 620,346 L 590,348 L 564,344 L 540,346 L 508,354 L 480,366 L 460,360 L 420,358 L 386,344 L 350,318 L 318,288 L 280,260 L 240,232 L 198,222 L 158,222 L 116,232 L 80,236 L 50,222 L 36,206 Z';

const ALASKA_OUTLINE = 'M 30,330 L 60,310 L 90,316 L 110,330 L 120,346 L 100,360 L 70,366 L 40,360 L 30,348 Z';
const HAWAII_OUTLINE = 'M 156,366 L 168,358 L 180,366 L 172,378 L 158,376 Z';

const Pin: React.FC<{
  x: number;
  y: number;
  color: string;
  active: boolean;
  onPress: () => void;
}> = ({ x, y, color, active, onPress }) => {
  const ring = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring, { toValue: 1, duration: 1300, useNativeDriver: true }),
          Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      ring.setValue(0);
    }
  }, [active, ring]);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
  const ringO = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  const size = active ? 22 : 14;
  return (
    <Tappable
      onPress={onPress}
      style={[
        styles.pinHolder,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
        },
      ]}
      scaleTo={0.85}
    >
      {active && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pinRing,
            {
              backgroundColor: color,
              transform: [{ scale: ringScale }],
              opacity: ringO,
              width: size,
              height: size,
              borderRadius: size,
            },
          ]}
        />
      )}
      <View style={[styles.pin, { width: size, height: size, borderRadius: size, backgroundColor: color, borderColor: active ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
        {active ? <View style={styles.pinCore} /> : null}
      </View>
    </Tappable>
  );
};

export const ChartScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { openSpot } = useHelm();
  const [cat, setCat] = useState<CategoryKey>('All');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const cardY = useRef(new Animated.Value(220)).current;
  const cardO = useRef(new Animated.Value(0)).current;

  const list = useMemo(() => (cat === 'All' ? SPOTS : SPOTS.filter((s) => s.category === cat)), [cat]);
  const selected = useMemo(() => SPOTS.find((s) => s.id === selectedId) || null, [selectedId]);

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.spring(cardY, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 6 }),
        Animated.timing(cardO, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(cardY, { toValue: 220, duration: 220, useNativeDriver: true }),
        Animated.timing(cardO, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [selected, cardY, cardO]);

  useEffect(() => {
    if (selectedId && !list.find((s) => s.id === selectedId)) setSelectedId(null);
  }, [list, selectedId]);

  const dismiss = () => setSelectedId(null);

  return (
    <Backdrop>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PageHead eyebrow="Interactive" title="Fishing Map" />
        <ScrollChips active={cat} onChange={setCat} />
      </View>

      <View style={[styles.mapHolder, { paddingBottom: navBottomPadding(insets.bottom) - 30 }]}>
        <View style={styles.mapCard}>
          <LinearGradient
            colors={['rgba(20,42,90,0.55)', 'rgba(8,18,45,0.85)']}
            style={StyleSheet.absoluteFill}
          />
          <Svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
            <Defs>
              <SvgLG id="landGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#162a55" stopOpacity="0.65" />
                <Stop offset="1" stopColor="#0d1a3c" stopOpacity="0.5" />
              </SvgLG>
              <SvgLG id="landEdge" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#3A7BFF" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#3A7BFF" stopOpacity="0.15" />
              </SvgLG>
            </Defs>
            <Path d={US_OUTLINE} fill="url(#landGrad)" stroke="url(#landEdge)" strokeWidth={1.2} />
            <Path d={ALASKA_OUTLINE} fill="url(#landGrad)" stroke="url(#landEdge)" strokeWidth={1.2} />
            <Path d={HAWAII_OUTLINE} fill="url(#landGrad)" stroke="url(#landEdge)" strokeWidth={1.2} />
          </Svg>
          {list.map((s) => {
            const p = project(s.coordinates);
            return (
              <Pin
                key={s.id}
                x={p.x}
                y={p.y}
                color={accentFor(s.category)}
                active={selectedId === s.id}
                onPress={() => setSelectedId((c) => (c === s.id ? null : s.id))}
              />
            );
          })}
          <View style={styles.compass}>
            <Text style={styles.compassText}>N</Text>
          </View>
          <Text style={styles.scaleText}>~1000 km</Text>
        </View>
      </View>

      {selected && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.cardWrap,
            { bottom: navBottomPadding(insets.bottom) - 16, opacity: cardO, transform: [{ translateY: cardY }] },
          ]}
        >
          <View style={styles.card}>
            <ImageBackground source={selected.image} style={styles.cardThumb} imageStyle={styles.cardThumbImg} />
            <View style={styles.cardBody}>
              <View style={styles.stateRow}>
                <MapPin size={11} color={accentFor(selected.category)} />
                <Text style={[styles.cardState, { color: accentFor(selected.category) }]}>{selected.state}</Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {selected.title}
              </Text>
              <Text style={styles.cardCoord}>{selected.coordinates}</Text>
            </View>
            <IconButton onPress={dismiss} variant="flat" size="sm">
              <X size={14} color={palette.mist} />
            </IconButton>
          </View>
          <Button
            label="View Details"
            variant="primary"
            size="md"
            iconRight={<ChevronRight size={16} color="#fff" />}
            onPress={() => openSpot(selected.id, true)}
            fullWidth
            style={{ marginTop: 8 }}
          />
        </Animated.View>
      )}
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  top: { paddingBottom: 0 },
  mapHolder: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 6 },
  mapCard: {
    width: MAP_W,
    height: MAP_H,
    overflow: 'hidden',
  },
  compass: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(20,36,78,0.7)',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  compassText: { color: palette.mist, fontSize: 11, fontWeight: '800' },
  scaleText: {
    position: 'absolute', bottom: 14, right: 16,
    color: palette.faint, fontSize: 10, fontWeight: '700',
  },
  pinHolder: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  pinRing: { position: 'absolute' },
  pin: {
    borderWidth: 1.4,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  pinCore: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' },

  cardWrap: { position: 'absolute', left: 16, right: 16 },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(10,18,42,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.2)',
    alignItems: 'center',
    gap: 12,
  },
  cardThumb: { width: 58, height: 58, borderRadius: 12, overflow: 'hidden' },
  cardThumbImg: { borderRadius: 12 },
  cardBody: { flex: 1 },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardState: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 2 },
  cardCoord: { color: palette.faint, fontSize: 10.5, marginTop: 2, fontVariant: ['tabular-nums'] },
});
