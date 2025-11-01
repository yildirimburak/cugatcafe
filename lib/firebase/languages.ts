import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { getDb } from './config';

export interface Language {
  id: string;
  code: string; // 'en', 'de', 'fr', etc.
  name: string; // 'English', 'Deutsch', etc.
  nativeName: string; // 'English', 'Deutsch', etc.
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LANGUAGES_COLLECTION = 'languages';

export const getLanguages = async (): Promise<Language[]> => {
  const db = getDb();
  const q = query(collection(db, LANGUAGES_COLLECTION), orderBy('code', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Language[];
};

export const getEnabledLanguages = async (): Promise<Language[]> => {
  const db = getDb();
  // where ve orderBy birlikte kullanmak için index gerekiyor, bu yüzden önce filtrele sonra client-side sırala
  const q = query(
    collection(db, LANGUAGES_COLLECTION), 
    where('enabled', '==', true)
  );
  const querySnapshot = await getDocs(q);
  
  const languages = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Language[];
  
  // Client-side'da koda göre sırala
  return languages.sort((a, b) => a.code.localeCompare(b.code));
};

export const addLanguage = async (data: Omit<Language, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, LANGUAGES_COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateLanguage = async (id: string, data: Partial<Omit<Language, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, LANGUAGES_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteLanguage = async (id: string): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, LANGUAGES_COLLECTION, id);
  await deleteDoc(docRef);
};

