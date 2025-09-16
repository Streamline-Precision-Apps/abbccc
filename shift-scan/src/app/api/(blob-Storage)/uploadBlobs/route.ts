import getFirebaseAdmin from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const admin = getFirebaseAdmin();
    const bucket = admin.storage().bucket();

    // Parse the incoming form data
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as Blob;
    const folder = (formData.get("folder") as string) || "profileImages";

    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided" },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to bucket
    const fileRef = bucket.file(`${folder}/${userId}.png`); // replace 7 with employee ID
    if (folder === "docs") {
      await fileRef.save(buffer, {
        contentType: "application/pdf",
        public: true, // optional: makes it publicly readable
      });
    } else {
      await fileRef.save(buffer, {
        contentType: "image/png",
        public: true, // optional: makes it publicly readable
      });
    }

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
