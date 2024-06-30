import { initializeApp } from "firebase/app";
// eslint-disable-next-line import/named
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2y7ONRvQEfdT3iUhubJMDNpgbw-UwV6Q",
  authDomain: "eatatnus-2f19d.firebaseapp.com",
  projectId: "eatatnus-2f19d",
  storageBucket: "eatatnus-2f19d.appspot.com",
  messagingSenderId: "819652585539",
  appId: "1:819652585539:web:87d3359496c2dc66f68cf6",
  measurementId: "G-41CQ7RW71Q",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const functions = getFunctions(app, "asia-southeast1");

export { auth, functions };
