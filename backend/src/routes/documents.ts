import { Router } from "express";
import type { Request, Response } from "express";
import { upload } from "../middleware/upload.js";
import { deleteTempFile } from "../services/pdf-processor.js";
import { prisma } from "../db/client.js";
import type { UploadResponse } from "../types/document.types.js";
import { generateEmbeddings } from "../services/embeddings.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const router = Router();

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE || "2400");
const CHUNK_OVERLAP = parseInt(process.env.CHUNK_OVERLAP || "480");

/**
 * POST /api/documents/upload
 * Upload a PDF file and process it into chunks
 */
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const originalFilename = req.file.originalname;

      // Load PDF using LangChain - extracts text page by page
      const loader = new PDFLoader(filePath);
      const pages = await loader.load();

      // Generate title from filename
      const title = originalFilename.replace(".pdf", "");

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_OVERLAP,
      });

      // Track chunks across all pages
      const allChunks = [];
      let globalChunkIndex = 0;

      // Process each page and split into chunks
      for (const page of pages) {
        const pageNumber = page.metadata.loc?.pageNumber ?? 1;
        const pageText = page.pageContent;

        // Split page text into chunks
        const textChunks = await textSplitter.splitText(pageText);

        // Add page info to each chunk
        for (const chunkText of textChunks) {
          allChunks.push({
            content: chunkText,
            pageNumber: pageNumber,
            chunkIndex: globalChunkIndex++,
          });
        }
      }

      // Save to database
      const document = await prisma.document.create({
        data: {
          title,
          filename: originalFilename,
          metadata: { pageCount: pages.length },
          chunks: {
            create: allChunks,
          },
        },
        include: {
          chunks: true,
        },
      });

      // Clean up temp file
      deleteTempFile(filePath);

      // Return response
      const response: UploadResponse = {
        documentId: document.id,
        title: document.title,
        filename: document.filename,
        chunkCount: document.chunks.length,
        uploadedAt: document.uploadedAt,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Upload error:", error);

      // Clean up file if it exists
      if (req.file?.path) {
        deleteTempFile(req.file.path);
      }

      res.status(500).json({
        error: "Failed to process PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * GET /api/documents
 * List all documents
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        title: true,
        filename: true,
        uploadedAt: true,
        metadata: true,
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.json(documents);
  } catch (error) {
    console.error("List documents error:", error);
    res.status(500).json({
      error: "Failed to fetch documents",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/documents/:id
 * Get a specific document with its chunks
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: { chunkIndex: "asc" },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      error: "Failed to fetch document",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/documents/:id/embed
 * Generate embeddings for all chunks in a document
 */
router.post("/:id/embed", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    // Fetch document with all chunks
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: { chunkIndex: "asc" },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check if embeddings already exist
    const hasEmbeddings = document.chunks.some(
      (chunk) => (chunk as any).embedding != null
    );
    if (hasEmbeddings) {
      return res.status(400).json({
        error: "Embeddings already exist for this document",
        message: "Delete and re-upload the document to regenerate embeddings",
      });
    }

    // Extract text from all chunks
    const texts = document.chunks.map((chunk) => chunk.content);

    // Generate embeddings in batch
    const embeddings = await generateEmbeddings(texts);

    // Update chunks with embeddings using raw SQL for pgvector
    await prisma.$transaction(
      document.chunks.map(
        (chunk, index) =>
          prisma.$executeRaw`
          UPDATE "Chunk"
          SET embedding = ${`[${embeddings[index]?.join(",")}]`}::vector
          WHERE id = ${chunk.id}
        `
      )
    );

    res.status(200).json({
      documentId: document.id,
      title: document.title,
      chunksProcessed: embeddings.length,
      embeddingDimensions: embeddings[0]?.length || 0,
    });
  } catch (error) {
    console.error("Embed error:", error);
    res.status(500).json({
      error: "Failed to generate embeddings",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * DELETE /api/documents/:id
 * Delete a document and all its chunks
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    await prisma.document.delete({
      where: { id },
    });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      error: "Failed to delete document",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
