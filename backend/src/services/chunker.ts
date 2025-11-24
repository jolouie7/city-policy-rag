import type { ChunkData } from '../types/document.types.js';

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Chunk text into segments with overlap
 *
 * @param text - The text to chunk
 * @param chunkSize - Target size in characters (default 2400 ≈ 600 tokens)
 * @param overlap - Overlap size in characters (default 480 ≈ 20% of chunkSize)
 * @param pageNumber - Page number for metadata (default 1)
 * @returns Array of chunk data objects
 */
export function chunkText(
  text: string,
  chunkSize: number = parseInt(process.env.CHUNK_SIZE ?? '2400'),
  overlap: number = parseInt(process.env.CHUNK_OVERLAP ?? '480'),
  pageNumber: number = 1
): ChunkData[] {
  const chunks: ChunkData[] = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    // Calculate end position
    const end = Math.min(start + chunkSize, text.length);

    // Extract chunk
    const content = text.slice(start, end).trim();

    // Only add non-empty chunks
    if (content.length > 0) {
      chunks.push({
        content,
        pageNumber,
        chunkIndex,
      });
      chunkIndex++;
    }

    // Move start position forward (accounting for overlap)
    start += chunkSize - overlap;

    // Prevent infinite loop if overlap >= chunkSize
    if (overlap >= chunkSize) {
      start = end;
    }
  }

  return chunks;
}

/**
 * Chunk text with better boundary detection (sentence-aware)
 * This is a more advanced version that tries to break at sentence boundaries
 */
export function chunkTextSmart(
  text: string,
  targetChunkSize: number = parseInt(process.env.CHUNK_SIZE ?? '2400'),
  overlap: number = parseInt(process.env.CHUNK_OVERLAP ?? '480'),
  pageNumber: number = 1
): ChunkData[] {
  const chunks: ChunkData[] = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    let end = Math.min(start + targetChunkSize, text.length);

    // If not at the end of text, try to find a sentence boundary
    if (end < text.length) {
      // Look for sentence endings within the last 200 characters of the chunk
      const searchStart = Math.max(end - 200, start);
      const segment = text.slice(searchStart, end + 100);

      // Find the last sentence boundary (. ! ? followed by space or newline)
      const sentenceEnd = segment.match(/[.!?][\s\n]/g);
      if (sentenceEnd && sentenceEnd.length > 0) {
        const lastSentence = sentenceEnd[sentenceEnd.length - 1];
        if (lastSentence) {
          const lastMatch = segment.lastIndexOf(lastSentence);
          if (lastMatch !== -1) {
            end = searchStart + lastMatch + 2; // +2 to include the punctuation and space
          }
        }
      }
    }

    // Extract chunk
    const content = text.slice(start, end).trim();

    // Only add non-empty chunks
    if (content.length > 0) {
      chunks.push({
        content,
        pageNumber,
        chunkIndex,
      });
      chunkIndex++;
    }

    // Move start position forward (accounting for overlap)
    start += end - start - overlap;

    // Safety check to prevent infinite loops
    if (start >= end) {
      start = end;
    }
  }

  return chunks;
}
