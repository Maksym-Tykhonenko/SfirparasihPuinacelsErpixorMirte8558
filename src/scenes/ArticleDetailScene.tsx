import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Waves, Anchor, Fish, BookOpen, Clock } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { IconButton } from '../channels/IconButton';
import { Button } from '../channels/Button';
import { palette, tone } from '../atlas/palette';
import { ARTICLES, ArticleRecord } from '../atlas/data';

type Props = { id: number; onBack: () => void };

const accentFor = (cat: ArticleRecord['category']) =>
  cat === 'Freshwater' ? tone.freshwater : cat === 'Coastal' ? tone.coastal : cat === 'DeepSea' ? tone.deepsea : '#FFD024';

const iconFor = (cat: ArticleRecord['category']) =>
  cat === 'Freshwater' ? Waves : cat === 'Coastal' ? Anchor : cat === 'DeepSea' ? Fish : BookOpen;

const splitParagraphs = (text: string): { lead: string; body: string[] } => {
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text];
  const lead = sentences.slice(0, 2).join('').trim();
  const rest = sentences.slice(2).join('').trim();
  const parts = rest.split(/(?<=[.!?])\s+(?=[A-Z])/).filter((s) => s.length > 0);

  const chunks: string[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    chunks.push(parts.slice(i, i + 3).join(' '));
  }
  return { lead, body: chunks };
};

export const ArticleDetailScene: React.FC<Props> = ({ id, onBack }) => {
  const insets = useSafeAreaInsets();
  const article = useMemo(() => ARTICLES.find((a) => a.id === id), [id]);
  const fade = useRef(new Animated.Value(0)).current;
  const tY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.spring(tY, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [fade, tY]);

  if (!article) return null;

  const Icon = iconFor(article.category);
  const accent = accentFor(article.category);
  const { lead, body } = splitParagraphs(article.content);

  const onShare = () =>
    Share.share({
      message: `${article.title}\n\n${lead}\n\nFrom Splash Places - Explore Time`,
    });

  return (
    <Backdrop>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade, transform: [{ translateY: tY }] }]}>
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <IconButton onPress={onBack} variant="glass">
            <ArrowLeft size={18} color="#fff" />
          </IconButton>
          <Text style={styles.topTitle}>Article</Text>
          <IconButton onPress={onShare} variant="glass">
            <Share2 size={16} color="#fff" />
          </IconButton>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tagRow}>
            <View style={[styles.tagPill, { backgroundColor: accent + '22' }]}>
              <Icon size={12} color={accent} />
              <Text style={[styles.tagText, { color: accent }]}>
                {article.category === 'Cast' ? 'Guides' : article.category === 'DeepSea' ? 'Deep Sea' : article.category}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Clock size={11} color={palette.mist} />
              <Text style={styles.metaText}>{article.readMins} min read</Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.authorRow}>
            <View style={styles.authorDot} />
            <Text style={styles.authorText}>Editor’s desk · May 12, 2026</Text>
          </View>

          <View style={[styles.leadCard, { borderColor: accent + '55' }]}>
            <Text style={styles.leadText}>{lead}</Text>
          </View>

          <View style={styles.bodyContent}>
            {body.map((p, i) => (
              <Text key={i} style={styles.para}>
                {p}
              </Text>
            ))}
            <Text style={styles.responsibleText}>
              Always check local rules, follow regulations, and respect protected areas when planning your outing.
            </Text>
          </View>

          <Button
            label="Share This Article"
            variant="primary"
            size="lg"
            iconLeft={<Share2 size={16} color="#fff" />}
            onPress={onShare}
            fullWidth
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </Animated.View>
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  topTitle: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 0.4 },

  tagRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  tagPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: palette.mist, fontSize: 11, fontWeight: '600' },

  title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.6, lineHeight: 32, marginTop: 14 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  authorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.azure },
  authorText: { color: palette.mist, fontSize: 12, fontWeight: '600' },

  leadCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(20,36,78,0.4)',
  },
  leadText: { color: '#fff', fontSize: 14.5, fontStyle: 'italic', lineHeight: 21 },

  bodyContent: { marginTop: 18 },
  para: { color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 22, marginBottom: 14 },
  responsibleText: {
    color: palette.faint,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    fontStyle: 'italic',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(120,170,255,0.12)',
  },

});
