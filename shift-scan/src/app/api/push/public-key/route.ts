import { NextResponse } from "next/server";

// Use VAPID_PUBLIC_KEY from environment variables
const publicKey =
  process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function GET() {
  if (!publicKey) {
    return NextResponse.json(
      { error: "VAPID public key not configured" },
      { status: 500 },
    );
  }

  return NextResponse.json({ publicKey });
}
