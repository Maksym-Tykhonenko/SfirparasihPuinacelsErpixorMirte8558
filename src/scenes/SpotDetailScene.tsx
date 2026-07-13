import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, MapPin, Share2, Map as MapIcon } from 'lucide-react-native';
import { SPOTS, SHORT_HINTS } from '../atlas/data';
import { palette, tone } from '../atlas/palette';
import { BadgePill } from '../channels/BadgePill';
import { Backdrop } from '../channels/Backdrop';
import { IconButton } from '../channels/IconButton';
import { ActionTile } from '../channels/ActionTile';
import { useHarbor } from '../modes/HarborMode';
import { CATEGORY_LABELS } from '../atlas/wording';

const accentFor = (cat: string) =>
  cat === 'Freshwater' ? tone.freshwater : cat === 'Coastal' ? tone.coastal : cat === 'DeepSea' ? tone.deepsea : tone.all;

type Props = { id: number; onBack: () => void };

export const SpotDetailScene: React.FC<Props> = ({ id, onBack }) => {
  const insets = useSafeAreaInsets();
  const { isSaved, toggle } = useHarbor();
  const spot = useMemo(() => SPOTS.find((s) => s.id === id), [id]);

  const slide = useRef(new Animated.Value(40)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const savedPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 6 }),
      Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }),
    ]).start();
  }, [slide, fade]);

  if (!spot) return null;

  const accent = accentFor(spot.category);
  const saved = isSaved(spot.id);

  const onSave = () => {
    toggle(spot.id);
    savedPulse.setValue(0);
    Animated.sequence([
      Animated.timing(savedPulse, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(savedPulse, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
  };

  const onShare = () => {
    Share.share({
      message: `${spot.title} — ${spot.state}\nCoordinates: ${spot.coordinates}\n\n${spot.content.slice(0, 220)}…`,
    });
  };

  const openInMaps = () => {
    const [lat, lng] = spot.coordinates.split(',').map((p) => p.trim());
    const label = encodeURIComponent(spot.title);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${label}&ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  };

  const subtitle = SHORT_HINTS[spot.title] ?? 'A prime outdoor water destination in America.';
  const pulseScale = savedPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <Backdrop>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
        >
          <ImageBackground source={spot.image} style={styles.hero}>
            <LinearGradient
              colors={['rgba(5,10,26,0.35)', 'rgba(5,10,26,0.92)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View style={[styles.heroTop, { paddingTop: insets.top + 6 }]}>
              <IconButton onPress={onBack} variant="solid">
                <ArrowLeft size={18} color="#fff" />
              </IconButton>
              <BadgePill label={CATEGORY_LABELS[spot.category] ?? spot.category} color={accent} />
            </View>

            <View style={styles.heroFoot}>
              <Text style={[styles.heroEyebrow, { color: accent }]}>{spot.state.toUpperCase()}</Text>
              <Text style={styles.heroTitle}>{spot.title}</Text>
            </View>
          </ImageBackground>

          <View style={styles.body}>
            <View style={styles.coordCard}>
              <View style={styles.coordIcon}>
                <MapPin size={16} color={palette.azure} />
              </View>
              <View>
                <Text style={styles.coordLabel}>GPS Coordinates</Text>
                <Text style={styles.coordValue}>{spot.coordinates}</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.aboutCard}>
              <Text style={styles.aboutLabel}>ABOUT THIS LOCATION</Text>
              <Text style={styles.aboutText}>{spot.content}</Text>
              {spot.species ? (
                <View style={styles.speciesRow}>
                  <Text style={styles.speciesLabel}>Common species</Text>
                  <Text style={styles.speciesValue}>{spot.species}</Text>
                </View>
              ) : null}
              <View style={styles.responsibleRow}>
                <Text style={styles.responsibleText}>
                  Please check local regulations, respect protected areas, and prepare safely for every outing.
                </Text>
              </View>
            </View>

            <Animated.View style={[styles.actionRow, { transform: [{ scale: pulseScale }] }]}>
              <ActionTile
                label={saved ? 'Saved' : 'Save'}
                Icon={Bookmark}
                onPress={onSave}
                variant={saved ? 'danger' : 'secondary'}
                active={saved}
              />
              <ActionTile label="Share" Icon={Share2} onPress={onShare} variant="secondary" />
              <ActionTile label="Open Map" Icon={MapIcon} onPress={openInMaps} variant="primary" />
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  hero: { height: 280 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  heroFoot: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
  },
  heroEyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  body: { paddingHorizontal: 20, marginTop: -12 },
  coordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(20,36,78,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.18)',
    gap: 12,
  },
  coordIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(58,123,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordLabel: { color: palette.faint, fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
  coordValue: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },
  subtitle: { color: palette.mist, fontSize: 13, marginTop: 14, lineHeight: 20 },
  aboutCard: {
    marginTop: 16,
    backgroundColor: 'rgba(15,28,62,0.55)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.12)',
    padding: 16,
  },
  aboutLabel: { color: palette.mist, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
  aboutText: { color: 'rgba(255,255,255,0.82)', fontSize: 13.5, lineHeight: 21 },
  speciesRow: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(120,170,255,0.12)' },
  speciesLabel: { color: palette.faint, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  speciesValue: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 4 },
  responsibleRow: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(120,170,255,0.12)' },
  responsibleText: { color: palette.faint, fontSize: 11.5, lineHeight: 17 },
  actionRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
});
