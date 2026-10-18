import AsyncStorage from '@react-native-async-storage/async-storage';

// Per-user list of reviewer uids this user has blocked (App Store 1.2).
// Kept on-device rather than on the users doc, which every signed-in user
// can read -- who-blocked-whom shouldn't be visible to others.
// The uid array keeps its original format; names live in a separate map so
// the Profile screen can list blocked users (older entries have no name).
const idsKey = (uid) => `blockedReviewers:${uid}`;
const namesKey = (uid) => `blockedReviewerNames:${uid}`;

async function readJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function getBlockedReviewerIds(uid) {
  return readJson(idsKey(uid), []);
}

// [{ id, name }] -- name is null for entries blocked before names were stored.
export async function getBlockedReviewers(uid) {
  const [ids, names] = await Promise.all([readJson(idsKey(uid), []), readJson(namesKey(uid), {})]);
  return ids.map((id) => ({ id, name: names[id] || null }));
}

export async function blockReviewer(uid, reviewerId, reviewerName) {
  const [ids, names] = await Promise.all([readJson(idsKey(uid), []), readJson(namesKey(uid), {})]);
  const next = [...new Set([...ids, reviewerId])];
  if (reviewerName) names[reviewerId] = reviewerName;
  await AsyncStorage.multiSet([
    [idsKey(uid), JSON.stringify(next)],
    [namesKey(uid), JSON.stringify(names)],
  ]);
  return next;
}

export async function unblockReviewer(uid, reviewerId) {
  const [ids, names] = await Promise.all([readJson(idsKey(uid), []), readJson(namesKey(uid), {})]);
  const next = ids.filter((id) => id !== reviewerId);
  delete names[reviewerId];
  await AsyncStorage.multiSet([
    [idsKey(uid), JSON.stringify(next)],
    [namesKey(uid), JSON.stringify(names)],
  ]);
  return next;
}
