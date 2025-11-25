# Backend Chat Implementation Example

Here's a complete example of the chat routes you need to implement.

## 1. Update Prisma Schema

Add to `backend/prisma/schema.prisma`:

```prisma
model ChatSession {
  id        String        @id @default(cuid())
  title     String
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  messages  ChatMessage[]
}

model ChatMessage {
  id        String      @id @default(cuid())
  sessionId String
  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      String      // 'user' or 'assistant'
  content   String      @db.Text
  sources   Json?       // Store sources as JSON
  createdAt DateTime    @default(now())

  @@index([sessionId])
}
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add-chat-sessions
npx prisma generate
```

## 2. Create Chat Routes

Create `backend/src/routes/chat.ts`:

```typescript
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a new chat session
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    
    const session = await prisma.chatSession.create({
      data: {
        title: title || 'New Chat'
      }
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// List all chat sessions
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

// Get messages for a specific session
router.get('/sessions/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Add a message to a session
router.post('/sessions/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, content, sources } = req.body;
    
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: id,
        role,
        content,
        sources: sources || null
      }
    });
    
    res.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Delete a session and all its messages
router.delete('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.chatSession.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
```

## 3. Register Routes in Express

Update `backend/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';
import documentsRoutes from './routes/documents';
import ragRoutes from './routes/rag';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/rag', ragRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'City Policy RAG API' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 4. Test the Endpoints

### Create a session
```bash
curl -X POST http://localhost:8080/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Chat"}'
```

### List sessions
```bash
curl http://localhost:8080/api/chat/sessions
```

### Add a message
```bash
curl -X POST http://localhost:8080/api/chat/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user",
    "content": "What is the weather like?",
    "sources": []
  }'
```

### Get messages
```bash
curl http://localhost:8080/api/chat/sessions/SESSION_ID/messages
```

### Delete session
```bash
curl -X DELETE http://localhost:8080/api/chat/sessions/SESSION_ID
```

## That's It!

Once you've implemented these routes, your frontend will work seamlessly with the backend. The chat interface will automatically:
- Create sessions
- Save all messages
- Display chat history
- Show source citations
- Persist across page refreshes
