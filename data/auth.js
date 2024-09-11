import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import firebase, { initializeApp, getApps, getApp, length } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwn5257QrJQhNH5Z9fuf-QUDMpGmMfED0",
  authDomain: "vou-backend-22019.firebaseapp.com",
  projectId: "vou-backend-22019",
  storageBucket: "vou-backend-22019.appspot.com",
  messagingSenderId: "562175407861",
  appId: "1:562175407861:web:078d086dc2742661f437bc",
  measurementId: "G-DFN2BKEM1F",
};

let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

auth.useDeviceLanguage();

const logIn = () => {
  console.log("LogIn");
};

const register = () => {
  console.log("Register");
};

const logout = () => {
  auth.signOut();
};

export { logIn, register, auth, RecaptchaVerifier, signInWithPhoneNumber };
