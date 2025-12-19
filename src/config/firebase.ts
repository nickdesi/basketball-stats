import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration for SCBA Benevole project
const firebaseConfig = {
    apiKey: "AIzaSyCkef-S1g3mmR5bSkxnvsM6zs2spQFxnbs",
    authDomain: "scba-benevole.firebaseapp.com",
    projectId: "scba-benevole",
    storageBucket: "scba-benevole.firebasestorage.app",
    messagingSenderId: "472642810664",
    appId: "1:472642810664:web:c3c568fe9dcf393f38161d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence for Firestore
// This allows the app to work fully offline and sync when back online
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Firestore persistence not supported in this browser');
    }
});

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
