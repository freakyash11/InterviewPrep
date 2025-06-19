// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-ufLJypVHtJ_IWd0VdeK8qCHtKD956aQ",
  authDomain: "prepwise-286c9.firebaseapp.com",
  projectId: "prepwise-286c9",
  storageBucket: "prepwise-286c9.firebasestorage.app",
  messagingSenderId: "1096214464499",
  appId: "1:1096214464499:web:b00d8c2d76b5c5e3b17486",
  measurementId: "G-J0THYH0XEW",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
