"use client";

export default function TascoCommentsSkeleton() {
  return (
    <>
      <div className="h-32 w-full bg-gray-200 rounded-md animate-pulse"></div>
      <div className="absolute bottom-5 right-2 w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
    </>
  );
}
