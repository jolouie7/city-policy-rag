# Frontend README

## Overview
Simple Next.js chat interface with document upload for the City Policy RAG system.

## Features
- **Chat Interface** (`/chat`): RAG-powered Q&A with session management
- **Upload Interface** (`/upload`): PDF document upload and management
- **Responsive Design**: Mobile-friendly with shadcn/ui components

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment:
```bash
# Already configured in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run development server:
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

## Backend Requirements

You need to implement these backend endpoints:

### Chat Endpoints (NEW - you need to implement these)
- `POST /api/chat/sessions` - Create new session
  - Body: `{ title: string }`
  - Returns: `{ id: string, title: string, createdAt: string }`

- `GET /api/chat/sessions` - List all sessions
  - Returns: `[{ id: string, title: string, createdAt: string }]`

- `GET /api/chat/sessions/:id/messages` - Get session messages
  - Returns: `[{ id: string, role: 'user'|'assistant', content: string, sources?: [], createdAt: string }]`

- `POST /api/chat/sessions/:id/messages` - Add message
  - Body: `{ role: 'user'|'assistant', content: string, sources?: [] }`
  - Returns: `{ id: string, role, content, sources, createdAt }`

- `DELETE /api/chat/sessions/:id` - Delete session

### RAG Endpoint (already exists)
- `POST /api/rag/query` - Query RAG system
  - Body: `{ query: string }`
  - Returns: `{ answer: string, sources: [] }`

### Document Endpoints (already exist)
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - List documents
- `POST /api/documents/:id/embed` - Generate embeddings
- `DELETE /api/documents/:id` - Delete document

## Project Structure
```
frontend/
├── app/
│   ├── chat/page.tsx          # Chat interface
│   ├── upload/page.tsx        # Upload interface
│   ├── layout.tsx             # Root layout with nav
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── chat/
│   │   ├── ChatMessage.tsx    # Message display
│   │   ├── ChatInput.tsx      # Input field
│   │   └── SessionList.tsx    # Session sidebar
│   └── upload/
│       ├── FileUpload.tsx     # File upload dropzone
│       └── DocumentList.tsx   # Document list
└── lib/
    ├── api.ts                 # API client
    └── types.ts               # TypeScript types
```

## Usage Flow

1. **Upload Documents** (`/upload`)
   - Drag & drop or select PDF files
   - Click "Generate Embeddings" for each document
   - Wait for processing to complete

2. **Start Chatting** (`/chat`)
   - Click "New Chat" to create a session
   - Type questions about your documents
   - View AI responses with source citations

## Implementation Notes

- **Simple & Direct**: No Next.js API routes - frontend calls Express directly
- **No Streaming**: Simple request/response pattern (can add later)
- **Backend Persistence**: Chat history stored in your PostgreSQL database
- **CORS Required**: Your Express backend needs to allow requests from `http://localhost:3000`

## Next Steps (for you to implement)

1. Create Prisma models for `ChatSession` and `ChatMessage`
2. Run Prisma migration
3. Implement the 5 chat endpoints in Express
4. Make sure CORS is configured properly
5. Test the frontend!
