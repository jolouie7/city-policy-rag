import {
  PGVectorStore,
  type DistanceStrategy,
} from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { PoolConfig } from "pg";
import { Pool } from "pg";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const config = {
  postgresConnectionOptions: {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "city_policy_rag",
  } as PoolConfig,
  tableName: '"Chunk"', // Quote to preserve case sensitivity
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "content",
  },
  distanceStrategy: "cosine" as DistanceStrategy,
};

export async function getVectorStore() {
  // Connect to existing table - will NOT create a new table
  // If table doesn't exist, it will throw an error (which is what we want in prod)
  return new PGVectorStore(embeddings, config);
}
