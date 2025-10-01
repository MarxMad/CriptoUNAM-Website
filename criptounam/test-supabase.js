// Script para probar la conexión con Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shccrrwnmogswspvlakf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2NycndubW9nc3dzcHZsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODYwNzcsImV4cCI6MjA3NDg2MjA3N30.heVBb4qhASOv6UZlfrTkZpoiQbva3JXFynn2AhO6_oM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔗 Probando conexión con Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('eventos')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
      console.log('💡 Necesitas ejecutar el SQL schema primero')
    } else {
      console.log('✅ Conexión exitosa con Supabase!')
    }
  } catch (err) {
    console.log('❌ Error:', err.message)
  }
}

testConnection()
