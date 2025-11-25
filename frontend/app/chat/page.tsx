'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { SessionList } from '@/components/chat/SessionList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { chatAPI, ragAPI } from '@/lib/api';
import type { ChatSession, ChatMessage as ChatMessageType } from '@/lib/types';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadSessions = async () => {
    try {
      const fetchedSessions = await chatAPI.listSessions();
      setSessions(fetchedSessions);
      if (fetchedSessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(fetchedSessions[0].id);
      }
    } catch (err) {
      setError('Failed to load sessions');
      console.error(err);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const fetchedMessages = await chatAPI.getSessionMessages(sessionId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    }
  };

  const handleNewSession = async () => {
    try {
      const newSession = await chatAPI.createSession();
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setError(null);
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) {
      setError('Please create or select a session first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage = await chatAPI.addMessage(currentSessionId, {
        role: 'user',
        content,
      });
      setMessages((prev) => [...prev, userMessage]);

      // Query RAG system
      const ragResponse = await ragAPI.query(content);

      // Add assistant message with sources
      const assistantMessage = await chatAPI.addMessage(currentSessionId, {
        role: 'assistant',
        content: ragResponse.answer,
        sources: ragResponse.sources,
      });
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30 backdrop-blur-sm">
        <SessionList
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            RAG Chat
          </h1>
          {error && (
            <div className="mt-3 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-4 max-w-md">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-xl font-semibold text-foreground">Start a conversation</h2>
                  <p className="text-muted-foreground">
                    Ask questions about your documents and get AI-powered answers with source citations
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4 sm:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSubmit={handleSendMessage} disabled={isLoading || !currentSessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
