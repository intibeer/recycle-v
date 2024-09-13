import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://kqmzdpippxxikpvesorh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbXpkcGlwcHh4aWtwdmVzb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NDIxMTUsImV4cCI6MjAzODUxODExNX0.Kt6ZEWk4hY9sR3Vbj33ICA_cRqWMr_LyDshYFy2CxSI'; // Replace with your Supabase service role key or a key with appropriate permissions

export const supabase = createClient(supabaseUrl, supabaseKey);