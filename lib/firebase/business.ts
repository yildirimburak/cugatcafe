import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getDb } from './config';

export interface BusinessInfo {
  id: string;
  name: string;
  nameEn?: string;
  address: string;
  addressEn?: string;
  phone: string;
  email?: string;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  workingHours: {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  updatedAt: Date;
}

const BUSINESS_INFO_COLLECTION = 'businessInfo';
const BUSINESS_INFO_DOC_ID = 'main'; // Tek bir doküman olacak

export const getBusinessInfo = async (): Promise<BusinessInfo | null> => {
  const db = getDb();
  const docRef = doc(db, BUSINESS_INFO_COLLECTION, BUSINESS_INFO_DOC_ID);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as BusinessInfo;
};

export const updateBusinessInfo = async (info: Partial<Omit<BusinessInfo, 'id' | 'updatedAt'>>): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, BUSINESS_INFO_COLLECTION, BUSINESS_INFO_DOC_ID);
  
  await setDoc(
    docRef,
    {
      ...info,
      updatedAt: Timestamp.now(),
    },
    { merge: true } // Mevcut verileri koruyarak güncelle
  );
};

