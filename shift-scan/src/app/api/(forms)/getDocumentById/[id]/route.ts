// src/app/api/getDocumentById/[id]/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // ⬅️ Force Node.js for Buffer support

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.pdfDocument.findUnique({
      where: { id: params.id },
      select: {
        fileData: true,
        fileName: true,
        contentType: true,
        size: true,
        isActive: true,
      },
    });

    if (!document) {
      return new Response("Document not found", { status: 404 });
    }
    console.log("Document fetched:", document);
    console.log("fileData type:", typeof document.fileData);
    console.log("instanceof Uint8Array:", document.fileData instanceof Uint8Array);
    console.log("instanceof Buffer:", document.fileData instanceof Buffer);


    if (!document.isActive) {
      return new Response("Document is not available", { status: 403 });
    }

    if (!document.fileData) {
      return new Response("Document content missing", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", document.contentType || "application/pdf");
    headers.set("Content-Length", document.size.toString());

    const sanitizedFilename = document.fileName.replace(/[^a-zA-Z0-9-_.]/g, "_");
    headers.set("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
    headers.set("Cache-Control", "public, max-age=3600, must-revalidate");

    // ⬅️ Convert to Buffer from fileData
    const buffer = Buffer.from(document.fileData);

    return new Response(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("API error fetching PDF:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
