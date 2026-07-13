import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_HARBORS = '@water_atlas/saved_v1';
const KEY_INTRO = '@water_atlas/intro_v1';
const KEY_TROPHIES = '@water_atlas/quiz_v1';

export type TrophyRecord = {
  ts: number;
  score: number;
  total: number;
  avgTime: number;
};

export async function readHarbors(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_HARBORS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export async function writeHarbors(ids: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_HARBORS, JSON.stringify(ids));
  } catch {}
}

export async function readIntroSeen(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEY_INTRO);
    return raw === '1';
  } catch {
    return false;
  }
}

export async function markIntroSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_INTRO, '1');
  } catch {}
}

export async function readTrophies(): Promise<TrophyRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_TROPHIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function pushTrophy(rec: TrophyRecord): Promise<void> {
  try {
    const list = await readTrophies();
    const next = [rec, ...list].slice(0, 20);
    await AsyncStorage.setItem(KEY_TROPHIES, JSON.stringify(next));
  } catch {}
}
