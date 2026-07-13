import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, ChevronRight, Waves, Anchor, Fish, BookOpen } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { PageHead } from '../channels/PageHead';
import { navBottomPadding } from '../channels/HelmBar';
import { Tappable } from '../channels/Tappable';
import { palette, tone } from '../atlas/palette';
import { ARTICLES, ArticleRecord } from '../atlas/data';
import { useHelm } from '../modes/HelmMode';

const accentFor = (cat: ArticleRecord['category']) =>
  cat === 'Freshwater'
    ? tone.freshwater
    : cat === 'Coastal'
    ? tone.coastal
    : cat === 'DeepSea'
    ? tone.deepsea
    : '#FFD024';

const iconFor = (cat: ArticleRecord['category']) =>
  cat === 'Freshwater' ? Waves : cat === 'Coastal' ? Anchor : cat === 'DeepSea' ? Fish : BookOpen;

const FeaturedArticle: React.FC<{ item: ArticleRecord; onPress: () => void }> = ({ item, onPress }) => {
  const o = useRef(new Animated.Value(0)).current;
  const t = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.spring(t, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [o, t]);
  const Icon = iconFor(item.category);
  return (
    <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
      <Tappable onPress={onPress} style={styles.featWrap}>
        <View style={styles.feat}>
          <LinearGradient
            colors={['rgba(58,123,255,0.22)', 'rgba(124,92,255,0.18)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={[styles.featBadge]}>
            <Text style={styles.featBadgeText}>★ FEATURED</Text>
          </View>
          <View style={styles.featTag}>
            <Icon size={12} color={accentFor(item.category)} />
            <Text style={[styles.featTagText, { color: accentFor(item.category) }]}>
              {item.category === 'Cast' ? 'Guides' : item.category === 'DeepSea' ? 'Deep Sea' : item.category}
            </Text>
          </View>
          <Text style={styles.featTitle}>{item.title}</Text>
          <Text style={styles.featLede} numberOfLines={4}>
            {item.content}
          </Text>
          <View style={styles.featFoot}>
            <View style={styles.metaRow}>
              <Clock size={11} color={palette.mist} />
              <Text style={styles.metaText}>{item.readMins} min read</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>May 12, 2026</Text>
            </View>
            <View style={styles.chev}>
              <ChevronRight size={16} color="#fff" />
            </View>
          </View>
        </View>
      </Tappable>
    </Animated.View>
  );
};

const Row: React.FC<{ item: ArticleRecord; onPress: () => void; index: number }> = ({ item, onPress, index }) => {
  const o = useRef(new Animated.Value(0)).current;
  const t = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 360, delay: index * 60, useNativeDriver: true }),
      Animated.spring(t, { toValue: 0, delay: index * 60, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [index, o, t]);
  const Icon = iconFor(item.category);
  return (
    <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
      <Tappable onPress={onPress} style={styles.rowWrap}>
        <View style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: accentFor(item.category) + '22' }]}>
            <Icon size={18} color={accentFor(item.category)} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.tagRow}>
              <Text style={[styles.smallTag, { color: accentFor(item.category) }]}>
                {item.category === 'Cast' ? 'Guides' : item.category === 'DeepSea' ? 'Deep Sea' : item.category}
              </Text>
              <Text style={styles.smallMeta}>{item.readMins} min read</Text>
            </View>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowLede} numberOfLines={2}>
              {item.content}
            </Text>
            <View style={styles.rowFoot}>
              <Text style={styles.smallMeta}>April 28, 2026</Text>
              <View style={styles.readBtn}>
                <Text style={styles.readBtnText}>Read</Text>
                <ChevronRight size={12} color="#3A7BFF" />
              </View>
            </View>
          </View>
        </View>
      </Tappable>
    </Animated.View>
  );
};

export const ArticlesScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { openArticle } = useHelm();

  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.id !== featured?.id);

  return (
    <Backdrop>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PageHead eyebrow="Insights" title="Outdoor Articles" subtitle="Expert guides from the water" />
      </View>

      <FlatList
        data={rest}
        keyExtractor={(it) => String(it.id)}
        ListHeaderComponent={
          featured ? (
            <View>
              <FeaturedArticle item={featured} onPress={() => openArticle(featured.id)} />
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>More Articles</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => <Row item={item} index={index} onPress={() => openArticle(item.id)} />}
        contentContainerStyle={{
          paddingTop: 6,
          paddingBottom: navBottomPadding(insets.bottom),
        }}
        showsVerticalScrollIndicator={false}
      />
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  top: { paddingBottom: 4 },
  featWrap: { marginHorizontal: 20, marginBottom: 14, borderRadius: 18, overflow: 'hidden' },
  feat: {
    padding: 18,
    backgroundColor: 'rgba(20,36,78,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(120,170,255,0.18)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  featBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    backgroundColor: palette.coralBadge,
    marginBottom: 12,
  },
  featBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  featTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  featTagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  featTitle: { color: '#fff', fontSize: 19, fontWeight: '800', letterSpacing: -0.3, lineHeight: 25 },
  featLede: { color: 'rgba(255,255,255,0.75)', fontSize: 12.5, marginTop: 10, lineHeight: 19 },
  featFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: palette.mist, fontSize: 11, fontWeight: '600' },
  metaDot: { color: palette.faint, marginHorizontal: 4 },
  chev: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(58,123,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginVertical: 14, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(120,170,255,0.18)' },
  dividerText: { color: palette.faint, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },

  rowWrap: { marginHorizontal: 20, marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
  row: {
    flexDirection: 'row', padding: 14, gap: 12,
    backgroundColor: 'rgba(20,36,78,0.55)',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.12)', borderRadius: 16,
  },
  rowIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallTag: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  smallMeta: { color: palette.faint, fontSize: 10.5, fontWeight: '600' },
  rowTitle: { color: '#fff', fontSize: 14.5, fontWeight: '800', marginTop: 4, letterSpacing: -0.2 },
  rowLede: { color: palette.faint, fontSize: 12, marginTop: 6, lineHeight: 17 },
  rowFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  readBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readBtnText: { color: palette.azure, fontSize: 12, fontWeight: '800' },
});
