import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD4Ow7qv5UqTphn-fzBEaBDppdclvsy6IM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ah--dhamu-news.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ah--dhamu-news',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ah--dhamu-news.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '750592713557',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:750592713557:web:0ee4794d5c45281de8c5dc',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SJFYYECELW',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
}
