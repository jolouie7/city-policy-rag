import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../db/client";
const router = Router();

/**
 * POST /api/chat/sessions
 * Create a new chat session
 */
router.post("/sessions", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const session = await prisma.chatSession.create({
      data: { title: title || "New Chat" },
    });
    res.status(201).json({ id: session.id, title: session.title });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

/**
 * GET /api/chat/sessions
 * Get all chat sessions
 */
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error getting chats:", error);
    res.status(500).json({ error: "Failed to get chats" });
  }
});

/** PUT /api/chat/sessions/:id
 * Update a chat session
 */
router.put("/sessions/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Session ID is required" });
  }
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const updatedSession = await prisma.chatSession.update({
      where: { id },
      data: { title: title },
    });
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error updating chat session:", error);
    res.status(500).json({ error: "Failed to update chat session" });
  }
});

/**
 * DELETE /api/chat/sessions/:id
 * Delete a chat session
 */
router.delete("/sessions/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Session ID is required" });
  }
  try {
    await prisma.chatSession.delete({
      where: { id },
    });
    res.status(200).json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ error: "Failed to delete chat session" });
  }
});

/**
 * GET /api/chat/sessions/:id/messages
 * Get all messages in a chat session
 */
router.get("/sessions/:id/messages", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Session ID is required" });
  }
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

/**
 * POST /api/chat/sessions/:id/messages
 * Create a new message in a chat session
 */
router.post("/sessions/:id/messages", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, content } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Session ID is required" });
  }
  if (!role) {
    return res
      .status(400)
      .json({ error: "Role is required (user or assistant)" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const message = await prisma.chatMessage.create({
      data: { sessionId: id, role: role, content: content },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

export default router;
