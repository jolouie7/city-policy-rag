export interface DocumentMetadata {
  pageCount: number;
  author?: string;
  creationDate?: Date;
  title?: string;
}

// PDF metadata from unpdf
export interface PDFMetadata {
  Title?: string;
  Author?: string;
  CreationDate?: string;
}

export interface ChunkData {
  content: string;
  pageNumber: number;
  chunkIndex: number;
}

export interface ProcessedDocument {
  title: string;
  filename: string;
  metadata: DocumentMetadata;
  chunks: ChunkData[];
}

export interface UploadResponse {
  documentId: string;
  title: string;
  filename: string;
  chunkCount: number;
  uploadedAt: Date;
}
