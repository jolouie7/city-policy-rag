import OpenAI from 'openai';

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Get or create OpenAI client instance
 */
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate embedding vector for a single text chunk
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate embeddings for multiple text chunks in batch
 * OpenAI allows up to 2048 inputs per request
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    if (texts.length === 0) {
      return [];
    }

    const openai = getOpenAIClient();

    // Process in batches of 2048 (OpenAI limit)
    const batchSize = 2048;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      });

      const embeddings = response.data.map((item) => item.embedding);
      allEmbeddings.push(...embeddings);
    }

    return allEmbeddings;
  } catch (error) {
    throw new Error(
      `Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Format embedding array as pgvector string
 */
export function formatEmbeddingForPgVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}
