import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get the service account from environment variable
let serviceAccount: ServiceAccount;

try {
  // Get the service account from environment variable
  const serviceAccountJson = {
    type: process.env.FIREBASE_SERVICE_JSON_TYPE,
    project_id: process.env.FIREBASE_SERVICE_JSON_PROJECT_ID,
    private_key_id: process.env.FIREBASE_SERVICE_JSON_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_SERVICE_JSON_PRIVATE_KEY,
    client_email: process.env.FIREBASE_SERVICE_JSON_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_SERVICE_JSON_CLIENT_ID,
    auth_uri: process.env.FIREBASE_SERVICE_JSON_AUTH_URI,
    token_uri: process.env.FIREBASE_SERVICE_JSON_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_SERVICE_JSON_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:
      process.env.FIREBASE_SERVICE_JSON_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_SERVICE_JSON_UNIVERSE_DOMAIN,
  };
  serviceAccount = serviceAccountJson as ServiceAccount;
  // Initialize the app if it hasn't been initialized yet
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error("Failed to load Firebase service account:", error);
  throw new Error("Firebase service account is not available");
}

export async function POST(request: NextRequest) {
  const { token, title, message, link, topic } = await request.json();

  const payload: Message = {
    token,
    topic,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
