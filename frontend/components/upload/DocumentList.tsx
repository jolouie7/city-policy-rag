"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/types";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onGenerateEmbeddings: (id: string) => void;
}

export function DocumentList({
  documents,
  onDelete,
  onGenerateEmbeddings,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed">
        <div className="space-y-3">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-muted-foreground font-medium">
            No documents uploaded yet
          </p>
          <p className="text-sm text-muted-foreground">
            Upload your first PDF to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="p-5 sm:p-6 border-2 hover:shadow-md transition-all duration-200 hover:border-primary/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base truncate">
                  {doc.filename}
                </h3>
                {doc.embeddingsGenerated ? (
                  <Badge variant="default" className="font-medium">
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-medium">
                    No embeddings
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span key={`uploaded-${doc.id}`}>
                  Uploaded:{" "}
                  {new Date(doc.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {doc.chunks && (
                  <span key={`chunks-${doc.id}`} className="font-medium">
                    {doc.chunks.length}{" "}
                    {doc.chunks.length === 1 ? "chunk" : "chunks"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
              {!doc.embeddingsGenerated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateEmbeddings(doc.id)}
                  className="font-medium shadow-sm hover:shadow-md transition-all"
                >
                  Generate Embeddings
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(doc.id)}
                className="font-medium shadow-sm hover:shadow-md transition-all"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
