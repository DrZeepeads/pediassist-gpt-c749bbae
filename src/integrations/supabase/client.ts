// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qjqbvywuwwofmtzwznxb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWJ2eXd1d3dvZm10end6bnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NDA5MTMsImV4cCI6MjA1NjIxNjkxM30.DfegONHnRwIDvFEJk3TRr6dT2bsTE4DC1dsC8zfPTxE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);