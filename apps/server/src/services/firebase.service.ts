import * as admin from 'firebase-admin';

// In-memory mock database
const mockDb = {
  favorites: [] as any[],
  passport: [] as any[],
};

export function initializeFirebase(): admin.app.App {
  return {} as admin.app.App;
}

export function getFirestore(): admin.firestore.Firestore {
  return {} as admin.firestore.Firestore;
}

export async function verifyIdToken(_token: string): Promise<admin.auth.DecodedIdToken> {
  return {
    uid: 'mock-user-123',
    email: 'tester@storytrail.ai',
    email_verified: true,
  } as admin.auth.DecodedIdToken;
}

export async function saveFavorite(
  userId: string,
  type: string,
  data: Record<string, unknown>
): Promise<string> {
  const id = `fav_${Date.now()}`;
  mockDb.favorites.push({ id, userId, type, ...data, savedAt: new Date() });
  return id;
}

export async function getFavorites(userId: string): Promise<admin.firestore.DocumentData[]> {
  return mockDb.favorites.filter((f) => f.userId === userId);
}

export async function deleteFavorite(_userId: string, favoriteId: string): Promise<void> {
  mockDb.favorites = mockDb.favorites.filter((f) => f.id !== favoriteId);
}

export async function savePassportEntry(
  userId: string,
  entry: Record<string, unknown>
): Promise<string> {
  const id = `pass_${Date.now()}`;
  mockDb.passport.push({ id, userId, ...entry, addedAt: new Date() });
  return id;
}

export async function getPassportEntries(userId: string): Promise<admin.firestore.DocumentData[]> {
  return mockDb.passport.filter((p) => p.userId === userId);
}
