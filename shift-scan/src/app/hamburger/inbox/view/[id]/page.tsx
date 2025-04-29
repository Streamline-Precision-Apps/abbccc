"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";

export default function DocumentViewer({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/getDocumentById/${params.id}`);
        
        // Check for API errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || 
            `Failed to fetch document (${response.status})`
          );
        }

        // Get filename from headers if available
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename="?(.+?)"?(;|$)/);
        if (filenameMatch) {
          setFileName(filenameMatch[1]);
        }

        const blob = await response.blob();
        
        // Validate PDF content
        if (blob.size === 0) {
          throw new Error("Received empty PDF file");
        }
        if (blob.type !== "application/pdf") {
          throw new Error("Invalid PDF format");
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load document"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [params.id]);

  if (loading) {
    return (
      <Holds className="h-screen w-full flex justify-center items-center">
        <Spinner size={50} />
        <Titles size="h4" className="mt-4">Loading document...</Titles>
      </Holds>
    );
  }

  if (error) {
    return (
      <Holds className="h-screen w-full flex flex-col justify-center items-center gap-4">
        <Titles size="h3" className="text-red-500">
          {error.includes("Failed to fetch") ? "Document not found" : error}
        </Titles>
        <Buttons onClick={() => router.back()}>Go Back</Buttons>
      </Holds>
    );
  }

  return (
    <Holds className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header with back button and document title */}
      <Holds className="p-4 bg-white border-b flex justify-between items-center">
        <Buttons 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Documents
        </Buttons>
        
        {fileName && (
          <Titles size="h4" className="truncate max-w-xs">
            {fileName}
          </Titles>
        )}
      </Holds>

      {/* PDF Viewer Container */}
      <Holds className="flex-1 w-full h-full p-4">
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1`}
            className="w-full h-full rounded-lg shadow-md border border-gray-200 bg-white"
            frameBorder="0"
            title="PDF Viewer"
            allowFullScreen
          />
        ) : (
          <Holds className="h-full flex justify-center items-center">
            <Titles size="h4">No document to display</Titles>
          </Holds>
        )}
      </Holds>
    </Holds>
  );
}