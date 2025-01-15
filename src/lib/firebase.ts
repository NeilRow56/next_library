import { getApps, initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASEAPIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASEAUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASEPROJECTID,
  storageBucket: 'next-library-e3ff4.firebasestorage.app',
  messagingSenderId: '651758149515',
  appId: '1:651758149515:web:2013b0e64d9378239e598e',
  measurementId: 'G-05R1SG8XMJ'
}

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

const storage = getStorage(app)
export const storageRef = (token: string) => ref(storage, token)
