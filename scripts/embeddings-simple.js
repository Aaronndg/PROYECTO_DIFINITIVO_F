const { config } = require('dotenv')
// Cargar variables de entorno
config({ path: '.env.local' })

const OpenAI = require('openai')
const { createClient } = require('@supabase/supabase-js')

// Verificar variables de entorno
console.log('🔍 Verificando variables de entorno...')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Configurada ✅' : 'No encontrada ❌')
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada ✅' : 'No encontrada ❌')
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada ✅' : 'No encontrada ❌')

// Configurar clientes
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  return response.data[0].embedding
}

async function generateEmbeddings() {
  console.log('\n🚀 Iniciando generación de embeddings...')
  
  try {
    // Obtener versículos sin embeddings
    const { data: verses, error } = await supabase
      .from('biblical_verses')
      .select('*')
      .is('embedding', null)

    if (error) {
      throw error
    }

    console.log(`📚 Encontrados ${verses.length} versículos sin embeddings`)

    if (verses.length === 0) {
      console.log('✅ Todos los versículos ya tienen embeddings')
      return
    }

    let processed = 0

    for (const verse of verses) {
      try {
        const text = `${verse.reference} ${verse.text_rv60} ${verse.emotion_tags?.join(' ') || ''}`
        console.log(`🔄 Procesando: ${verse.reference}`)
        
        const embedding = await createEmbedding(text)
        
        const { error: updateError } = await supabase
          .from('biblical_verses')
          .update({ embedding })
          .eq('id', verse.id)

        if (updateError) {
          throw updateError
        }

        processed++
        console.log(`✅ ${verse.reference} - Embedding generado (${processed}/${verses.length})`)
        
        // Pausa para no sobrecargar OpenAI
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`❌ Error con ${verse.reference}:`, error.message)
      }
    }

    console.log(`\n🎉 ¡Completado! ${processed} embeddings generados`)

    // Probar búsqueda
    await testSearch()

  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function testSearch() {
  console.log('\n🧪 Probando búsqueda vectorial...')
  
  try {
    const testQuery = 'tristeza y consuelo'
    const embedding = await createEmbedding(testQuery)
    
    const { data: results, error } = await supabase.rpc('match_verses', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 3
    })

    if (error) {
      throw error
    }

    console.log(`\n🔍 Resultados para "${testQuery}":`)
    console.log('-----------------------------------')
    
    if (results && results.length > 0) {
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.reference} (${(result.similarity * 100).toFixed(1)}%)`)
        console.log(`   "${result.text_rv60.substring(0, 80)}..."`)
        console.log()
      })
    } else {
      console.log('❌ No se encontraron resultados')
    }

  } catch (error) {
    console.error('❌ Error en búsqueda:', error.message)
  }
}

// Ejecutar
generateEmbeddings()