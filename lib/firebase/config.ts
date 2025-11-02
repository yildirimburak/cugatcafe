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
  
  // Validate Firebase config - check if any required field is missing
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0 || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
    const errorMessage = `Firebase yapılandırması eksik! Eksik alanlar: ${missingFields.join(', ')}\n` +
      `Lütfen Vercel'de Environment Variables ayarlayın:\n` +
      `- NEXT_PUBLIC_FIREBASE_API_KEY\n` +
      `- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n` +
      `- NEXT_PUBLIC_FIREBASE_PROJECT_ID\n` +
      `- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n` +
      `- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n` +
      `- NEXT_PUBLIC_FIREBASE_APP_ID\n\n` +
      `Firebase Console: https://console.firebase.google.com/`;
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  try {
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    return getApps()[0];
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

// Lazy initialization - only when needed
export function getDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be used on the client side');
  }

  try {
    const app = getFirebaseApp();
    return getFirestore(app);
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    throw new Error('Firebase bağlantısı kurulamadı. Lütfen environment variables\'ları kontrol edin.');
  }
}

export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side');
  }
  
  try {
    const app = getFirebaseApp();
    return getAuth(app);
  } catch (error) {
    console.error('Failed to get Auth instance:', error);
    throw new Error('Firebase bağlantısı kurulamadı. Lütfen environment variables\'ları kontrol edin.');
  }
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

