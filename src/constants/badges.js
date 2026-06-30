/**
 * Travel badges — earned based on number of unique countries explored (passport stamps).
 */
export const TRAVEL_BADGES = [
  {
    id: 'traveler',
    emoji: '🧭',
    title: 'Gezgin',
    description: '10 farklı ülkenin yemeğini tamamla',
    requiredCountries: 10,
    color: '#4CAF50',
    gradient: ['#43A047', '#66BB6A'],
  },
  {
    id: 'wanderer',
    emoji: '🌍',
    title: 'Seyyah',
    description: '20 farklı ülkenin yemeğini tamamla',
    requiredCountries: 20,
    color: '#2196F3',
    gradient: ['#1E88E5', '#42A5F5'],
  },
  {
    id: 'evliya',
    emoji: '🦋',
    title: 'Evliya Çelebi',
    description: '50 farklı ülkenin yemeğini tamamla',
    requiredCountries: 50,
    color: '#9C27B0',
    gradient: ['#8E24AA', '#AB47BC'],
  },
];

/**
 * Returns the list of earned travel badges for a given country count.
 */
export const getEarnedBadges = (countryCount) =>
  TRAVEL_BADGES.filter(b => countryCount >= b.requiredCountries);

/**
 * Returns the next unearned badge, or null if all earned.
 */
export const getNextBadge = (countryCount) =>
  TRAVEL_BADGES.find(b => countryCount < b.requiredCountries) || null;
