// Supabase configuration - Global client
const SUPABASE_URL = "https://xvjxbmdkczopeflajvjl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2anhibWRrY3pvcGVmbGFqdmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTI4OTEsImV4cCI6MjA4Nzc2ODg5MX0.JY5eYIpOjoqU01n1o4YylZo5A8TXmyqE0BMcquElnzY";

// Create global supabase client if not already exists
var supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
