import { NextRequest, NextResponse } from 'next/server'
import { christianAI } from '@/lib/openai-christian'
import { supabaseAdmin } from '@/lib/supabase'
import { getContextualVerses, enhanceAIResponseWithVerses } from '@/lib/embeddings'
import { mockAIResponse, mockChatMessages } from '@/lib/mockData'
import { assessRiskLevel, sendRiskAlert, getEmergencyResponse, logRiskEvent } from '@/lib/risk-detection'

export async function POST(request: NextRequest) {
  try {
    const { message, userId, emotionalContext } = await request.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Mensaje y ID de usuario son requeridos' },
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

    // Usar datos mock en desarrollo
    if (process.env.ENABLE_MOCK_DATA === 'true') {
      console.log('Using mock data for chat API')
      const mockResponse = mockAIResponse(message)
      
      return NextResponse.json({
        message: mockResponse.content,
        contextualVerses: mockResponse.verses,
        searchQuery: `Mock search for: ${message}`,
        emotionalInsight: `Detectando emociones en modo desarrollo`,
        source: 'mock_ai',
        timestamp: new Date().toISOString()
      })
    }

    // Detectar riesgo en el mensaje del usuario
    const riskAssessment = assessRiskLevel(message)
    let emergencyResponse = ''
    let alertSent = false

    // Si hay riesgo significativo, enviar alerta y preparar respuesta de emergencia
    if (riskAssessment.requiresIntervention) {
      console.log('🚨 Riesgo detectado:', {
        level: riskAssessment.level,
        score: riskAssessment.score,
        triggers: riskAssessment.triggers
      })

      // Enviar alerta a n8n
      alertSent = await sendRiskAlert(userId, message, riskAssessment)
      
      // Obtener respuesta de emergencia
      emergencyResponse = getEmergencyResponse(riskAssessment.level)
      
      // Registrar evento para seguimiento
      await logRiskEvent(userId, message, riskAssessment, alertSent)
    }

    // Obtener historial del usuario para contexto
    const { data: userHistory } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(5)

    // Usar sistema RAG para obtener versículos contextuales
    const { verses: contextualVerses, searchQuery, emotionalInsight } = await getContextualVerses(
      message,
      emotionalContext,
      userHistory || []
    )

    // Obtener respuesta base de la IA cristiana
    let aiResponse = await christianAI.getCounselingResponse(
      message, 
      emotionalContext, 
      userHistory || []
    )

    // Mejorar la respuesta con versículos contextuales del sistema RAG
    if (contextualVerses && contextualVerses.length > 0) {
      aiResponse = await enhanceAIResponseWithVerses(aiResponse, contextualVerses)
    }

    // Extraer referencias bíblicas mencionadas en la respuesta
    const biblicalReferences = extractBiblicalReferences(aiResponse)

    // Guardar la conversación en la base de datos
    const { data: chatMessage, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        emotion_context: emotionalContext,
        biblical_references: biblicalReferences,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving chat message:', error)
    }

    return NextResponse.json({
      response: emergencyResponse || aiResponse,
      messageId: chatMessage?.id,
      contextualVerses: contextualVerses.slice(0, 3), // Enviar máximo 3 versículos relacionados
      emotionalInsight,
      riskLevel: riskAssessment.level,
      alertSent: alertSent,
      isEmergencyResponse: !!emergencyResponse,
      searchQuery: process.env.NODE_ENV === 'development' ? searchQuery : undefined // Solo en desarrollo
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función auxiliar para extraer referencias bíblicas de un texto
function extractBiblicalReferences(text: string): string[] {
  const references: string[] = []
  
  // Patrón para detectar referencias bíblicas (ej: "Juan 3:16", "1 Corintios 13:4-7")
  const biblicalPattern = /(?:\d+\s+)?[A-Za-záéíóúñ]+\s+\d+:\d+(?:-\d+)?/g
  const matches = text.match(biblicalPattern)
  
  if (matches) {
    references.push(...matches)
  }
  
  return references
}