// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt5dtFD4EbEf2qFYO2vhG4c5o-v-iuExY",
  authDomain: "pixelpals-bookly.firebaseapp.com",
  projectId: "pixelpals-bookly",
  storageBucket: "pixelpals-bookly.firebasestorage.app",
  messagingSenderId: "934230047293",
  appId: "1:934230047293:web:f7108c13cbb12ec0b44854"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig;