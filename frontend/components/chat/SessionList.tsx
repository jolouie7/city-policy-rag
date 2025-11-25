'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatSession } from '@/lib/types';

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function SessionList({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
}: SessionListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background/50">
        <Button 
          onClick={onNewSession} 
          className="w-full font-medium shadow-sm hover:shadow-md transition-all"
          size="lg"
        >
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs mt-1">Create a new chat to get started</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  currentSessionId === session.id 
                    ? 'bg-primary/10 border-primary/30 shadow-md' 
                    : 'hover:bg-accent/50 hover:border-accent hover:shadow-sm border-transparent'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <p className="text-sm font-semibold truncate mb-1">{session.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
