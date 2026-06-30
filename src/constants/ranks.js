export const RANKS = [
  {
    id: 'novice',
    emoji: '🥚',
    title: { tr: 'Çaylak', en: 'Novice', fr: 'Débutant', it: 'Principiante' },
    minCount: 0,
    color: '#9E9E9E',
  },
  {
    id: 'starter',
    emoji: '🍳',
    title: { tr: 'Yeni Başlayan', en: 'Starter', fr: 'Démarreur', it: 'Principiante' },
    minCount: 1,
    color: '#8BC34A',
  },
  {
    id: 'assistant',
    emoji: '👨‍🍳',
    title: { tr: 'Yardımcı Chef', en: 'Assistant Chef', fr: 'Chef Assistant', it: 'Chef Assistente' },
    minCount: 5,
    color: '#FF9800',
  },
  {
    id: 'experienced',
    emoji: '🍽️',
    title: { tr: 'Deneyimli Chef', en: 'Experienced Chef', fr: 'Chef Expérimenté', it: 'Chef Esperto' },
    minCount: 15,
    color: '#2196F3',
  },
  {
    id: 'head',
    emoji: '⭐',
    title: { tr: 'Baş Chef', en: 'Head Chef', fr: 'Chef Principal', it: 'Chef Principale' },
    minCount: 30,
    color: '#9C27B0',
  },
  {
    id: 'master',
    emoji: '👑',
    title: { tr: 'Usta Chef', en: 'Master Chef', fr: 'Maître Chef', it: 'Chef Maestro' },
    minCount: 50,
    color: '#F44336',
  },
];

/**
 * Returns the current rank for a given completed recipe count.
 */
export const getRank = (completedCount, language = 'tr') => {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (completedCount >= r.minCount) rank = r;
  }
  return { ...rank, titleText: rank.title[language] || rank.title.tr };
};

/**
 * Returns the next rank, or null if already at max.
 */
export const getNextRank = (completedCount, language = 'tr') => {
  const next = RANKS.find(r => r.minCount > completedCount);
  if (!next) return null;
  return { ...next, titleText: next.title[language] || next.title.tr };
};
