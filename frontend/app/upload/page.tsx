"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/upload/FileUpload";
import { DocumentList } from "@/components/upload/DocumentList";
import { Separator } from "@/components/ui/separator";
import { documentsAPI } from "@/lib/api";
import type { Document } from "@/lib/types";

export default function UploadPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Debug: Log documents state changes to help identify duplicate IDs
  useEffect(() => {
    const ids = documents.map((d) => d.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error("❌ Duplicate document IDs detected:", ids);
      console.error("Documents:", documents);
    }
  }, [documents]);

  const loadDocuments = async () => {
    try {
      const docs = await documentsAPI.list();
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError("Failed to load documents");
      console.error(err);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadedDoc = await documentsAPI.upload(file);
      // Use functional update to avoid stale closure
      setDocuments((prev) => {
        // Remove any existing document with same ID (deduplication)
        const filtered = prev.filter((doc) => doc.id !== uploadedDoc.id);
        return [uploadedDoc, ...filtered];
      });
      toast.success(`Successfully uploaded ${file.name}`);
    } catch (err) {
      setError("Failed to upload file");
      toast.error("Failed to upload file");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await documentsAPI.delete(id);
      // Use functional update to avoid stale closure
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully");
    } catch (err) {
      setError("Failed to delete document");
      toast.error("Failed to delete document");
      console.error(err);
    }
  };

  const handleGenerateEmbeddings = async (id: string) => {
    try {
      await documentsAPI.generateEmbeddings(id);
      // Reload documents to get updated embedding status
      await loadDocuments();
      toast.success("Embeddings generated successfully");
    } catch (err) {
      setError("Failed to generate embeddings");
      toast.error("Failed to generate embeddings");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Document Upload
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload PDF documents to add them to your RAG knowledge base
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 shadow-sm">
            {error}
          </div>
        )}

        <FileUpload onUpload={handleUpload} disabled={isUploading} />

        {isUploading && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">
                Uploading and processing document...
              </p>
            </div>
          </div>
        )}

        <Separator className="my-8" />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Documents</h2>
          <DocumentList
            documents={documents}
            onDelete={handleDelete}
            onGenerateEmbeddings={handleGenerateEmbeddings}
          />
        </div>
      </div>
    </div>
  );
}
