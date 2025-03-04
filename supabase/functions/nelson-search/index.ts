
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 5 } = await req.json();
    
    if (!query) {
      throw new Error('Query text is required');
    }

    // Initialize the Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Try vector search first
    const { data: vectorResults, error: vectorError } = await supabaseClient.rpc(
      'search_nelson_chunks', 
      { 
        query_text: query,
        match_count: limit 
      }
    );

    if (vectorError && vectorError.message.includes('column "embedding" does not exist')) {
      console.log('Vector search failed, falling back to text search');
      
      // If vector search fails, fall back to text search
      const processedQuery = query
        .trim()
        .split(/\s+/)
        .map(term => term.replace(/[^\w]+/g, ''))
        .filter(Boolean)
        .join(' & ');
      
      const { data: textResults, error: textError } = await supabaseClient.rpc(
        'text_search_nelson_chunks',
        {
          query_text: processedQuery,
          match_count: limit
        }
      );

      if (textError) {
        throw textError;
      }

      // Log the search to the search_history table
      await supabaseClient
        .from('search_history')
        .insert({
          query: query,
          response_chunks: textResults.map(result => result.chunk_id)
        });

      return new Response(JSON.stringify({ 
        results: textResults, 
        method: 'text_search' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log the search to the search_history table
    await supabaseClient
      .from('search_history')
      .insert({
        query: query,
        response_chunks: vectorResults.map(result => result.chunk_id)
      });

    return new Response(JSON.stringify({ 
      results: vectorResults, 
      method: 'vector_search' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in nelson-search function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
