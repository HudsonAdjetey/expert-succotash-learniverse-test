// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learniverse-course.firebaseapp.com",
  projectId: "learniverse-course",
  storageBucket: "learniverse-course.appspot.com",
  messagingSenderId: "4783290134",
  appId: "1:4783290134:web:317bb5b93a96160a598237",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
