
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

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

    // Initialize the Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Format the context from search results
    const context = searchResults.map(result => result.content).join("\n\n");

    // Prepare the prompt for Mistral
    const systemPrompt = `You are a medical assistant specialized in pediatrics, providing information based on the Nelson Textbook of Pediatrics.
Your goal is to give accurate, evidence-based answers about pediatric conditions, treatments, and guidelines.
Always include a medical disclaimer stating that this information is for educational purposes only.
Format your responses in Markdown for better readability.`;

    const userPrompt = `Based on the following information from the Nelson Textbook of Pediatrics, please provide a comprehensive answer to this query: "${query}"
    
REFERENCE INFORMATION:
${context}`;

    // Call Mistral API
    console.log("Calling Mistral API...");
    const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.text();
      console.error("Mistral API error:", errorData);
      throw new Error(`Mistral API error: ${mistralResponse.status} ${errorData}`);
    }

    const mistralData = await mistralResponse.json();
    const aiResponse = mistralData.choices[0].message.content;

    // Log the search to the search_history table with the enhanced response
    await supabaseClient
      .from('search_history')
      .insert({
        query: query,
        response_chunks: searchResults.map(result => result.chunk_id),
        enhanced_response: aiResponse // Assuming we have this column
      });

    return new Response(JSON.stringify({ 
      aiResponse,
      searchResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in nelson-mistral function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
