import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { HelmBar } from '../channels/HelmBar';
import { useHelm } from '../modes/HelmMode';
import { RoutesScene } from '../scenes/RoutesScene';
import { HarborsScene } from '../scenes/HarborsScene';
import { ChartScene } from '../scenes/ChartScene';
import { ArticlesScene } from '../scenes/ArticlesScene';
import { FactsScene } from '../scenes/FactsScene';
import { QuizScene } from '../scenes/QuizScene';
import { SpotDetailScene } from '../scenes/SpotDetailScene';
import { ArticleDetailScene } from '../scenes/ArticleDetailScene';

const TabContent: React.FC = () => {
  const { tab } = useHelm();
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [tab, v]);

  const opacity = v;
  const ty = v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <Animated.View key={tab} style={[StyleSheet.absoluteFill, { opacity, transform: [{ translateY: ty }] }]}>
      {tab === 'routes' && <RoutesScene />}
      {tab === 'harbors' && <HarborsScene />}
      {tab === 'chart' && <ChartScene />}
      {tab === 'articles' && <ArticlesScene />}
      {tab === 'facts' && <FactsScene />}
      {tab === 'quiz' && <QuizScene />}
    </Animated.View>
  );
};

export const MainStage: React.FC = () => {
  const { detail, closeDetail } = useHelm();
  return (
    <View style={styles.root}>
      <TabContent />
      <HelmBar />
      {detail && (
        <View style={styles.overlay}>
          {detail.kind === 'spot' && <SpotDetailScene id={detail.id} onBack={closeDetail} />}
          {detail.kind === 'article' && <ArticleDetailScene id={detail.id} onBack={closeDetail} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050A1A' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#050A1A' },
});
