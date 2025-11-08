// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5DCJ-cxWLWua-jDkJyT79A4ZGqjnP7h4",
  authDomain: "eyantra-lab.firebaseapp.com",
  projectId: "eyantra-lab",
  storageBucket: "eyantra-lab.appspot.com",
  messagingSenderId: "272392375699",
  appId: "1:272392375699:web:4dede12eab55c44c0aec66",
  measurementId: "G-XK6DF70V55"
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
