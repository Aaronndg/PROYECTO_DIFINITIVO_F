import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { searchSimilarVerses, createEmbedding } from '@/lib/embeddings'
import { searchMockVerses, mockVerses } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const emotion = searchParams.get('emotion')
    const version = searchParams.get('version') || 'rv60'
    const query = searchParams.get('query')

    // Verificar que supabaseAdmin esté disponible
    if (!supabaseAdmin) {
      console.error('Supabase admin client no está configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Usar datos mock en desarrollo
    if (process.env.ENABLE_MOCK_DATA === 'true') {
      console.log('Using mock data for verses API')
      const verses = query ? searchMockVerses(query, emotion || undefined) : 
                    emotion ? searchMockVerses('', emotion) : 
                    mockVerses;
      
      return NextResponse.json({ 
        verses, 
        source: 'mock_data',
        total: verses.length,
        query,
        emotion
      });
    }

    // Si hay query de búsqueda, usar sistema RAG
    if (query) {
      try {
        const verses = await searchSimilarVerses(
          query, 
          emotion || undefined, 
          0.7, // threshold
          20  // max results
        )

        return NextResponse.json({ 
          verses: verses || [],
          searchType: 'semantic',
          query,
          emotion
        })
      } catch (error) {
        console.error('Error in semantic search, falling back to traditional search:', error)
      }
    }

    // Búsqueda tradicional (fallback o cuando no hay query)
    let supabaseQuery = supabaseAdmin
      .from('biblical_verses')
      .select('id, reference, text_rv60, text_ntv, emotion_tags, category, created_at')

    // Filtrar por emoción si se proporciona
    if (emotion) {
      supabaseQuery = supabaseQuery.contains('emotion_tags', [emotion])
    }

    const { data: verses, error } = await supabaseQuery
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching verses:', error)
      return NextResponse.json(
        { error: 'Error al obtener versículos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      verses: verses || [],
      searchType: 'traditional',
      emotion
    })

  } catch (error) {
    console.error('Error in verses API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reference, text_rv60, text_ntv, emotion_tags, category } = await request.json()

    if (!reference || !text_rv60) {
      return NextResponse.json(
        { error: 'Referencia y texto RV60 son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que supabaseAdmin esté disponible
    if (!supabaseAdmin) {
      console.error('Supabase admin client no está configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Crear embedding para el versículo
    const embeddingText = `${reference} ${text_rv60} ${emotion_tags?.join(' ') || ''} ${category || ''}`
    
    let embedding = null
    try {
      embedding = await createEmbedding(embeddingText)
    } catch (embeddingError) {
      console.error('Error creating embedding:', embeddingError)
      // Continuar sin embedding si falla
    }

    // Verificación adicional antes de usar supabaseAdmin
    if (!supabaseAdmin) {
      console.error('Supabase admin client no disponible en POST verse')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const { data: verse, error } = await supabaseAdmin
      .from('biblical_verses')
      .insert({
        reference,
        text_rv60,
        text_ntv: text_ntv || null,
        emotion_tags: emotion_tags || [],
        category: category || 'general',
        embedding,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating verse:', error)
      return NextResponse.json(
        { error: 'Error al crear versículo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      verse,
      message: 'Versículo creado exitosamente'
    })

  } catch (error) {
    console.error('Error in verses POST API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}