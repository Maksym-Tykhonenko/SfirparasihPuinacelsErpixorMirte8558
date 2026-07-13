import spotsRaw from '../../sarfkismarhdat/erpoxolactins';
import factsRaw from '../../sarfkismarhdat/fapriktes';
import articlesRaw from '../../sarfkismarhdat/globrdea';
import { SpotRecord } from '../channels/SpotCard';
import { FactGroupKey } from './wording';

const SPECIES_HINTS: Record<string, string> = {
  'Lake Okeechobee': 'Largemouth Bass · Crappie',
  'Lake Michigan': 'Salmon · Lake Trout',
  'Kenai River': 'Chinook Salmon · Rainbow Trout',
  'Lake Fork': 'Largemouth Bass · Crappie',
  'Columbia River': 'Salmon · Steelhead',
  'Lake Tahoe': 'Lake Trout · Rainbow Trout',
  'Beaver Lake': 'Striped Bass · Crappie',
  'Florida Keys': 'Tarpon · Bonefish · Permit',
  'Outer Banks': 'Striped Bass · Red Drum',
  'Santa Monica Pier': 'Halibut · Mackerel · Perch',
  'Gulf Shores': 'Red Drum · Speckled Trout',
  'Monterey Bay': 'Salmon · Lingcod · Halibut',
  'Galveston Bay': 'Speckled Trout · Red Drum',
  'Virginia Beach Fishing Pier': 'Striped Bass · Flounder',
  'Kona Coast': 'Blue Marlin · Yellowfin Tuna',
  Venice: 'Yellowfin Tuna · Swordfish',
  'San Diego Offshore Waters': 'Tuna · Yellowtail · Marlin',
  Destin: 'Snapper · Grouper · Tuna',
  'Cape Hatteras': 'Marlin · Sailfish · Mahi',
  'Orange Beach': 'Red Snapper · Amberjack',
  Montauk: 'Striped Bass · Tuna',
};

const SHORT_HINT: Record<string, string> = {
  'Lake Tahoe': 'Crystal-clear alpine lake straddling two states',
  'Lake Okeechobee': "Florida's vast inland lake and bass capital",
  'Lake Michigan': 'One of the legendary Great Lakes',
  'Kenai River': 'Turquoise Alaskan river of giant salmon',
  'Lake Fork': 'Texas trophy reservoir of submerged timber',
  'Columbia River': 'Mighty river through cliffs and canyons',
  'Beaver Lake': 'Tranquil Ozark mountain reservoir',
  'Florida Keys': 'Tropical island chain at the southern tip',
  'Outer Banks': 'Long chain of windswept barrier islands',
  'Santa Monica Pier': 'Iconic Pacific Coast city pier',
  'Gulf Shores': 'Warm sandy beaches along the Gulf Coast',
  'Monterey Bay': 'Scenic Pacific bay with dramatic cliffs',
  'Galveston Bay': 'Sprawling Texas estuary and marshlands',
  'Virginia Beach Fishing Pier': 'Atlantic pier reaching far into the surf',
  'Kona Coast': 'Volcanic Hawaiian shoreline with deep waters',
  Venice: 'Mississippi Delta outpost on the Gulf',
  'San Diego Offshore Waters': 'Open Pacific waters off Southern California',
  Destin: "Emerald-water village on Florida's panhandle",
  'Cape Hatteras': 'Where the Gulf Stream meets the Atlantic',
  'Orange Beach': 'White-sand Gulf town with reef structures',
  Montauk: 'Eastern tip of Long Island, open Atlantic',
};

export const SPOTS: SpotRecord[] = (spotsRaw as any[]).map((s) => ({
  ...s,
  species: SPECIES_HINTS[s.title] ?? '',
}));

export const SHORT_HINTS = SHORT_HINT;

export type FactRecord = {
  id: number;
  title: string;
  content: string;
  group: FactGroupKey;
};

const FACT_GROUP_MAP: Record<number, FactGroupKey> = {
  1: 'Species',
  2: 'Species',
  3: 'Species',
  4: 'Species',
  5: 'Species',
  6: 'Species',
  7: 'Cast',
  8: 'Cast',
  9: 'Cast',
  10: 'Cast',
  11: 'Cast',
  12: 'Cast',
  13: 'Waters',
  14: 'Waters',
  15: 'Waters',
  16: 'Waters',
  17: 'Waters',
  18: 'Waters',
};

export const FACTS: FactRecord[] = (factsRaw as any[]).map((f) => ({
  id: f.id,
  title: f.title,
  content: f.content,
  group: FACT_GROUP_MAP[f.id] ?? 'Species',
}));

export type ArticleRecord = {
  id: number;
  title: string;
  content: string;
  category: 'Freshwater' | 'Coastal' | 'DeepSea' | 'Cast';
  readMins: number;
  featured?: boolean;
};

const ARTICLE_META: Record<number, { category: ArticleRecord['category']; readMins: number; featured?: boolean }> = {
  1: { category: 'Freshwater', readMins: 9, featured: true },
  2: { category: 'Freshwater', readMins: 8 },
  3: { category: 'Coastal', readMins: 8 },
  4: { category: 'DeepSea', readMins: 7 },
  5: { category: 'Cast', readMins: 9 },
  6: { category: 'Cast', readMins: 6 },
  7: { category: 'Cast', readMins: 8 },
};

export const ARTICLES: ArticleRecord[] = (articlesRaw as any[]).map((a) => ({
  id: a.id,
  title: a.title,
  content: a.content,
  ...ARTICLE_META[a.id],
}));

export type QuizQuestion = {
  id: number;
  image: any;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    image: require('../../arkimtagarmais/LakeFork.png'),
    prompt: 'Which species is most associated with this lake?',
    options: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'White Bass'],
    correctIndex: 0,
  },
  {
    id: 2,
    image: require('../../arkimtagarmais/KenaiRiver.png'),
    prompt: 'Which species is famous for this turquoise Alaskan river?',
    options: ['Yellow Perch', 'Walleye', 'Chinook Salmon', 'Brook Trout'],
    correctIndex: 2,
  },
  {
    id: 3,
    image: require('../../arkimtagarmais/LakeMichigan.png'),
    prompt: 'Which freshwater species is commonly caught here?',
    options: ['Bonefish', 'Smallmouth Bass', 'Atlantic Mackerel', 'Wahoo'],
    correctIndex: 1,
  },
  {
    id: 4,
    image: require('../../arkimtagarmais/KonaCoast.png'),
    prompt: 'Which offshore species is iconic to these waters?',
    options: ['Largemouth Bass', 'Yellowtail Snapper', 'Atlantic Mackerel', 'Blue Marlin'],
    correctIndex: 3,
  },
  {
    id: 5,
    image: require('../../arkimtagarmais/OuterBanks.png'),
    prompt: 'Which surf species do anglers target here in fall?',
    options: ['Rainbow Trout', 'Striped Bass', 'Brook Trout', 'Kokanee'],
    correctIndex: 1,
  },
];
