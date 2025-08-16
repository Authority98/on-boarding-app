import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that require elevated permissions
// Only create admin client on server-side
let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (typeof window === 'undefined') {
  // Server-side only
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }
  
  supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export { supabaseAdmin }

// Client type definition
export interface Client {
  id?: string
  name: string
  company?: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending' | 'completed'
  user_id?: string
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
  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: user.id }])
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