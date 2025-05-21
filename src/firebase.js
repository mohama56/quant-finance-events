// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSvCbL-Ed-GKEmFmfFd3aBCTrAuVFbiAd2DM",
    authDomain: "msba-quantitative-finance.firebaseapp.com",
    projectId: "msba-quantitative-finance",
    storageBucket: "msba-quantitative-finance.firestorage.app",
    messagingSenderId: "187758708554",
    appId: "1:187758708554:web:22d3050e5146c9d558e3b3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };