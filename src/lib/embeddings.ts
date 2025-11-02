import OpenAI from 'openai'
import { supabaseAdmin, isMockMode } from './supabase'
import { searchMockVerses } from './mockData'

const openai = process.env.ENABLE_MOCK_DATA === 'true' ? null : new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createEmbedding(text: string): Promise<number[]> {
  if (isMockMode()) {
    // Retornar embedding mock (vector de 1536 dimensiones con valores aleatorios)
    return Array.from({ length: 1536 }, () => Math.random() - 0.5)
  }

  try {
    const response = await openai!.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Error creating embedding:', error)
    throw error
  }
}

export async function searchSimilarVerses(
  query: string, 
  emotion?: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10
): Promise<any[]> {
  if (isMockMode()) {
    console.log('Using mock data for verse search')
    return searchMockVerses(query, emotion).slice(0, matchCount)
  }

  try {
    // Crear embedding para la query
    const searchText = emotion ? `${query} ${emotion}` : query
    const queryEmbedding = await createEmbedding(searchText)
    
    // Realizar búsqueda vectorial usando la función de Supabase
    const { data: similarVerses, error } = await supabaseAdmin.rpc(
      'match_verses',
      {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      }
    )

    if (error) {
      console.error('Error in vector search:', error)
      
      // Fallback: búsqueda tradicional si falla la vectorial
      let fallbackQuery = supabaseAdmin
        .from('biblical_verses')
        .select('id, reference, text_rv60, text_ntv, emotion_tags, category')

      if (emotion) {
        fallbackQuery = fallbackQuery.contains('emotion_tags', [emotion])
      }

      const { data: fallbackResults } = await fallbackQuery.limit(matchCount)
      return fallbackResults || []
    }

    return similarVerses || []
  } catch (error) {
    console.error('Error in semantic search:', error)
    return []
  }
}

export async function getContextualVerses(
  userMessage: string,
  emotionalContext?: string,
  userHistory?: any[]
): Promise<{
  verses: any[],
  searchQuery: string,
  emotionalInsight: string
}> {
  if (isMockMode()) {
    // Simular análisis en modo mock
    const mockEmotions = ['ansiedad', 'tristeza', 'esperanza', 'paz', 'miedo']
    const detectedEmotion = mockEmotions.find(emotion => 
      userMessage.toLowerCase().includes(emotion)
    ) || emotionalContext || 'paz'
    
    const verses = searchMockVerses(userMessage, detectedEmotion).slice(0, 3)
    
    return {
      verses,
      searchQuery: `Mock search: ${userMessage}`,
      emotionalInsight: `En modo desarrollo - detectando: ${detectedEmotion}`
    }
  }

  try {
    // Analizar el mensaje del usuario para extraer emociones y temas
    const analysisPrompt = `
    Analiza este mensaje de un usuario y extrae:
    1. Las emociones principales presentes
    2. Los temas bíblicos relevantes
    3. Palabras clave para búsqueda

    Mensaje: "${userMessage}"
    Contexto emocional: ${emotionalContext || 'No especificado'}
    
    Responde en formato JSON:
    {
      "emotions": ["emocion1", "emocion2"],
      "themes": ["tema1", "tema2"],
      "keywords": ["palabra1", "palabra2"],
      "searchQuery": "query optimizada para búsqueda"
    }
    `

    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: 'user', content: analysisPrompt }],
      temperature: 0.3,
      max_tokens: 300
    })

    let searchQuery = userMessage
    let primaryEmotion = emotionalContext

    try {
      const analysisResult = JSON.parse(analysis.choices[0].message.content || '{}')
      searchQuery = analysisResult.searchQuery || userMessage
      primaryEmotion = analysisResult.emotions?.[0] || emotionalContext
    } catch (parseError) {
      console.log('Could not parse analysis, using original message')
    }

    // Buscar versículos relevantes
    const verses = await searchSimilarVerses(searchQuery, primaryEmotion, 0.75, 5)

    // Generar insight emocional
    const emotionalInsight = `Basado en tu mensaje, he encontrado ${verses.length} versículos que pueden traerte paz y dirección. ${
      primaryEmotion ? `Veo que estás experimentando ${primaryEmotion}, y Dios tiene palabras especiales para ti en esta situación.` : ''
    }`

    return {
      verses,
      searchQuery,
      emotionalInsight
    }

  } catch (error) {
    console.error('Error getting contextual verses:', error)
    
    // Fallback simple
    const fallbackVerses = await searchSimilarVerses(userMessage, emotionalContext, 0.6, 3)
    
    return {
      verses: fallbackVerses,
      searchQuery: userMessage,
      emotionalInsight: 'Aquí tienes algunos versículos que pueden ser de bendición para ti.'
    }
  }
}

export async function enhanceAIResponseWithVerses(
  aiResponse: string,
  contextualVerses: any[]
): Promise<string> {
  if (isMockMode()) {
    // En modo mock, simplemente agregar el versículo al final
    if (!contextualVerses || contextualVerses.length === 0) {
      return aiResponse
    }
    
    const primaryVerse = contextualVerses[0]
    return `${aiResponse}\n\nPuede que encuentres aliento en ${primaryVerse.reference}: "${primaryVerse.text_rv60}"`
  }

  try {
    if (!contextualVerses || contextualVerses.length === 0) {
      return aiResponse
    }

    // Seleccionar el versículo más relevante
    const primaryVerse = contextualVerses[0]
    
    if (!openai) {
      // Fallback si OpenAI no está disponible
      return `${aiResponse}\n\nPuede que encuentres aliento en ${primaryVerse.reference}: "${primaryVerse.text_rv60}"`
    }
    
    // Mejorar la respuesta con el contexto del versículo
    const enhancementPrompt = `
    Mejora esta respuesta de consejería cristiana incorporando naturalmente este versículo bíblico.
    No repitas el versículo si ya está incluido. Hazlo fluir naturalmente.

    Respuesta original:
    "${aiResponse}"

    Versículo para incorporar:
    ${primaryVerse.reference}: "${primaryVerse.text_rv60}"

    Mejora la respuesta manteniendo un tono pastoral, cálido y esperanzador.
    `

    const enhancement = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: 'user', content: enhancementPrompt }],
      temperature: 0.7,
      max_tokens: 800
    })

    return enhancement.choices[0].message.content || aiResponse

  } catch (error) {
    console.error('Error enhancing AI response:', error)
    return aiResponse
  }
}