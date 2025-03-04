
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
      console.log("Calling nelson-search function...");
      const { data: searchData, error: searchError } = await supabase.functions.invoke('nelson-search', {
        body: { query: userQuery, limit: 5 }
      });
      
      if (searchError) {
        console.error('Search function error:', searchError);
        throw new Error('Failed to search Nelson database');
      }
      
      const searchResults: SearchResult[] = searchData?.results || [];
      console.log(`Received ${searchResults.length} search results`);
      
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
        console.log("Calling nelson-mistral function...");
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
        console.log("Received AI response from Mistral");
        
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
        const responseText = formatBasicResponse(userQuery, searchResults);
        
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
      toast.error('Search failed, using demo responses');
      simulateAIResponse(userQuery);
    }
  };
  
  const formatBasicResponse = (query: string, results: SearchResult[]): string => {
    let responseText = `# Information from Nelson Textbook of Pediatrics\n\n`;
    
    // Add query to response
    responseText += `## Response to: "${query}"\n\n`;
    
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
      default: `# General Medical Information

Based on the Nelson Textbook of Pediatrics, I can provide the following information:

## Key Points
* Pediatric conditions often present differently than in adults
* Dosing of medications must be carefully adjusted based on weight and age
* Developmental considerations are essential in pediatric assessment
* Family-centered care approach is recommended for optimal outcomes
* Early intervention for most conditions leads to better long-term prognosis

**Diagnosis**: Requires comprehensive assessment including physical examination, appropriate laboratory testing, and consideration of age-specific differentials.

**Treatment**: Follow evidence-based protocols with careful attention to pediatric-specific dosing and potential adverse effects.

**Prognosis**: Varies based on condition severity, timeliness of intervention, and treatment adherence.

**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`,
      
      fever: `# Fever in Children

According to the Nelson Textbook of Pediatrics, fever in children should be evaluated as follows:

## Definition and Significance
* **Definition**: Temperature ≥ 38.0°C (100.4°F)
* Fever is a physiologic response to infection or inflammation, not a disease itself
* Fever enhances immune function during infection
* The height of fever does not necessarily correlate with severity of illness

## Evaluation Approach
* Complete history and physical examination are essential
* Age-specific risk assessment is critical:
  - Neonates (0-28 days): Higher risk, lower threshold for extensive workup
  - Infants (1-3 months): Intermediate risk
  - Older infants and children: Lower risk if well-appearing

## Treatment Recommendations
* For mild-moderate fever: Acetaminophen 15mg/kg/dose q4-6h or Ibuprofen 10mg/kg/dose q6-8h
* Focus on improving comfort rather than normalizing temperature
* Ensure adequate hydration
* Monitor for signs of serious infection (lethargy, poor perfusion, respiratory distress)

**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`,
      
      pneumonia: `# Pneumonia in Children

## Definition
Pneumonia is an infection of the lung parenchyma characterized by inflammation of the alveoli and abnormal alveolar filling with fluid.

## Causative Agents
* **Viral causes** (most common in young children):
  - Respiratory syncytial virus (RSV)
  - Influenza viruses
  - Parainfluenza viruses
  - Human metapneumovirus
  - Adenovirus

* **Bacterial causes**:
  - *Streptococcus pneumoniae* (most common bacterial cause)
  - *Mycoplasma pneumoniae* (common in school-age children)
  - *Chlamydia pneumoniae*
  - *Staphylococcus aureus* (including MRSA)
  - *Haemophilus influenzae* type b (rare with vaccination)
  - Group A Streptococcus

## Clinical Presentation
* Fever, cough, tachypnea, increased work of breathing
* Decreased breath sounds, crackles, or wheezing on auscultation
* Hypoxemia in moderate to severe cases
* Symptoms may be subtle in infants and young children

## Diagnosis
* Clinical assessment (respiratory rate, work of breathing, auscultation)
* Chest radiography showing infiltrates or consolidation
* Complete blood count may show leukocytosis
* Blood cultures in more severe cases
* PCR testing for viral and atypical pathogens

## Treatment
* **Outpatient management** for mild cases:
  - Amoxicillin for typical bacterial pneumonia
  - Macrolides (azithromycin) for atypical pneumonia
  - Supportive care for viral pneumonia

* **Inpatient management** for moderate to severe cases:
  - Ampicillin or ceftriaxone (±macrolide) for typical pneumonia
  - Oxygen therapy for hypoxemia
  - IV fluids if needed
  - Respiratory support as indicated

## Prognosis
* Most children with community-acquired pneumonia recover completely
* Complications (empyema, lung abscess, pneumatocele) more common with bacterial causes
* Increased morbidity in children with underlying conditions

## Prevention
* Vaccination against *S. pneumoniae*, *H. influenzae* type b, influenza
* Good hand hygiene and respiratory etiquette

**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`,
      
      rash: `# Pediatric Rashes

The Nelson Textbook of Pediatrics classifies pediatric rashes into several categories:

## Common Types of Pediatric Rashes

### Viral Exanthems
* **Measles**: Erythematous maculopapular rash starting on face and spreading downward
* **Rubella**: Pink maculopapular rash starting on face and spreading to trunk
* **Roseola (HHV-6)**: Rose-pink maculopapular rash appearing as fever resolves
* **Erythema Infectiosum (Fifth Disease)**: "Slapped cheek" appearance with lacy reticular rash on extremities
* **Varicella (Chickenpox)**: Characteristic vesicular lesions in different stages of development

### Bacterial Infections
* **Scarlet Fever**: Diffuse, erythematous, sandpaper-like rash with circumoral pallor
* **Impetigo**: Honey-colored crusted lesions, often on face
* **Cellulitis**: Localized area of erythema, warmth, and tenderness

### Allergic Reactions
* **Urticaria (Hives)**: Raised, erythematous, pruritic wheals
* **Atopic Dermatitis (Eczema)**: Pruritic, erythematous patches/plaques, often in flexural areas
* **Drug Eruptions**: Various morphologies, often morbilliform and symmetric

### Inflammatory Conditions
* **Kawasaki Disease**: Polymorphous rash, often with mucosal changes and extremity findings
* **Juvenile Dermatomyositis**: Gottron papules, heliotrope rash
* **Systemic Lupus Erythematosus**: Malar (butterfly) rash, photosensitivity

## Key Assessment Points
1. Distribution and pattern
2. Morphology (macules, papules, vesicles, etc.)
3. Associated symptoms (fever, pruritus, mucosal involvement)
4. Recent exposures or medications
5. Family history

## Management Principles
* Specific treatment depends on etiology
* Supportive care often includes:
  - Moisturization for dry/inflammatory rashes
  - Appropriate antimicrobials for infectious causes
  - Antihistamines for pruritic eruptions
  - Topical steroids for inflammatory dermatoses

**Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`
    };

    // Simple keyword matching for demo
    let responseText = demoResponses.default;
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('fever') || lowercaseMessage.includes('temperature')) {
      responseText = demoResponses.fever;
    } else if (lowercaseMessage.includes('pneumonia') || lowercaseMessage.includes('lung infection')) {
      responseText = demoResponses.pneumonia;
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
