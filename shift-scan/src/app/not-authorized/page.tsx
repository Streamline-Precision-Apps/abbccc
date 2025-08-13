"use client";
import Link from "next/link";

export default function NotAuthorized() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-white">
        You are not authorized to view these pages.
      </h1>
      <div className="mt-4">
        <Link href="/signin" className="text-blue-500 hover:underline">
          Go back to Sign In to see if session expired
        </Link>
      </div>
    </div>
  );
}
