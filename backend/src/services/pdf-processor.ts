import type { DocumentMetadata } from '../types/document.types.js';
import fs from 'fs';
import { extractText, getDocumentProxy } from 'unpdf';

interface PDFPage {
  pageNumber: number;
  text: string;
}

interface PDFExtractionResult {
  pages: PDFPage[];
  metadata: DocumentMetadata;
  fullText: string;
}

/**
 * Clean and normalize text extracted from PDF
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')           // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')       // Reduce excessive newlines
    .replace(/[ \t]+/g, ' ')          // Normalize whitespace
    .replace(/^\s+|\s+$/gm, '')       // Trim lines
    .trim();
}

/**
 * Extract text and metadata from PDF file
 */
export async function extractTextFromPDF(filePath: string): Promise<PDFExtractionResult> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    // Extract text using unpdf
    const result = await extractText(uint8Array);
    const { text, totalPages } = result;
    const pdfMetadata = (result as any).metadata;

    // Extract metadata
    const metadata: DocumentMetadata = {
      pageCount: totalPages,
      ...(pdfMetadata?.info?.Title && { title: String(pdfMetadata.info.Title) }),
      ...(pdfMetadata?.info?.Author && { author: String(pdfMetadata.info.Author) }),
      ...(pdfMetadata?.info?.CreationDate && {
        creationDate: new Date(String(pdfMetadata.info.CreationDate))
      }),
    };

    // Clean full text (ensure text is a string)
    const fullText = cleanText(String(text));

    // For now, treat entire PDF as one page (unpdf doesn't provide per-page text easily)
    // In production, you might want to use getDocumentProxy for per-page extraction
    const pages: PDFPage[] = [{
      pageNumber: 1,
      text: fullText,
    }];

    return {
      pages,
      metadata,
      fullText,
    };
  } catch (error) {
    throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete temporary PDF file after processing
 */
export function deleteTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete temp file ${filePath}:`, error);
  }
}
