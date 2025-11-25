// API client for communicating with Express backend

import type {
  ChatSession,
  ChatMessage,
  Document,
  RAGQueryResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API error: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Chat Session API
export const chatAPI = {
  // Create a new chat session
  createSession: async (title?: string): Promise<ChatSession> => {
    return fetchAPI<ChatSession>('/api/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: title || 'New Chat' }),
    });
  },

  // List all chat sessions
  listSessions: async (): Promise<ChatSession[]> => {
    return fetchAPI<ChatSession[]>('/api/chat/sessions');
  },

  // Get messages for a session
  getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    return fetchAPI<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`);
  },

  // Add a message to a session
  addMessage: async (
    sessionId: string,
    message: { role: 'user' | 'assistant'; content: string; sources?: unknown[] }
  ): Promise<ChatMessage> => {
    return fetchAPI<ChatMessage>(`/api/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  // Update a session
  updateSession: async (sessionId: string, title: string): Promise<ChatSession> => {
    return fetchAPI<ChatSession>(`/api/chat/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  },

  // Delete a session
  deleteSession: async (sessionId: string): Promise<void> => {
    return fetchAPI<void>(`/api/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },
};

// RAG Query API
export const ragAPI = {
  query: async (query: string): Promise<RAGQueryResponse> => {
    return fetchAPI<RAGQueryResponse>('/api/rag/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },
};

// Documents API
export const documentsAPI = {
  // Upload a document
  upload: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new APIError(response.status, `Upload failed: ${response.statusText}`);
    }

    return await response.json();
  },

  // List all documents
  list: async (): Promise<Document[]> => {
    return fetchAPI<Document[]>('/api/documents');
  },

  // Get a specific document
  get: async (id: string): Promise<Document> => {
    return fetchAPI<Document>(`/api/documents/${id}`);
  },

  // Generate embeddings for a document
  generateEmbeddings: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/documents/${id}/embed`, {
      method: 'POST',
    });
  },

  // Delete a document
  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  },
};
