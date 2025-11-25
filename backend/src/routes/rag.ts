import { Router } from "express";
import type { Request, Response } from "express";
import { getVectorStore } from "../services/vector-store";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/rag/query
 * Generate a response to a user query using RAG
 */
router.post("/query", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearchWithScore(query, 5);
    const context = results.map(([doc]) => doc.pageContent).join("\n");

    const systemPrompt = `You are a helpful assistant answering questions about city policies. 
  Use only the provided context to answer. If the answer isn't in the context, say so.`;

    const userPrompt = `User query: ${query}`;

    const prompt = `${systemPrompt}\n\n${context}\n\n${userPrompt}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    res.json({
      answer: response.choices[0]?.message.content || "",
      sources: results.map(([doc, score]) => ({
        documentId: doc.metadata?.documentId || "",
        documentTitle: doc.metadata?.documentTitle || "",
        chunkId: doc.metadata?.chunkId || "",
        content: doc.pageContent,
        similarity: score,
      })),
    });
  } catch (error) {
    console.error("RAG query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
