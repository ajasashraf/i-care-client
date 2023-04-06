import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPvKhk-eA03n_-D0rTJn8THvtaXh9tCTQ",
  authDomain: "e-care-24448.firebaseapp.com",
  projectId: "e-care-24448",
  storageBucket: "e-care-24448.appspot.com",
  messagingSenderId: "1014759413829",
  appId: "1:1014759413829:web:5ecd5c109a002068a02b2c",
  measurementId: "G-S8R1JXMDX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
