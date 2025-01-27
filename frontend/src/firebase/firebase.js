// src/firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyApWCUZP4GkvSv2ntE7hsyA7B0w4Byto7M",
  authDomain: "bankingapplicationfireba-29135.firebaseapp.com",
  projectId: "bankingapplicationfireba-29135",
  storageBucket: "bankingapplicationfireba-29135.firebasestorage.app",
  messagingSenderId: "762456780195",
  appId: "1:762456780195:web:1f53973e1203f0078e7e16",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
