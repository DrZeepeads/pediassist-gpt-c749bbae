
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Download, Trash2 } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { useChat } from '../context/ChatContext';
import { toast } from 'sonner';

const Chat: React.FC = () => {
  const { messages, isTyping, sendMessage, clearChat, exportChat } = useChat();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change or typing indicator appears/disappears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleMicToggle = () => {
    // In a real app, this would use the Web Speech API
    if (isRecording) {
      setIsRecording(false);
      toast.info('Voice recording would be implemented in the full version');
    } else {
      setIsRecording(true);
      toast('Would start recording in the full version', {
        description: 'Press the mic button again to stop'
      });
      
      // Simulate ending the recording after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    }
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the entire chat history?')) {
      clearChat();
      toast.success('Chat history cleared');
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md p-6 glass-panel rounded-xl">
              <h2 className="text-xl font-medium mb-3">Welcome to Nelson-GPT</h2>
              <p className="text-gray-600 mb-4">
                Ask any pediatric medical question, and get evidence-based answers
                from the Nelson Textbook of Pediatrics.
              </p>
              <div className="border border-nelson-100 bg-nelson-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  Try asking:
                </p>
                <ul className="text-sm text-nelson-600 mt-2 space-y-1">
                  <li>"What is the approach to fever in infants?"</li>
                  <li>"How do I diagnose and treat pediatric pneumonia?"</li>
                  <li>"What are the common causes of rash in children?"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Chat controls */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => exportChat('txt')}
              className="text-gray-500 hover:text-nelson-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Export chat"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={handleClearChat}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about pediatric conditions, treatments, or guidelines..."
              className="nelson-input w-full pr-24 resize-none"
              rows={3}
              disabled={isTyping}
            />
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button
                onClick={handleMicToggle}
                className={`p-2 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-colors`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`p-2 rounded-full ${
                  !input.trim() || isTyping
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-nelson-600 text-white hover:bg-nelson-700'
                } transition-colors`}
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-gray-500 text-center">
            Information is based on the Nelson Textbook of Pediatrics. 
            For educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
