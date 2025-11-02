import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { christianAI } from '@/lib/openai-christian'

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      moodScore, 
      anxietyLevel, 
      stressLevel, 
      energyLevel, 
      sleepQuality, 
      notes 
    } = await request.json()

    // Verificar que supabaseAdmin esté disponible
    if (!supabaseAdmin) {
      console.error('Supabase admin client no está configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }
    if (!userId || moodScore === undefined) {
      return NextResponse.json(
        { error: 'ID de usuario y puntuación de estado de ánimo son requeridos' },
        { status: 400 }
      )
    }

    // Determinar emoción predominante basada en las puntuaciones
    let predominantEmotion = 'neutral'
    if (moodScore >= 8) predominantEmotion = 'alegría'
    else if (moodScore <= 3) predominantEmotion = 'tristeza'
    else if (anxietyLevel >= 7) predominantEmotion = 'ansiedad'
    else if (stressLevel >= 7) predominantEmotion = 'estrés'
    else if (moodScore >= 6) predominantEmotion = 'esperanza'

    // Generar recomendaciones usando IA
    const aiRecommendations = await christianAI.getVerseRecommendation(predominantEmotion)

    // Guardar el test en la base de datos
    const { data: test, error } = await supabaseAdmin
      .from('emotional_tests')
      .insert({
        user_id: userId,
        test_date: new Date().toISOString().split('T')[0],
        mood_score: moodScore,
        anxiety_level: anxietyLevel || null,
        stress_level: stressLevel || null,
        energy_level: energyLevel || null,
        sleep_quality: sleepQuality || null,
        notes: notes || null,
        recommendations: [aiRecommendations],
        predominant_emotion: predominantEmotion,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving emotional test:', error)
      return NextResponse.json(
        { error: 'Error al guardar el test' },
        { status: 500 }
      )
    }

    // Calcular progreso del usuario
    const { data: recentTests } = await supabaseAdmin
      .from('emotional_tests')
      .select('mood_score, test_date')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })
      .limit(7)

    let trend = 'stable'
    if (recentTests && recentTests.length >= 2) {
      const recent = recentTests[0].mood_score
      const previous = recentTests[1].mood_score
      if (recent > previous + 1) trend = 'positive'
      else if (recent < previous - 1) trend = 'negative'
    }

    return NextResponse.json({
      test,
      predominantEmotion,
      recommendations: aiRecommendations,
      trend,
      message: 'Test guardado exitosamente'
    })

  } catch (error) {
    console.error('Error in tests API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
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

    const { data: tests, error } = await supabaseAdmin
      .from('emotional_tests')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching tests:', error)
      return NextResponse.json(
        { error: 'Error al obtener tests' },
        { status: 500 }
      )
    }

    // Calcular estadísticas
    const stats = {
      totalTests: tests?.length || 0,
      averageMood: tests?.reduce((sum, test) => sum + test.mood_score, 0) / (tests?.length || 1) || 0,
      lastTestDate: tests?.[0]?.test_date || null
    }

    return NextResponse.json({ tests: tests || [], stats })

  } catch (error) {
    console.error('Error in tests GET API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}