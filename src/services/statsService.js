import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../config/firebase';

// AdminPanelScreen ve StatisticsScreen aynı iki sayıyı ayrı ayrı hesaplıyordu,
// her ikisi de tüm koleksiyonu (getDocs) çekip sadece .size okuyordu — N doküman
// okuma yerine sunucu tarafı aggregation count kullanılıyor (1 okuma).
// Bkz. maliyet denetimi 2026-07-09.
export async function getPlatformCounts() {
  const [usersCount, favoritesCount] = await Promise.all([
    getCountFromServer(collection(db, 'users')),
    getCountFromServer(collection(db, 'favorites')),
  ]);
  return {
    totalUsers: usersCount.data().count,
    totalFavorites: favoritesCount.data().count,
  };
}
