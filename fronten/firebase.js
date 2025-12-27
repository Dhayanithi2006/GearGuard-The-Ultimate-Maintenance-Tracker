import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXMBj0M9H3rRupFYQmtOUTtVj9-LE9xM0",
  authDomain: "gearguard-d2dd1.firebaseapp.com",
  projectId: "gearguard-d2dd1",
  storageBucket: "gearguard-d2dd1.appspot.com",
  messagingSenderId: "236026992132",
  appId: "1:236026992132:web:a588919bb0acc309ac4751"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
