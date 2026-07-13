import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ImageBackground, Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Award, Check, Clock, HelpCircle, RotateCcw, Share2, Star, Trophy, X } from 'lucide-react-native';
import { Backdrop } from '../channels/Backdrop';
import { Tappable } from '../channels/Tappable';
import { Button } from '../channels/Button';
import { navBottomPadding } from '../channels/HelmBar';
import { palette } from '../atlas/palette';
import { QUIZ_QUESTIONS, QuizQuestion } from '../atlas/data';
import { pushTrophy } from '../reservoir/store';

const QUESTION_SECONDS = 15;

type Phase = 'intro' | 'play' | 'result';

type Trace = {
  qid: number;
  picked: number; // -1 if timed out
  correct: boolean;
  ms: number;
};

const IntroPanel: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1700, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const op = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  return (
    <View style={styles.introWrap}>
      <Animated.View style={[styles.introBadge, { transform: [{ scale }], opacity: op }]}>
        <LinearGradient
          colors={['#3A7BFF', '#1F4FE0']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.introBadgeFront}>
        <LinearGradient colors={['rgba(58,123,255,0.45)', 'rgba(31,79,224,0.7)']} style={StyleSheet.absoluteFill} />
        <HelpCircle size={42} color="#fff" />
      </View>
      <Text style={styles.introEyebrow}>SPECIES IDENTIFICATION</Text>
      <Text style={styles.introTitle}>Species ID</Text>
      <Text style={[styles.introTitle, { color: '#FFD024' }]}>Challenge</Text>
      <Text style={styles.introSub}>
        Test your knowledge of American waters. Identify the species in each photo and beat the clock.
      </Text>
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Star size={20} color={palette.azure} />
          <Text style={styles.metricValue}>5</Text>
          <Text style={styles.metricLabel}>Questions</Text>
        </View>
        <View style={styles.metricCard}>
          <Clock size={20} color={palette.ember} />
          <Text style={styles.metricValue}>15s</Text>
          <Text style={styles.metricLabel}>Per Question</Text>
        </View>
        <View style={styles.metricCard}>
          <Trophy size={20} color={palette.beam} />
          <Text style={styles.metricValue}>5★</Text>
          <Text style={styles.metricLabel}>Max Score</Text>
        </View>
      </View>
      <Button
        label="Start Challenge"
        variant="danger"
        size="lg"
        onPress={onStart}
        fullWidth
        style={{ marginTop: 26 }}
      />
    </View>
  );
};

const PlayPanel: React.FC<{
  index: number;
  question: QuizQuestion;
  onAnswer: (picked: number, ms: number, timedOut: boolean) => void;
  onNext: () => void;
  showResult: boolean;
  picked: number | null;
}> = ({ index, question, onAnswer, onNext, showResult, picked }) => {
  const startedAt = useRef(Date.now());
  const tick = useRef(new Animated.Value(0)).current;
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const remRef = useRef(QUESTION_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    setRemaining(QUESTION_SECONDS);
    remRef.current = QUESTION_SECONDS;
    tick.setValue(0);
    Animated.timing(tick, {
      toValue: 1,
      duration: QUESTION_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      remRef.current = remRef.current - 1;
      setRemaining(remRef.current);
      if (remRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onAnswer(-1, QUESTION_SECONDS * 1000, true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      tick.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (showResult && timerRef.current) {
      clearInterval(timerRef.current);
      tick.stopAnimation();
    }
  }, [showResult, tick]);

  const onTapAnswer = (i: number) => {
    if (showResult) return;
    const ms = Date.now() - startedAt.current;
    onAnswer(i, ms, false);
  };

  const barWidth = tick.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const barColor = remaining <= 5 ? palette.ember : palette.beam;

  return (
    <View style={styles.playWrap}>
      <View style={styles.playHead}>
        <Text style={styles.playCount}>Question {index + 1} of {QUIZ_QUESTIONS.length}</Text>
        <View style={styles.playTimer}>
          <Clock size={12} color={palette.mist} />
          <Text style={styles.playTimerText}>{remaining}s</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: barColor }]} />
      </View>

      <ImageBackground source={question.image} style={styles.qImage} imageStyle={styles.qImageImg}>
        <LinearGradient
          colors={['rgba(5,10,26,0.05)', 'rgba(5,10,26,0.85)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.qPromptBox}>
          <View style={styles.qDot} />
          <Text style={styles.qPromptText}>{question.prompt}</Text>
        </View>
      </ImageBackground>

      <View style={styles.optionsCol}>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let bg = 'rgba(20,36,78,0.55)';
          let border = 'rgba(120,170,255,0.18)';
          let textColor = '#fff';
          if (showResult) {
            if (i === question.correctIndex) {
              bg = 'rgba(31,180,80,0.18)';
              border = '#21C45A';
              textColor = '#A8F0B8';
            } else if (i === picked) {
              bg = 'rgba(255,75,54,0.18)';
              border = '#FF4B36';
              textColor = '#FFB1A0';
            }
          } else if (i === picked) {
            bg = 'rgba(58,123,255,0.18)';
            border = palette.azure;
          }
          return (
            <Tappable key={i} onPress={() => onTapAnswer(i)} style={[styles.opt, { backgroundColor: bg, borderColor: border }]} scaleTo={0.97}>
              <View style={styles.optInner}>
                <View style={[styles.optLetter, { borderColor: border }]}>
                  <Text style={[styles.optLetterText, { color: textColor }]}>{letter}</Text>
                </View>
                <Text style={[styles.optText, { color: textColor }]}>{opt}</Text>
                {showResult && i === question.correctIndex ? <Check size={16} color="#21C45A" /> : null}
                {showResult && i === picked && i !== question.correctIndex ? <X size={16} color="#FF4B36" /> : null}
              </View>
            </Tappable>
          );
        })}
      </View>

      {!showResult && picked == null ? (
        <Button label="Choose" variant="secondary" size="md" fullWidth style={{ marginTop: 12 }} />
      ) : !showResult ? (
        <Button
          label="Confirm"
          variant="primary"
          size="md"
          fullWidth
          style={{ marginTop: 12 }}
          onPress={() => picked != null && onAnswer(picked, Date.now() - startedAt.current, false)}
        />
      ) : (
        <Button
          label="Next question"
          variant="primary"
          size="md"
          fullWidth
          style={{ marginTop: 12 }}
          onPress={onNext}
        />
      )}
    </View>
  );
};

