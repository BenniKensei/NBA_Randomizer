import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8wH4eZ-N77XAsohlHtGSeC1Gblb_F8YE",
  authDomain: "nba-randomizer.firebaseapp.com",
  databaseURL: "https://nba-randomizer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nba-randomizer",
  storageBucket: "nba-randomizer.firebasestorage.app",
  messagingSenderId: "705478088936",
  appId: "1:705478088936:web:682c0e6d7c7c65af53115d",
  measurementId: "G-HTQTH2R0CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
