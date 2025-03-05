
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, searchResults } = await req.json();
    
    if (!query) {
      throw new Error('Query text is required');
    }

    if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error('Search results are required');
    }

    console.log(`Processing gemini query: "${query}" with ${searchResults.length} search results`);

    // Initialize the Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Format the context from search results
    const context = searchResults.map(result => result.content).join("\n\n");

    // Prepare the prompt for Gemini
    const prompt = `You are a medical assistant specialized in pediatrics, providing information based on the Nelson Textbook of Pediatrics.
Your goal is to give accurate, evidence-based answers about pediatric conditions, treatments, and guidelines.
Always include a medical disclaimer stating that this information is for educational purposes only.
Format your responses in Markdown for better readability.

Your answer should:
1. Define the condition or term clearly
2. Discuss etiology and/or causative agents when relevant
3. Outline diagnostic approaches
4. Explain treatment strategies 
5. Include prognosis when available
6. Add any special considerations for pediatric patients

Always provide detailed, specific information from the reference text, not generic responses.

Based on the following information from the Nelson Textbook of Pediatrics, please provide a comprehensive answer to this query: "${query}"
    
REFERENCE INFORMATION:
${context}`;

    // Check if Gemini API key is available
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      throw new Error('Gemini API key is not configured');
    }

    // Call Gemini API
    console.log("Calling Gemini API...");
    try {
      const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini API error:", geminiResponse.status, errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status} ${errorText}`);
      }

      const geminiData = await geminiResponse.json();
      
      // Extract text from Gemini response
      let aiResponse = "";
      try {
        aiResponse = geminiData.candidates[0].content.parts[0].text;
        console.log("Received response from Gemini API");
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError, JSON.stringify(geminiData));
        throw new Error("Failed to parse Gemini API response");
      }

      // Log the search to the search_history table with the enhanced response
      try {
        await supabaseClient
          .from('search_history')
          .insert({
            query: query,
            response_chunks: searchResults.map(result => result.chunk_id),
            enhanced_response: aiResponse
          });
        console.log("Search history with enhanced response recorded successfully");
      } catch (historyError) {
        console.error('Failed to record search history with enhanced response:', historyError);
        // Continue even if history recording fails
      }

      return new Response(JSON.stringify({ 
        aiResponse,
        searchResults
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (geminiError) {
      console.error('Error calling Gemini API:', geminiError);
      throw geminiError;
    }
  } catch (error) {
    console.error('Error in nelson-gemini function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