const titleForScore = (score: number) =>
  score >= 5 ? 'Master Caster' : score >= 4 ? 'Skilled Caster' : score >= 3 ? 'Solid Caster' : score >= 2 ? 'Novice Caster' : 'Fresh Caster';

const ResultPanel: React.FC<{
  traces: Trace[];
  onRetry: () => void;
  onBack: () => void;
}> = ({ traces, onRetry, onBack }) => {
  const correct = traces.filter((t) => t.correct).length;
  const wrong = traces.length - correct;
  const avg = traces.length ? Math.round(traces.reduce((a, t) => a + t.ms, 0) / traces.length / 1000) : 0;
  const acc = traces.length ? Math.round((correct / traces.length) * 100) : 0;
  const total = QUIZ_QUESTIONS.length;

  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }).start();
    pushTrophy({ ts: Date.now(), score: correct, total, avgTime: avg });
  }, [v, correct, total, avg]);

  const onShare = () =>
    Share.share({
      message: `I scored ${correct}/${total} on the Species ID Challenge in Splash Places - Explore Time! Accuracy ${acc}%, avg ${avg}s/question.`,
    });

  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const op = v.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.resultWrap, { opacity: op, transform: [{ scale }] }]}>
      <Text style={styles.resultGrandTitle}>{titleForScore(correct)}</Text>
      <Text style={styles.resultSub}>Challenge Complete</Text>

      <View style={styles.scoreCard}>
        <LinearGradient colors={['rgba(58,123,255,0.25)', 'rgba(31,79,224,0.25)']} style={StyleSheet.absoluteFill} />
        <Text style={styles.scoreVal}>
          <Text style={{ color: correct >= 3 ? '#FFD024' : '#FF4B36' }}>{correct}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)' }}>/{total}</Text>
        </Text>
        <Text style={styles.scoreAcc}>{acc}% Accuracy</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.sumBox, { borderColor: 'rgba(31,180,80,0.3)' }]}>
          <Check size={16} color="#21C45A" />
          <Text style={styles.sumVal}>{correct}</Text>
          <Text style={styles.sumLabel}>Correct</Text>
        </View>
        <View style={[styles.sumBox, { borderColor: 'rgba(255,75,54,0.3)' }]}>
          <X size={16} color="#FF4B36" />
          <Text style={styles.sumVal}>{wrong}</Text>
          <Text style={styles.sumLabel}>Wrong</Text>
        </View>
        <View style={[styles.sumBox, { borderColor: 'rgba(255,208,36,0.3)' }]}>
          <Clock size={16} color={palette.beam} />
          <Text style={styles.sumVal}>{avg}s</Text>
          <Text style={styles.sumLabel}>Avg Time</Text>
        </View>
      </View>

      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownLabel}>QUESTION BREAKDOWN</Text>
        {traces.map((t, i) => {
          const q = QUIZ_QUESTIONS.find((x) => x.id === t.qid)!;
          const youAnswered = t.picked === -1 ? 'Out of time' : q.options[t.picked];
          return (
            <View key={t.qid} style={styles.breakRow}>
              <View style={[styles.breakDot, { backgroundColor: t.correct ? 'rgba(31,180,80,0.18)' : 'rgba(255,75,54,0.18)' }]}>
                {t.correct ? <Check size={11} color="#21C45A" /> : <X size={11} color="#FF4B36" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.breakTitle}>
                  Q{i + 1}: {q.options[q.correctIndex]}
                </Text>
                <Text style={styles.breakSub}>You answered: {youAnswered}</Text>
              </View>
              {t.correct ? <Award size={14} color={palette.beam} /> : null}
            </View>
          );
        })}
      </View>

      <Button
        label="Share Result"
        variant="primary"
        size="md"
        iconLeft={<Share2 size={16} color="#fff" />}
        onPress={onShare}
        fullWidth
        style={{ marginTop: 14 }}
      />
      <View style={styles.bottomDuo}>
        <Button
          label="Retry"
          variant="secondary"
          size="sm"
          iconLeft={<RotateCcw size={14} color="#fff" />}
          onPress={onRetry}
          style={{ flex: 1 }}
        />
        <Button label="Back" variant="ghost" size="sm" onPress={onBack} style={{ flex: 1 }} />
      </View>
    </Animated.View>
  );
};

