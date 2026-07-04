// Mock Firebase for local testing without valid API keys

export const firebase = {
  app: {},
  auth: {
    currentUser: {
      getIdToken: async () => 'mock-token',
    }
  },
  db: {},
  storage: {}
} as any;

export const firebaseAuth = firebase.auth;
export const firebaseDb = firebase.db;
export const firebaseStorage = firebase.storage;
