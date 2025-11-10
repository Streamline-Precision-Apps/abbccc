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

// Track if we've already logged FCM errors to reduce console noise
let fcmErrorLogged = false;

export const fetchToken = async () => {
  try {
    // Check if VAPID key is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY) {
      if (!fcmErrorLogged) {
        console.warn("Firebase FCM VAPID key not configured. Skipping token fetch.");
        fcmErrorLogged = true;
      }
      return null;
    }

    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      // Add FCM token to the user's profile
      if (token) {
        try {
          await setFCMToken({ token });
        } catch (serverActionError) {
          if (!fcmErrorLogged) {
            console.warn("Failed to save FCM token to server:", serverActionError);
            fcmErrorLogged = true;
          }
          // Still return the token even if saving failed
        }
      }
      return token;
    }
    return null;
  } catch (err) {
    // Reduce console noise - only log once per session
    if (!fcmErrorLogged) {
      console.warn("Firebase FCM not available or configured properly. Push notifications disabled.", err);
      fcmErrorLogged = true;
    }
    return null;
  }
};

export { app, messaging, storage };
