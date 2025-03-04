
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

    console.log(`Processing search query: "${query}" with limit: ${limit}`);

    // Initialize the Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First try text search as it's more reliable when embedding may not be set up
    try {
      const processedQuery = query
        .trim()
        .split(/\s+/)
        .map(term => term.replace(/[^\w]+/g, ''))
        .filter(Boolean)
        .join(' & ');
      
      console.log(`Using text search with processed query: "${processedQuery}"`);
      
      const { data: textResults, error: textError } = await supabaseClient.rpc(
        'text_search_nelson_chunks',
        {
          query_text: processedQuery,
          match_count: limit
        }
      );

      if (textError) {
        console.error('Text search error:', textError);
        throw textError;
      }

      if (textResults && textResults.length > 0) {
        console.log(`Found ${textResults.length} results via text search`);
        
        // Log the search to the search_history table
        try {
          await supabaseClient
            .from('search_history')
            .insert({
              query: query,
              response_chunks: textResults.map(result => result.chunk_id)
            });
          console.log('Search history recorded successfully');
        } catch (historyError) {
          console.error('Failed to record search history:', historyError);
          // Continue even if history recording fails
        }

        return new Response(JSON.stringify({ 
          results: textResults, 
          method: 'text_search' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log('No results from text search, trying vector search');
    } catch (textSearchError) {
      console.error('Text search failed:', textSearchError);
      console.log('Falling back to vector search');
    }

    // Try vector search
    try {
      const { data: vectorResults, error: vectorError } = await supabaseClient.rpc(
        'search_nelson_chunks', 
        { 
          query_text: query,
          match_count: limit 
        }
      );

      if (vectorError) {
        console.error('Vector search error:', vectorError);
        throw vectorError;
      }

      if (vectorResults && vectorResults.length > 0) {
        console.log(`Found ${vectorResults.length} results via vector search`);
        
        // Log the search to the search_history table
        try {
          await supabaseClient
            .from('search_history')
            .insert({
              query: query,
              response_chunks: vectorResults.map(result => result.chunk_id)
            });
          console.log('Search history recorded successfully');
        } catch (historyError) {
          console.error('Failed to record search history:', historyError);
          // Continue even if history recording fails
        }

        return new Response(JSON.stringify({ 
          results: vectorResults, 
          method: 'vector_search' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (vectorSearchError) {
      console.error('Vector search failed:', vectorSearchError);
    }

    // If we get here, both search methods failed to find results
    console.log('No results found from either search method');
    
    return new Response(JSON.stringify({ 
      results: [],
      method: 'no_results' 
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
