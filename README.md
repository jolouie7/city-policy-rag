# City Policy RAG

An AI-powered document Q&A system using Retrieval Augmented Generation (RAG) to enable intelligent querying of PDF documents with source citations.

## Overview

City Policy RAG is a full-stack application that allows users to upload PDF documents, generate vector embeddings, and chat with an AI assistant that answers questions based on the uploaded documents. The system uses semantic search to find relevant document chunks and provides accurate answers.

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

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
<!-- - 📚 **Source Citations** - Answers include relevant document sources with similarity scores -->
- 🎨 **Dark Mode** - System-aware theme switching
- 📱 **Responsive Design** - Mobile-friendly interface

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** package manager
- **Docker & Docker Compose**
- **OpenAI API Key** (for embeddings and chat completions)

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jolouie7/city-policy-rag.git
cd city-policy-rag
```

### 2. Start Database with Docker

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL with pgvector using Docker Compose
docker-compose up -d

# This automatically:
# - Installs PostgreSQL 16 with pgvector extension
# - Creates the database (city_policy_rag)
# - Exposes it on localhost:5432
```

### 3. Backend Setup

```bash
# (Already in backend directory)

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your OpenAI API key:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/city_policy_rag
# OPENAI_API_KEY=your-openai-api-key-here
# PORT=8080

# Run Prisma migrations to create database tables
npx prisma migrate dev

# Start backend development server
npm run dev
```

Backend will be running at `http://localhost:8080`

### 4. Frontend Setup

```bash
# From project root
cd frontend

# Install dependencies
npm install

# Create .env.local file (already configured with correct API URL)
cp .env.example .env.local

# Start frontend development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 5. Usage

1. Open `http://localhost:3000` in your browser
2. Go to **Upload** page and upload a PDF document
3. Click **Generate Embeddings** to process the document
4. Go to **Chat** page and start asking questions about your documents!

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
# Database connection (matches Docker defaults)
DATABASE_URL=postgresql://postgres:password@localhost:5432/city_policy_rag

# Optional: Customize Docker database credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=city_policy_rag
POSTGRES_PORT=5432

# Required: OpenAI API key
OPENAI_API_KEY=your-openai-api-key

# Server port
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

## Docker Commands

If using Docker, run these commands from the `backend/` directory:

```bash
cd backend

# Start the database
docker-compose up -d

# Stop the database
docker-compose down

# View database logs
docker-compose logs postgres

# Stop and remove all data (fresh start)
docker-compose down -v

# Check if database is running
docker ps
```

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

### Docker/Database Issues

- **Database not starting**: Check if port 5432 is already in use with `lsof -i :5432`
- **Connection refused**: Ensure Docker container is running with `docker ps`
- **Fresh start needed**: Run `cd backend && docker-compose down -v` to remove all data and restart
- **Can't connect to database**: Verify `DATABASE_URL` in backend `.env` matches Docker credentials

### OpenAI API Issues

- **Invalid API key**: Verify `OPENAI_API_KEY` is set correctly in backend `.env`
- **Rate limit errors**: Check API quota and billing at https://platform.openai.com/
- **Model not found**: Ensure you have access to `gpt-4o-mini` and `text-embedding-3-small`

### Frontend Issues

- **CORS errors**: Backend CORS is already configured for `http://localhost:3000`
- **API not reachable**: Ensure backend is running on `http://localhost:8080`
- **Environment variables**: Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
