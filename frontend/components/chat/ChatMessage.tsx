import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage as ChatMessageType } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const senderName = isUser ? 'You' : 'Chatbot';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
        {/* Sender name indicator */}
        <div className={`mb-1.5 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <span className="text-xs font-medium text-muted-foreground">
            {senderName}
          </span>
        </div>
        
        <Card 
          className={`p-4 sm:p-5 shadow-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
              : 'bg-muted rounded-2xl rounded-tl-sm border-2'
          }`}
        >
          <div className="space-y-3">
            <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>

            {message.sources && message.sources.length > 0 && (
              <div className={`mt-4 pt-4 space-y-3 ${isUser ? 'border-t border-primary-foreground/20' : 'border-t'}`}>
                <p className={`text-xs font-semibold ${isUser ? 'opacity-80' : 'text-muted-foreground'}`}>
                  Sources:
                </p>
                <div className="space-y-2">
                  {message.sources.map((source) => (
                    <Card 
                      key={source.chunkId} 
                      className={`p-3 sm:p-4 ${
                        isUser 
                          ? 'bg-primary-foreground/10 border-primary-foreground/20' 
                          : 'bg-background border-2'
                      } shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge 
                            variant={isUser ? "secondary" : "outline"} 
                            className="text-xs font-medium"
                          >
                            {source.documentTitle}
                          </Badge>
                          <Badge 
                            variant={isUser ? "default" : "secondary"} 
                            className="text-xs font-medium"
                          >
                            {Math.round(source.similarity * 100)}% match
                          </Badge>
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-3 ${
                          isUser ? 'opacity-90' : 'text-muted-foreground'
                        }`}>
                          {source.content}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
