# City Policy RAG

An AI-powered document Q&A system using Retrieval Augmented Generation (RAG) to enable intelligent querying of PDF documents with source citations.

## Overview

City Policy RAG is a full-stack application that allows users to upload PDF documents, generate vector embeddings, and chat with an AI assistant that answers questions based on the uploaded documents. The system uses semantic search to find relevant document chunks and provides accurate answers with source citations.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Sonner** - Toast notifications

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database with pgvector extension
- **LangChain** - PDF processing and vector store integration
- **OpenAI API** - Embeddings (text-embedding-3-small) and LLM (gpt-4o-mini)

## Features

- 📤 **Document Upload** - Drag-and-drop PDF uploads
- 🔍 **Vector Search** - Semantic search using pgvector
- 💬 **Chat Interface** - Session-based conversations with AI
- 📚 **Source Citations** - Answers include relevant document sources with similarity scores
- 🎨 **Dark Mode** - System-aware theme switching
- 📱 **Responsive Design** - Mobile-friendly interface

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher) with pgvector extension
- **OpenAI API Key** (for embeddings and chat completions)
- **npm** or **yarn** package manager

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd city-policy-rag
```

### 2. Database Setup

Install PostgreSQL and the pgvector extension:

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Connect to PostgreSQL
psql postgres

# Create database and enable pgvector
CREATE DATABASE city_policy_rag;
\c city_policy_rag
CREATE EXTENSION vector;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL=postgresql://user:password@localhost:5432/city_policy_rag
# - OPENAI_API_KEY=your-openai-api-key
# - PORT=8080

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start backend development server
npm run dev
```

The backend will be running at `http://localhost:8080`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with backend URL
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Start frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### 1. Upload Documents

1. Navigate to the Upload page (`/upload`)
2. Drag and drop a PDF file or click to browse
3. Wait for the upload to complete
4. Click "Generate Embeddings" to process the document
5. Once embeddings are generated, the document is ready for querying

### 2. Chat with Documents

1. Navigate to the Chat page (`/chat`)
2. Click "New Chat" to create a session
3. Type your question in the input field
4. Receive AI-powered answers with source citations
5. View similarity scores and document excerpts for each source

### 3. Manage Sessions

- Edit session titles by clicking the pencil icon
- Switch between sessions in the sidebar
- Each session maintains its own conversation history

## Project Structure

```
city-policy-rag/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.ts            # Chat session endpoints
│   │   │   ├── documents.ts       # Document upload/management
│   │   │   └── rag.ts             # RAG query endpoint
│   │   ├── services/
│   │   │   └── vector-store.ts    # Vector store operations
│   │   └── index.ts               # Express app entry point
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── chat/page.tsx          # Chat interface
    │   ├── upload/page.tsx        # Upload interface
    │   └── layout.tsx             # Root layout with nav
    ├── components/
    │   ├── chat/                  # Chat components
    │   ├── upload/                # Upload components
    │   └── ui/                    # shadcn/ui components
    ├── lib/
    │   ├── api.ts                 # API client
    │   └── types.ts               # TypeScript types
    └── package.json
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/city_policy_rag
OPENAI_API_KEY=your-openai-api-key
PORT=8080
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API Endpoints

### Chat Endpoints
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions` - List all sessions
- `GET /api/chat/sessions/:id/messages` - Get session messages
- `POST /api/chat/sessions/:id/messages` - Add message to session
- `PUT /api/chat/sessions/:id` - Update session title
- `DELETE /api/chat/sessions/:id` - Delete session

### RAG Endpoints
- `POST /api/rag/query` - Query RAG system

### Document Endpoints
- `POST /api/documents/upload` - Upload PDF document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents/:id/embed` - Generate embeddings
- `DELETE /api/documents/:id` - Delete document

## Development

### Backend Development

```bash
cd backend
npm run dev        # Start with ts-node-dev (auto-restart)
npm run build      # Build TypeScript
npm start          # Start production build
```

### Frontend Development

```bash
cd frontend
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `brew services list`
- Verify connection string in backend `.env`
- Check pgvector extension: `psql city_policy_rag -c "SELECT * FROM pg_extension WHERE extname = 'vector';"`

### OpenAI API Issues
- Verify API key is set correctly in backend `.env`
- Check API quota and billing at https://platform.openai.com/

### CORS Issues
- Ensure backend CORS is configured to allow `http://localhost:3000`
- Check browser console for specific CORS errors

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.