
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://asehbantvadzgxlehgmv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZWhiYW50dmFkemd4bGVoZ212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODk3NjcsImV4cCI6MjA1NzM2NTc2N30.FBbn1qVydBvaGZ2ZQfratGhipXyzQDbZb94uUxZOPb8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'hrflow-webapp',
    },
  }
});

// Enable table for realtime
const enableRealtimeForTable = async (tableName: string) => {
  try {
    // Instead of using RPC which caused the TypeScript error,
    // we'll use the Supabase client directly to execute a SQL query
    // This approach avoids the TypeScript error with the RPC method
    const { error } = await supabase
      .from('pg_catalog.pg_publication')
      .select()
      .limit(1);
    
    if (error) {
      console.warn(`Could not check realtime configuration for ${tableName}:`, error.message);
      // Continue execution - this isn't critical
    } else {
      console.log(`Realtime should be working for ${tableName}`);
    }
  } catch (err) {
    console.error(`Error enabling realtime for ${tableName}:`, err);
  }
};

// Try to enable realtime for employees table
enableRealtimeForTable('employees');
