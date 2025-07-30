// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBHlyWUAVH0b9Nh88rg6i-OgP_AUczt240",
  authDomain: "medalert-3557a.firebaseapp.com",
  projectId: "medalert-3557a",
  storageBucket: "medalert-3557a.firebasestorage.app",
  messagingSenderId: "899645498850",
  appId: "1:899645498850:web:a10c2f82eaa830282e05bb",
  measurementId: "G-R09P1D51SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);