// src/app/api/getDocumentById/[id]/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.pdfDocument.findUnique({
      where: { id },
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

    if (!document.isActive) {
      return new Response("Document is not available", { status: 403 });
    }

    if (!document.fileData) {
      return new Response("Document content missing", { status: 404 });
    }

    // Convert to Buffer if it's not already one
    const pdfBuffer =
      document.fileData instanceof Buffer
        ? document.fileData
        : Buffer.from(document.fileData);

    console.log("PDF Buffer Size:", pdfBuffer.length);
    console.log("PDF Buffer Type:", typeof pdfBuffer);
    console.log("document: ", document);

    return new Response(pdfBuffer, {
      status: 200,
      headers: new Headers({
        "Content-Type": document.contentType || "application/pdf",
        "Content-Length": pdfBuffer.length.toString(),
        "Content-Disposition": `inline; filename="${document.fileName.replace(
          /[^a-zA-Z0-9-_.]/g,
          "_"
        )}"`,
        "Cache-Control": "public, max-age=3600",
      }),
    });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
