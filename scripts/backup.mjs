import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && !key.startsWith('#')) env[key.trim()] = vals.join('=').trim();
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase projesi:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTIONS = ['businessInfo', 'menuItems', 'categories', 'reviews', 'languages'];

const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}`;
const backupDir = path.join('backups', `backup_${timestamp}`);
const firestoreDir = path.join(backupDir, 'firestore');
const storageDir = path.join(backupDir, 'storage');

fs.mkdirSync(firestoreDir, { recursive: true });
fs.mkdirSync(storageDir, { recursive: true });

// Helper to serialize Firestore data (handle Timestamps)
function serializeData(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return { _type: 'Timestamp', seconds: value.seconds, nanoseconds: value.nanoseconds };
    }
    return value;
  }));
}

// Backup Firestore
console.log('\n--- Firestore Yedekleme ---');
let totalDocs = 0;

for (const colName of COLLECTIONS) {
  try {
    const snapshot = await getDocs(collection(db, colName));
    const docs = {};
    snapshot.forEach(doc => {
      docs[doc.id] = serializeData(doc.data());
    });
    const count = Object.keys(docs).length;
    totalDocs += count;

    const filePath = path.join(firestoreDir, `${colName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
    console.log(`✓ ${colName}: ${count} döküman`);
  } catch (err) {
    console.error(`✗ ${colName}: ${err.message}`);
  }
}

// Download file helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Backup Storage
console.log('\n--- Storage Yedekleme ---');
let totalFiles = 0;

async function backupFolder(storageRef, localDir) {
  try {
    const result = await listAll(storageRef);

    for (const itemRef of result.items) {
      try {
        const url = await getDownloadURL(itemRef);
        const localPath = path.join(localDir, itemRef.name);
        await downloadFile(url, localPath);
        totalFiles++;
        console.log(`✓ ${itemRef.fullPath}`);
      } catch (err) {
        console.error(`✗ ${itemRef.fullPath}: ${err.message}`);
      }
    }

    for (const folderRef of result.prefixes) {
      const subDir = path.join(localDir, folderRef.name);
      fs.mkdirSync(subDir, { recursive: true });
      await backupFolder(folderRef, subDir);
    }
  } catch (err) {
    console.error(`Storage hata: ${err.message}`);
  }
}

const rootRef = ref(storage);
await backupFolder(rootRef, storageDir);

// Storage metadata
const storageIndex = [];
async function indexFolder(storageRef) {
  try {
    const result = await listAll(storageRef);
    for (const itemRef of result.items) {
      try {
        const meta = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        storageIndex.push({
          path: itemRef.fullPath,
          contentType: meta.contentType,
          size: meta.size,
          updated: meta.updated,
          downloadURL: url
        });
      } catch (e) {}
    }
    for (const folderRef of result.prefixes) {
      await indexFolder(folderRef);
    }
  } catch (e) {}
}
await indexFolder(rootRef);
fs.writeFileSync(path.join(storageDir, '_index.json'), JSON.stringify(storageIndex, null, 2), 'utf-8');

// Summary
const summary = {
  date: now.toISOString(),
  projectId: firebaseConfig.projectId,
  firestore: { collections: COLLECTIONS, totalDocuments: totalDocs },
  storage: { totalFiles, indexFile: '_index.json' }
};
fs.writeFileSync(path.join(backupDir, 'backup_summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

console.log('\n=============================');
console.log(`Yedekleme tamamlandı!`);
console.log(`Konum: ${backupDir}`);
console.log(`Firestore: ${totalDocs} döküman`);
console.log(`Storage: ${totalFiles} dosya`);
console.log('=============================');

process.exit(0);
