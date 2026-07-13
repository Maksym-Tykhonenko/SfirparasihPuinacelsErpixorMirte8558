export const CATEGORY_LABELS: Record<string, string> = {
  All: 'All Spots',
  Freshwater: 'Freshwater',
  Coastal: 'Coastal',
  DeepSea: 'Deep Sea',
};

export const CATEGORY_ORDER = ['All', 'Freshwater', 'Coastal', 'DeepSea'] as const;
export type CategoryKey = (typeof CATEGORY_ORDER)[number];

export const FACT_GROUPS = ['Species', 'Cast', 'Waters'] as const;
export type FactGroupKey = (typeof FACT_GROUPS)[number];

export const FACT_GROUP_LABEL: Record<FactGroupKey, string> = {
  Species: 'Species',
  Cast: 'Fishing',
  Waters: 'Waters',
};
