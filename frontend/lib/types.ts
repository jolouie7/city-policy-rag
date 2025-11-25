// Shared TypeScript types for API communication

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: string;
}

export interface Source {
  documentId: string;
  documentTitle: string;
  chunkId: string;
  content: string;
  similarity: number;
}

export interface Document {
  id: string;
  filename: string;
  filepath: string;
  createdAt: string;
  embeddingsGenerated: boolean;
  chunks?: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  content: string;
  chunkIndex: number;
  hasEmbedding: boolean;
}

export interface RAGQueryResponse {
  answer: string;
  sources: Source[];
}
