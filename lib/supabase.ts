import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmvgcphxwiadjndjiimo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdmdjcGh4d2lhZGpuZGppaW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzE1ODYsImV4cCI6MjA2OTY0NzU4Nn0.D7WcMcOBmEjAc9juWe7Hb0Qc84hneGE2cn8TCq-bhk8'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that require elevated permissions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdmdjcGh4d2lhZGpuZGppaW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3MTU4NiwiZXhwIjoyMDY5NjQ3NTg2fQ.LiP-BfVs4jIxnM9b83XyONljy4cK_y4PDHo3WVWOTdc'

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default supabase