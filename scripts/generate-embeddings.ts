import { config } from 'dotenv'
// Cargar variables de entorno desde .env.local
config({ path: '.env.local' })

import { createEmbedding } from '../src/lib/embeddings'
import { supabaseAdmin } from '../src/lib/supabase'

/**
 * Script para generar embeddings de todos los versículos bíblicos
 * Ejecutar con: npm run generate-embeddings
 */

interface Verse {
  id: string
  reference: string
  text_rv60: string
  text_ntv?: string
  emotion_tags: string[]
  category: string
}

async function generateEmbeddingsForAllVerses() {
  console.log('🔄 Iniciando generación de embeddings para versículos bíblicos...')
  
  // Verificar que supabaseAdmin esté disponible
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client no está configurado. Verifica las variables de entorno.')
  }
  
  try {
    // Obtener todos los versículos sin embeddings
    const { data: verses, error } = await supabaseAdmin
      .from('biblical_verses')
      .select('*')
      .is('embedding', null)

    if (error) {
      throw error
    }

    if (!verses || verses.length === 0) {
      console.log('✅ Todos los versículos ya tienen embeddings generados.')
      return
    }

    console.log(`📚 Procesando ${verses.length} versículos...`)

    let processed = 0
    let errors = 0

    for (const verse of verses) {
      try {
        // Crear texto combinado para el embedding
        const combinedText = `${verse.reference} ${verse.text_rv60} ${verse.emotion_tags?.join(' ') || ''} ${verse.category}`
        
        console.log(`🔄 Procesando: ${verse.reference}`)
        
        // Generar embedding
        const embedding = await createEmbedding(combinedText)
        
        // Guardar embedding en la base de datos
        const { error: updateError } = await supabaseAdmin
          .from('biblical_verses')
          .update({ embedding })
          .eq('id', verse.id)

        if (updateError) {
          throw updateError
        }

        processed++
        console.log(`✅ ${verse.reference} - Embedding generado (${processed}/${verses.length})`)
        
        // Pausa pequeña para no sobrecargar la API de OpenAI
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        errors++
        console.error(`❌ Error procesando ${verse.reference}:`, error)
      }
    }

    console.log('\n📊 RESUMEN:')
    console.log(`✅ Versículos procesados exitosamente: ${processed}`)
    console.log(`❌ Errores encontrados: ${errors}`)
    console.log(`📈 Total de versículos: ${verses.length}`)
    
    if (processed > 0) {
      console.log('\n🎉 ¡Embeddings generados exitosamente!')
      console.log('🔍 El sistema RAG ahora puede realizar búsquedas semánticas.')
    }

  } catch (error) {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  }
}

async function testVectorSearch() {
  console.log('\n🧪 Ejecutando prueba de búsqueda vectorial...')
  
  // Verificar que supabaseAdmin esté disponible
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client no está configurado. Verifica las variables de entorno.')
  }
  
  try {
    const testQuery = 'me siento muy triste y necesito consuelo'
    const embedding = await createEmbedding(testQuery)
    
    const { data: results, error } = await supabaseAdmin.rpc(
      'match_verses',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 3
      }
    )

    if (error) {
      throw error
    }

    console.log('\n🔍 Resultados de búsqueda para:', `"${testQuery}"`)
    console.log('-------------------------------------------')
    
    if (results && results.length > 0) {
      results.forEach((result: any, index: number) => {
        console.log(`${index + 1}. ${result.reference} (Similitud: ${(result.similarity * 100).toFixed(1)}%)`)
        console.log(`   "${result.text_rv60.substring(0, 100)}..."`)
        console.log(`   Emociones: ${result.emotion_tags?.join(', ') || 'N/A'}`)
        console.log()
      })
    } else {
      console.log('❌ No se encontraron resultados.')
    }

  } catch (error) {
    console.error('❌ Error en la prueba de búsqueda:', error)
  }
}

// Función principal
async function main() {
  console.log('🚀 BREAK_IA - Generador de Embeddings para Sistema RAG')
  console.log('===================================================\n')

  await generateEmbeddingsForAllVerses()
  await testVectorSearch()
  
  console.log('\n✨ Proceso completado. El sistema RAG está listo para usar.')
  process.exit(0)
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
}

export { generateEmbeddingsForAllVerses, testVectorSearch }