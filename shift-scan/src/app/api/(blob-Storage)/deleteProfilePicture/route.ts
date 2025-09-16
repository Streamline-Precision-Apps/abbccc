import getFirebaseAdmin from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const admin = getFirebaseAdmin();
    // bucket should get name initialized from firebase-admin.ts
    const bucket = admin.storage().bucket();

    // Parse the incoming form data
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

    // The file path should match your upload path
    const fileRef = bucket.file(`profileImages/${userId}.png`);
    const [exists] = await fileRef.exists();

    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    await fileRef.delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
