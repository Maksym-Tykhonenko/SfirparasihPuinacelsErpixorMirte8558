import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../channels/Button';
import { markIntroSeen } from '../reservoir/store';

const { width: W, height: H } = Dimensions.get('window');
const IS_SHORT = H < 720;
const STACK_GAP = IS_SHORT ? 22 : 32;
const SKIP_GAP = IS_SHORT ? 18 : 24;

type Slide = {
  key: string;
  bg: any;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    key: 's1',
    bg: require('../../arkimtagarmais/salpakhsribrognasd/fohlorbinyh1.png'),
    eyebrow: 'YOUR AMERICAN WATER GUIDE',
    title: 'American Water Guide',
    subtitle:
      'Discover prime outdoor locations across America. We collect the best lakes, rivers, coastlines, and offshore waters in one place.',
  },
  {
    key: 's2',
    bg: require('../../arkimtagarmais/salpakhsribrognasd/fohlorbinyh2.png'),
    eyebrow: 'RIVERS, LAKES & STREAMS',
    title: 'Freshwater Routes',
    subtitle:
      "America's inland waters are unmatched. Crystal mountain streams, vast Great Lakes and remote wilderness — explore the most rewarding routes.",
  },
  {
    key: 's3',
    bg: require('../../arkimtagarmais/salpakhsribrognasd/fohlorbinyh3.png'),
    eyebrow: 'WHERE LAND MEETS SEA',
    title: 'Coastal Places',
    subtitle:
      'From the legendary Florida Keys to the rugged Outer Banks — discover beaches, piers, and bays that define America’s coastline.',
  },
  {
    key: 's4',
    bg: require('../../arkimtagarmais/salpakhsribrognasd/fohlorbinyh4.png'),
    eyebrow: 'THE BLUE WATER FRONTIER',
    title: 'Offshore Adventures',
    subtitle:
      'Open ocean is where legends are made. Explore where to head out and how anglers find the most exciting offshore waters.',
  },
  {
    key: 's5',
    bg: require('../../arkimtagarmais/salpakhsribrognasd/fohlorbinyh5.png'),
    eyebrow: 'EXPLORE · DISCOVER · CAST',
    title: 'Your Journey Starts Now',
    subtitle:
      'Over 20 prime locations, in-depth articles, a species ID challenge, and fascinating facts — everything you need, right in your pocket.',
  },
];

const MAN_IMAGES = [
  require('../../arkimtagarmais/manImages/man1.png'),
  require('../../arkimtagarmais/manImages/man2.png'),
  require('../../arkimtagarmais/manImages/man3.png'),
  require('../../arkimtagarmais/manImages/man4.png'),
  require('../../arkimtagarmais/manImages/man5.png'),
];

type Props = { onDone: () => void };

const Dot: React.FC<{ x: Animated.Value; i: number }> = ({ x, i }) => {
  const w = x.interpolate({
    inputRange: [(i - 1) * W, i * W, (i + 1) * W],
    outputRange: [8, 22, 8],
    extrapolate: 'clamp',
  });
  const op = x.interpolate({
    inputRange: [(i - 1) * W, i * W, (i + 1) * W],
    outputRange: [0.35, 1, 0.35],
    extrapolate: 'clamp',
  });
  return <Animated.View style={[styles.dot, { width: w, opacity: op }]} />;
};

export const IntroScene: React.FC<Props> = ({ onDone }) => {
  const insets = useSafeAreaInsets();
  const ref = useRef<FlatList<Slide>>(null);
  const [, setIndex] = useState(0);
  const indexRef = useRef(0);
  const x = useRef(new Animated.Value(0)).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const ox = e.nativeEvent.contentOffset.x;
    x.setValue(ox);
    const i = Math.round(ox / W);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  const finish = async () => {
    await markIntroSeen();
    onDone();
  };

  const next = (currentIndex: number) => {
    if (currentIndex === SLIDES.length - 1) {
      finish();
    } else {
      ref.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const renderItem: ListRenderItem<Slide> = ({ item, index: i }) => {
    const isLast = i === SLIDES.length - 1;
    const manImage = MAN_IMAGES[i] ?? MAN_IMAGES[MAN_IMAGES.length - 1];

    return (
      <View style={styles.slide}>
        <ImageBackground source={item.bg} style={styles.bg} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(5,10,26,0)', 'rgba(5,10,26,0.6)', 'rgba(5,10,26,0.97)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <Image
          source={manImage}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: H * 0.25,
            width: W * 0.7,
            height: W * 0.7,
            resizeMode: 'contain',
          }}
        /> 
        <View
          style={[
            styles.bottomBlock,
            { paddingBottom: Math.max(insets.bottom + 16, 28) },
          ]}
        >
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.subtitle}</Text>
          </View>

          <View style={[styles.controlsRow, { marginTop: STACK_GAP }]}>
            <View style={styles.dotsRow}>
              {SLIDES.map((_, di) => (
                <Dot key={di} x={x} i={di} />
              ))}
            </View>
            <View style={styles.ctaHolder}>
              <Button
                label={isLast ? "Let's Cast!" : 'Next'}
                variant={isLast ? 'danger' : 'primary'}
                size="md"
                iconRight={<ChevronRight size={18} color="#fff" />}
                onPress={() => next(i)}
                fullWidth
              />
            </View>
          </View>

          <View style={[styles.skipRow, { marginTop: SKIP_GAP }]}>
            {!isLast ? (
              <Pressable hitSlop={12} onPress={finish}>
                <Text style={styles.skip}>Skip introduction</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={ref}
        data={SLIDES}
        keyExtractor={(it) => it.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050A1A' },

  slide: {
    width: W,
    height: H,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: W,
    height: H,
  },

  bottomBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
  },
  copy: {},
  eyebrow: {
    color: '#FF4B36',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  sub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    marginTop: 14,
    lineHeight: 20,
    maxWidth: 360,
  },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  dot: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#FFD024',
  },
  ctaHolder: {
    width: 140,
  },

  skipRow: {
    alignItems: 'center',
    minHeight: 18,
  },
  skip: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
  },
});
