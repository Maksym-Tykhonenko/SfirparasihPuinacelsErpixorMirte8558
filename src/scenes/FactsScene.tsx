import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fish, Anchor, Waves, Share2, Sparkles } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { PageHead } from '../channels/PageHead';
import { navBottomPadding } from '../channels/HelmBar';
import { Tappable } from '../channels/Tappable';
import { IconButton } from '../channels/IconButton';
import { Button } from '../channels/Button';
import { palette } from '../atlas/palette';
import { FACTS, FactRecord } from '../atlas/data';
import { FACT_GROUPS, FactGroupKey, FACT_GROUP_LABEL } from '../atlas/wording';

const groupIcon = (g: FactGroupKey) => (g === 'Species' ? Fish : g === 'Cast' ? Anchor : Waves);
const groupAccent = (g: FactGroupKey) => (g === 'Species' ? '#3A7BFF' : g === 'Cast' ? '#FFD024' : '#19D4C8');

const FactCard: React.FC<{
  fact: FactRecord;
  index: number;
  highlighted: boolean;
  onShare: () => void;
}> = ({ fact, index, highlighted, onShare }) => {
  const o = useRef(new Animated.Value(0)).current;
  const t = useRef(new Animated.Value(14)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 380, delay: index * 50, useNativeDriver: true }),
      Animated.spring(t, { toValue: 0, delay: index * 50, useNativeDriver: true, speed: 14, bounciness: 6 }),
    ]).start();
  }, [index, o, t]);

  useEffect(() => {
    if (highlighted) {
      flash.setValue(0);
      Animated.sequence([
        Animated.timing(flash, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.delay(900),
        Animated.timing(flash, { toValue: 0, duration: 480, useNativeDriver: false }),
      ]).start();
    }
  }, [highlighted, flash]);

  const accent = groupAccent(fact.group);
  const Icon = groupIcon(fact.group);

  const borderColor = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(120,170,255,0.12)', accent],
  });
  const scaleX = flash.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] });

  return (
    <Animated.View style={{ opacity: o, transform: [{ translateY: t }] }}>
      <Animated.View style={[styles.card, { borderColor, transform: [{ scale: scaleX }] }]}>
        <LinearGradient
          colors={['rgba(58,123,255,0.14)', 'rgba(58,123,255,0)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.cardHead}>
          <View style={[styles.cardTag, { backgroundColor: accent + '22' }]}>
            <Icon size={11} color={accent} />
            <Text style={[styles.cardTagText, { color: accent }]}>{FACT_GROUP_LABEL[fact.group].toUpperCase()}</Text>
          </View>
          <IconButton onPress={onShare} variant="flat" size="sm">
            <Share2 size={13} color={palette.mist} />
          </IconButton>
        </View>
        <Text style={styles.cardTitle}>{fact.title}</Text>
        <Text style={styles.cardContent}>{fact.content}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const GroupChips: React.FC<{ active: FactGroupKey; onChange: (g: FactGroupKey) => void }> = ({ active, onChange }) => {
  return (
    <View style={styles.groupRow}>
      {FACT_GROUPS.map((g) => {
        const isActive = g === active;
        const Icon = groupIcon(g);
        const accent = groupAccent(g);
        return (
          <Tappable key={g} onPress={() => onChange(g)} style={styles.groupSlotWrap}>
            <View style={styles.groupSlot}>
              {isActive ? (
                <LinearGradient
                  colors={['rgba(58,123,255,0.35)', 'rgba(58,123,255,0.12)']}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,36,78,0.55)' }]} />
              )}
              <View style={[styles.groupRing, { borderColor: isActive ? accent : 'rgba(120,170,255,0.18)' }]}>
                <Icon size={20} color={isActive ? accent : palette.mist} />
              </View>
              <Text style={[styles.groupText, { color: isActive ? '#fff' : palette.mist }]}>
                {FACT_GROUP_LABEL[g]}
              </Text>
            </View>
          </Tappable>
        );
      })}
    </View>
  );
};

export const FactsScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [group, setGroup] = useState<FactGroupKey>('Species');
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const listRef = useRef<FlatList<FactRecord>>(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  const list = useMemo(() => FACTS.filter((f) => f.group === group), [group]);

  const onShareFact = (f: FactRecord) =>
    Share.share({ message: `${f.title}\n\n${f.content}\n\n— Splash Places - Explore Time` });

  const onRandom = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }),
    ]).start();

    const pick = FACTS[Math.floor(Math.random() * FACTS.length)];
    setGroup(pick.group);
    setHighlightId(pick.id);

    requestAnimationFrame(() => {
      const idx = FACTS.filter((f) => f.group === pick.group).findIndex((f) => f.id === pick.id);
      if (idx >= 0) {
        try {
          listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.2 });
        } catch {}
      }
    });

    setTimeout(() => setHighlightId(null), 2400);
  };

  return (
    <Backdrop>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PageHead eyebrow="Did You Know?" title="Outdoor Facts" subtitle="Fascinating facts about American waters" />
        <Animated.View style={[styles.randomWrap, { transform: [{ scale: btnScale }] }]}>
          <Button
            label="Random Fact"
            variant="primary"
            size="lg"
            iconLeft={<Sparkles size={16} color="#fff" />}
            onPress={onRandom}
            fullWidth
          />
        </Animated.View>
        <GroupChips active={group} onChange={setGroup} />
        <Text style={styles.count}>
          {list.length} {list.length === 1 ? 'fact' : 'facts'} about {FACT_GROUP_LABEL[group].toLowerCase()}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={list}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item, index }) => (
          <FactCard
            fact={item}
            index={index}
            highlighted={highlightId === item.id}
            onShare={() => onShareFact(item)}
          />
        )}
        onScrollToIndexFailed={() => {}}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: navBottomPadding(insets.bottom),
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  top: { paddingBottom: 4 },
  randomWrap: { marginHorizontal: 20, marginTop: 4 },
  groupRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 14 },
  groupSlotWrap: { flex: 1, borderRadius: 14 },
  groupSlot: {
    paddingVertical: 14, alignItems: 'center', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.12)',
  },
  groupRing: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
  },
  groupText: { marginTop: 6, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  count: { color: palette.faint, fontSize: 11, fontWeight: '600', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },

  card: {
    padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12,
    backgroundColor: 'rgba(15,28,62,0.55)',
    overflow: 'hidden',
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardTagText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 10, letterSpacing: -0.2 },
  cardContent: { color: 'rgba(255,255,255,0.78)', fontSize: 12.5, lineHeight: 19, marginTop: 6 },
});
