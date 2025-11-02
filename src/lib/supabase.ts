import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper para verificar si estamos en modo mock
export const isMockMode = () => {
  return process.env.ENABLE_MOCK_DATA === 'true' || !supabaseUrl || !supabaseAnonKey
}

// Validar variables de entorno solo si no estamos en modo mock
if (!isMockMode()) {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL no está configurado')
  }
  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurado')
  }
}

// Cliente para operaciones del lado del cliente
export const supabase = isMockMode() 
  ? null 
  : createClient(supabaseUrl!, supabaseAnonKey!)

// Cliente para operaciones server-side
export const supabaseAdmin = isMockMode() || !supabaseServiceKey
  ? null 
  : createClient(supabaseUrl!, supabaseServiceKey)

// Función para verificar la conexión
export async function testSupabaseConnection() {
  if (isMockMode()) {
    return { 
      success: true, 
      message: 'Ejecutando en modo mock - sin conexión a Supabase' 
    }
  }

  try {
    const { data, error } = await supabase!
      .from('biblical_verses')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return { success: true, message: 'Conexión exitosa a Supabase' }
  } catch (error) {
    console.error('Error conectando a Supabase:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    }
  }
}