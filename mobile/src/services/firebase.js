import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "PLACEHOLDER_API_KEY",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "PLACEHOLDER_AUTH_DOMAIN",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "PLACEHOLDER_PROJECT_ID",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "PLACEHOLDER_APP_ID",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
