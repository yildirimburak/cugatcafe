import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp,
  limit
} from 'firebase/firestore';
import { getDb } from './config';

export interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number; // 1-5
  text: string; // Default text (original language)
  textTr?: string; // Turkish translation
  textEn?: string; // English translation
  textFr?: string; // French translation
  textDe?: string; // German translation
  textIt?: string; // Italian translation
  textEs?: string; // Spanish translation
  textPt?: string; // Portuguese translation
  textRu?: string; // Russian translation
  textJa?: string; // Japanese translation
  textZh?: string; // Chinese translation
  textAr?: string; // Arabic translation
  visible: boolean; // Görünür/gizli
  featured: boolean; // Öne çıkan yorum
  createdAt: Date;
  updatedAt: Date;
}

const REVIEWS_COLLECTION = 'reviews';

export const getReviews = async (visibleOnly: boolean = false): Promise<Review[]> => {
  const db = getDb();
  
  try {
    let q;
    if (visibleOnly) {
      // İlk olarak sadece where ile dene (index gerektirmez)
      q = query(
        collection(db, REVIEWS_COLLECTION), 
        where('visible', '==', true)
      );
    } else {
      // Tüm yorumları getir
      q = query(collection(db, REVIEWS_COLLECTION));
    }
    
    const querySnapshot = await getDocs(q);
    
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Review[];
    
    // Client-side sorting: öne çıkanlar önce, sonra tarih sırasına göre
    reviews.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });
    
    console.log('getReviews: Fetched', reviews.length, 'reviews');
    return reviews;
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getFeaturedReviews = async (limitCount: number = 6): Promise<Review[]> => {
  const db = getDb();
  
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION), 
      where('visible', '==', true),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Review[];
  } catch (error: any) {
    console.error('Error fetching featured reviews:', error);
    // Fallback: tüm görünür yorumları getir ve client-side filtrele
    const allReviews = await getReviews(true);
    return allReviews.filter(r => r.featured).slice(0, limitCount);
  }
};

export const getReview = async (id: string): Promise<Review | null> => {
  const db = getDb();
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as Review;
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
    ...review,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateReview = async (id: string, review: Partial<Omit<Review, 'id' | 'createdAt'>>): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  
  await updateDoc(docRef, {
    ...review,
    updatedAt: Timestamp.now(),
  });
};

export const deleteReview = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
};

