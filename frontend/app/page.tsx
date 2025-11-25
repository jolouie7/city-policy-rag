import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 max-w-6xl">
      <div className="space-y-12 text-center">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
            City Policy RAG
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered document Q&A system using Retrieval Augmented Generation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <Card className="p-8 border-2 flex flex-col h-full">
            <div className="space-y-6">
              <div className="text-5xl">💬</div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Chat</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ask questions about your documents and get AI-powered answers
                  with source citations
                </p>
              </div>
            </div>
            <Link href="/chat" className="block mt-auto pt-6">
              <Button className="w-full" size="lg">
                Start Chatting
              </Button>
            </Link>
          </Card>

          <Card className="p-8 border-2 flex flex-col h-full">
            <div className="space-y-6">
              <div className="text-5xl">📤</div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Upload</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Upload PDF documents to build your knowledge base
                </p>
              </div>
            </div>
            <Link href="/upload" className="block mt-auto pt-6">
              <Button className="w-full" variant="outline" size="lg">
                Upload Documents
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="mt-16 p-8 bg-gradient-to-br from-muted/50 to-muted/30 border-2 text-left">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Getting Started</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                  1
                </span>
                <span>Upload PDF documents using the Upload page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                  2
                </span>
                <span>Generate embeddings for your documents</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                  3
                </span>
                <span>Start asking questions in the Chat page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                  4
                </span>
                <span>Get AI-powered answers with source citations</span>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
