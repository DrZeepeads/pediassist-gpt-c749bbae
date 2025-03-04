
import React from 'react';
import { Message } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, sender, timestamp } = message;
  
  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div 
        className={`${
          sender === 'user' ? 'message-bubble-user' : 'message-bubble-ai'
        }`}
      >
        {sender === 'ai' ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
        <div 
          className={`text-xs mt-1 text-right ${
            sender === 'user' ? 'text-white/70' : 'text-gray-500'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
