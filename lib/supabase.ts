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

// Client type definition
export interface Client {
  id?: string
  name: string
  company?: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending' | 'completed'
  created_at?: string
  updated_at?: string
}

// Client operations
export const clientOperations = {
  // Get all clients
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  },

  // Get client by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Client
  },

  // Create new client
  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    
    if (error) throw error
    return data as Client
  },

  // Update client
  async update(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Client
  },

  // Delete client
  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search clients
  async search(query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  },

  // Filter clients by status
  async filterByStatus(status: string) {
    if (status === 'all') {
      return this.getAll()
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  }
}

export default supabase