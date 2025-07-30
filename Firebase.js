// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBHlyWUAVH0b9Nh88rg6i-OgP_AUczt240",
  authDomain: "medalert-3557a.firebaseapp.com",
  projectId: "medalert-3557a",
  storageBucket: "medalert-3557a.firebasestorage.app",
  messagingSenderId: "899645498850",
  appId: "1:899645498850:web:a10c2f82eaa830282e05bb",
  measurementId: "G-R09P1D51SB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
