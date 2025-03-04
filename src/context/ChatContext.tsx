
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "../integrations/supabase/client";
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface SearchResult {
  chunk_id: string;
  content: string;
  similarity?: number;
  rank?: number;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => void;
  clearChat: () => void;
  exportChat: (format: 'pdf' | 'txt') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('nelson-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nelson-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const generateAIResponse = async (userQuery: string) => {
    setIsTyping(true);
    
    try {
      // First, search for relevant content using nelson-search function
      const { data: searchData, error: searchError } = await supabase.functions.invoke('nelson-search', {
        body: { query: userQuery, limit: 5 }
      });
      
      if (searchError) {
        console.error('Search function error:', searchError);
        throw new Error('Failed to search Nelson database');
      }
      
      const searchResults: SearchResult[] = searchData?.results || [];
      
      if (searchResults.length === 0) {
        // Handle no results case
        setTimeout(() => {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            content: `I couldn't find specific information about "${userQuery}" in the Nelson Textbook of Pediatrics. Please try rephrasing your question or ask about a different pediatric topic.`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Now, enhance the response with Mistral
      try {
        const { data: mistralData, error: mistralError } = await supabase.functions.invoke('nelson-mistral', {
          body: { 
            query: userQuery,
            searchResults: searchResults 
          }
        });
        
        if (mistralError) {
          console.error('Mistral function error:', mistralError);
          // Fall back to basic response generation if Mistral fails
          throw new Error('Failed to enhance response with Mistral');
        }
        
        const aiResponse = mistralData?.aiResponse;
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
        
      } catch (mistralError) {
        console.error('Error with Mistral enhancement:', mistralError);
        toast.error('AI enhancement failed, using basic response');
        
        // Fall back to basic response format
        const responseText = formatBasicResponse(searchResults);
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            content: responseText,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback to demo responses if search fails
      simulateAIResponse(userQuery);
    }
  };
  
  const formatBasicResponse = (results: SearchResult[]): string => {
    let responseText = `# Information from Nelson Textbook of Pediatrics\n\n`;
    
    // Extract key points from results
    const combinedContent = results.map(r => r.content).join(' ');
    const sentences = combinedContent.split(/\.\s+/).filter(s => s.trim().length > 0);
    
    // Group information into sections
    responseText += `## Key Points\n`;
    responseText += sentences.slice(0, Math.min(5, sentences.length))
      .map(s => `* ${s}${s.endsWith('.') ? '' : '.'}`)
      .join('\n');
    
    responseText += `\n\n## Detailed Information\n`;
    results.forEach(result => {
      responseText += `${result.content}\n\n`;
    });
    
    responseText += `\n**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
    
    return responseText;
  }
  
  const simulateAIResponse = (userMessage: string) => {
    // Define some demo responses based on user input
    const demoResponses: Record<string, string> = {
      default: `Based on the Nelson Textbook of Pediatrics, I can provide the following information:

* **Diagnosis**: Requires comprehensive assessment
* **Treatment**: Follow evidence-based protocols
* **Prognosis**: Varies based on condition severity and treatment adherence

Please note that this information is general guidance. Clinical judgment is essential for patient-specific care.`,
      fever: `# Fever in Children

According to the Nelson Textbook of Pediatrics, fever in children should be evaluated as follows:

* **Definition**: Temperature ≥ 38.0°C (100.4°F)
* **Assessment**:
  - Assess vital signs and general appearance
  - Look for source of infection
  - Consider age-specific risk factors

## Treatment Recommendations
- For mild-moderate fever: Acetaminophen 15mg/kg/dose q4-6h or Ibuprofen 10mg/kg/dose q6-8h
- Ensure adequate hydration
- Monitor for signs of serious infection

**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`,
      rash: `# Pediatric Rashes

The Nelson Textbook of Pediatrics classifies pediatric rashes into several categories:

* **Viral exanthems**: Typically widespread, maculopapular
* **Bacterial infections**: Often localized with surrounding erythema
* **Allergic reactions**: Can present with urticaria, pruritus
* **Inflammatory conditions**: May have distinct patterns (e.g., butterfly rash in SLE)

## Key Assessment Points
1. Distribution and pattern
2. Associated symptoms
3. Recent exposures or medications
4. Family history

**Note**: Proper diagnosis often requires in-person examination by a qualified healthcare provider.`,
    };

    // Simple keyword matching for demo
    let responseText = demoResponses.default;
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('fever') || lowercaseMessage.includes('temperature')) {
      responseText = demoResponses.fever;
    } else if (lowercaseMessage.includes('rash') || lowercaseMessage.includes('skin')) {
      responseText = demoResponses.rash;
    }

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Use the enhanced AI response generator
    generateAIResponse(content);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('nelson-chat-messages');
  };

  const exportChat = (format: 'pdf' | 'txt') => {
    // In a real app, this would generate and download the chat in the requested format
    // For now, let's just log what would happen
    console.log(`Exporting chat in ${format} format`);
    
    if (format === 'txt') {
      const text = messages.map(msg => 
        `[${msg.sender.toUpperCase()}] ${msg.timestamp.toLocaleString()}\n${msg.content}\n\n`
      ).join('');
      
      // Create a blob and download it
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nelson-chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // In a real app, we would use a library like jsPDF to generate a PDF
      alert('PDF export would be implemented in the full version.');
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isTyping, sendMessage, clearChat, exportChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
