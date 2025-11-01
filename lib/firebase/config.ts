import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only on client side)
function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side');
  }
  
  // Validate Firebase config
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
    throw new Error(
      'Firebase yapılandırması eksik! Lütfen .env.local dosyasını oluşturup Firebase config değerlerinizi ekleyin.\n' +
      'Firebase Console: https://console.firebase.google.com/\n' +
      'Project Settings > Your apps > Web app config bölümünden config değerlerinizi alabilirsiniz.'
    );
  }
  
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

// Lazy initialization - only when needed
export function getDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be used on the client side');
  }
  const app = getFirebaseApp();
  return getFirestore(app);
}

export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side');
  }
  const app = getFirebaseApp();
  return getAuth(app);
}

export function getStorageInstance(): FirebaseStorage {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Storage can only be used on the client side');
  }
  const app = getFirebaseApp();
  return getStorage(app);
}

// For backward compatibility
export const db = typeof window !== 'undefined' ? getDb() : undefined as any;
export const auth = typeof window !== 'undefined' ? getAuthInstance() : undefined as any;
export const storage = typeof window !== 'undefined' ? getStorageInstance() : undefined as any;

