
// Follow Deno's ES modules convention
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  // Use service role key (admin privileges)
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Unlink employee from user function
async function unlinkEmployeeFromUser(userId: string): Promise<boolean> {
  try {
    // Update any employee records associated with this user
    const { error } = await supabaseAdmin
      .from('employees')
      .update({ user_id: null })
      .eq('user_id', userId);
    
    if (error) {
      console.warn("Error unlinking employee records:", error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error during employee unlinking:", error);
    return false;
  }
}

// Handle the HTTP request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests for this function
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse the request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Perform authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify the user making the request is authorized
    // For additional security, you could verify the user's role here
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`User ${user.id} is attempting to delete user ${userId}`);

    // First, unlink any employee records
    const unlinkSuccess = await unlinkEmployeeFromUser(userId);
    if (!unlinkSuccess) {
      console.warn(`Failed to unlink employee records for user ${userId}, but continuing with deletion attempt`);
    }

    // Delete the user account using admin privileges
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error(`Error deleting user ${userId}:`, deleteError);
      return new Response(JSON.stringify({ success: false, error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`User ${userId} deleted successfully`);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } 
  catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
