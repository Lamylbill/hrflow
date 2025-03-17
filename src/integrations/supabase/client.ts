
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

// Define tables that should be enabled for realtime updates
const REALTIME_TABLES = ['employees', 'leave_requests', 'payroll', 'activity_logs'];

// Store channel references for potential cleanup
const realtimeChannels: ReturnType<typeof supabase.channel>[] = [];

// Enable realtime for multiple tables
const enableRealtimeForTables = async () => {
  try {
    console.log("Attempting to connect to Supabase and verify realtime functionality");
    
    // Check connectivity by querying a known table
    const { data, error } = await supabase
      .from('employees')
      .select('id')
      .limit(1);
    
    if (error) {
      console.warn("Could not verify Supabase connectivity:", error.message);
    } else {
      console.log("Supabase connection verified successfully");
      
      // Set up realtime channels for all tables
      REALTIME_TABLES.forEach(tableName => {
        // Create the channel with a unique name
        const channel = supabase.channel(`table-db-changes-${tableName}`);
        
        // Subscribe to the channel and then set up postgres_changes listener
        channel.subscribe((status) => {
          console.log(`Realtime subscription status for ${tableName}:`, status);
          
          if (status === 'SUBSCRIBED') {
            // Add postgres_changes listener after successful subscription
            channel.on(
              'postgres_changes',
              {
                event: '*', 
                schema: 'public', 
                table: tableName
              },
              (payload) => {
                console.log(`Realtime update for ${tableName}:`, payload);
              }
            );
          }
        });
        
        // Store channel reference for potential cleanup
        realtimeChannels.push(channel);
      });
    }
  } catch (err) {
    console.error("Error initializing realtime functionality:", err);
  }
};

// Initialize realtime functionality
enableRealtimeForTables();

// Helper function to clean up realtime subscriptions
export const cleanupRealtimeSubscriptions = () => {
  realtimeChannels.forEach(channel => {
    supabase.removeChannel(channel);
  });
  
  // Clear the array
  realtimeChannels.length = 0;
  
  console.log("Realtime subscriptions cleaned up");
};

// Export a function to create a realtime channel for specific filters
export const createRealtimeChannel = (
  tableName: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  filter?: Record<string, any>,
  callback?: (payload: any) => void
) => {
  if (!REALTIME_TABLES.includes(tableName)) {
    console.warn(`Table ${tableName} is not configured for realtime updates`);
    return null;
  }
  
  const channelName = `${tableName}-${event}-${Date.now()}`;
  const channel = supabase.channel(channelName);
  
  // Subscribe first, then set up the postgres_changes listener after successful subscription
  channel.subscribe((status) => {
    console.log(`Custom realtime channel status for ${tableName}:`, status);
    
    if (status === 'SUBSCRIBED') {
      channel.on(
        'postgres_changes',
        {
          event: event, 
          schema: 'public', 
          table: tableName, 
          filter: filter
        },
        (payload) => {
          console.log(`Custom realtime update for ${tableName}:`, payload);
          if (callback) callback(payload);
        }
      );
    }
  });
  
  return channel;
};