export const QuizScene: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const start = () => {
    setQIndex(0);
    setTraces([]);
    setPicked(null);
    setShowResult(false);
    setPhase('play');
  };

  const onAnswer = (p: number, ms: number, timedOut: boolean) => {
    if (showResult) return;
    const q = QUIZ_QUESTIONS[qIndex];
    const correct = !timedOut && p === q.correctIndex;
    setPicked(timedOut ? -1 : p);
    setShowResult(true);
    setTraces((prev) => [...prev, { qid: q.id, picked: timedOut ? -1 : p, correct, ms }]);
  };

  const onNext = () => {
    setShowResult(false);
    setPicked(null);
    if (qIndex + 1 >= QUIZ_QUESTIONS.length) {
      setPhase('result');
    } else {
      setQIndex(qIndex + 1);
    }
  };

  return (
    <Backdrop>
      <View style={{ paddingTop: insets.top + 8, flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingBottom: navBottomPadding(insets.bottom),
          }}
        >
          {phase === 'intro' && <IntroPanel onStart={start} />}
          {phase === 'play' && (
            <PlayPanel
              index={qIndex}
              question={QUIZ_QUESTIONS[qIndex]}
              onAnswer={onAnswer}
              onNext={onNext}
              showResult={showResult}
              picked={picked}
            />
          )}
          {phase === 'result' && (
            <ResultPanel traces={traces} onRetry={start} onBack={() => setPhase('intro')} />
          )}
        </View>
      </View>
    </Backdrop>
  );
};

const styles = StyleSheet.create({
  introWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  introBadge: {
    position: 'absolute', top: 24, width: 130, height: 130, borderRadius: 30,
    overflow: 'hidden', alignSelf: 'center',
  },
  introBadgeFront: {
    width: 96, height: 96, borderRadius: 22, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.4)',
  },
  introEyebrow: { color: '#FF4B36', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginTop: 24 },
  introTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -0.6, lineHeight: 38 },
  introSub: { color: palette.mist, fontSize: 13, textAlign: 'center', marginTop: 12, lineHeight: 19, maxWidth: 300 },
  metricsRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  metricCard: {
    width: 88, paddingVertical: 14, alignItems: 'center', borderRadius: 14,
    backgroundColor: 'rgba(20,36,78,0.55)', borderWidth: 1, borderColor: 'rgba(120,170,255,0.18)',
  },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  metricLabel: { color: palette.faint, fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },
  playWrap: { flex: 1 },
  playHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playCount: { color: '#fff', fontSize: 13, fontWeight: '700' },
  playTimer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playTimerText: { color: palette.mist, fontSize: 12, fontWeight: '700' },
  progressBar: {
    height: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginTop: 6,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  qImage: { height: 180, borderRadius: 16, overflow: 'hidden', marginTop: 12, justifyContent: 'flex-end' },
  qImageImg: { borderRadius: 16 },
  qPromptBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  qDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFD024' },
  qPromptText: { color: '#fff', fontSize: 13.5, fontWeight: '700' },
  optionsCol: { marginTop: 12, gap: 8 },
  opt: { borderRadius: 12, borderWidth: 1 },
  optInner: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  optLetter: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  optLetterText: { fontSize: 12, fontWeight: '800' },
  optText: { flex: 1, fontSize: 13.5, fontWeight: '700' },
  resultWrap: { flex: 1, paddingTop: 4 },
  resultGrandTitle: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },
  resultSub: { color: palette.mist, fontSize: 12, textAlign: 'center', marginTop: 4 },
  scoreCard: {
    marginTop: 16, padding: 22, borderRadius: 18, overflow: 'hidden', alignItems: 'center',
    backgroundColor: 'rgba(20,36,78,0.45)',
  },
  scoreVal: { fontSize: 56, fontWeight: '900', letterSpacing: -2 },
  scoreAcc: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '600', marginTop: -4 },

  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  sumBox: {
    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
    backgroundColor: 'rgba(15,28,62,0.55)', borderWidth: 1,
  },
  sumVal: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  sumLabel: { color: palette.faint, fontSize: 10.5, marginTop: 2 },

  breakdownCard: {
    marginTop: 14, padding: 14, borderRadius: 16, backgroundColor: 'rgba(15,28,62,0.55)',
    borderWidth: 1, borderColor: 'rgba(120,170,255,0.12)',
  },
  breakdownLabel: { color: palette.mist, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  breakRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  breakDot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  breakTitle: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
  breakSub: { color: palette.faint, fontSize: 10.5, marginTop: 2 },

  bottomDuo: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
