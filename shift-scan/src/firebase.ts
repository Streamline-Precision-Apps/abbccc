import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { setFCMToken } from "./actions/NotificationActions";
import { getStorage } from "firebase/storage";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUBdLoaUHXzX2vR9x7vlrsGoQscf3ua8g",
  authDomain: "fcm-shift-scan.firebaseapp.com",
  projectId: "fcm-shift-scan",
  storageBucket: "fcm-shift-scan.firebasestorage.app",
  messagingSenderId: "897456891133",
  appId: "1:897456891133:web:fee26fb80b6f4f021e0a94",
  measurementId: "G-TZHBBHJ7J7",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const storage = getStorage(app);

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      // Add FCM token to the user's profile
      if (token) {
        await setFCMToken({ token });
      }
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging, storage };
