import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAdLCswYuKoWPW6GNPa7uBQakdWkfljLGQ",
  authDomain: "ai-trainer-b9b7a.firebaseapp.com",
  projectId: "ai-trainer-b9b7a",
  storageBucket: "ai-trainer-b9b7a.appspot.com",
  messagingSenderId: "283301119087",
  appId: "1:283301119087:web:ac8c722ea67c9ae41c399a",
  measurementId: "G-TXBVNJ2N7Z",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
