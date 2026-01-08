// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmj2I362fDKWT3MIkSj_IKmI_ZSe57RZY",
  authDomain: "srm-eyantra.firebaseapp.com",
  projectId: "srm-eyantra",
  storageBucket: "srm-eyantra.firebasestorage.app",
  messagingSenderId: "581385475502",
  appId: "1:581385475502:web:aff5609cca261f3a7ae43f",
  measurementId: "G-X2J37FZB73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Restrict login to @srmist.edu.in emails
provider.setCustomParameters({
  hd: "srmist.edu.in"
});

export { auth, provider };
