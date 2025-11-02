import { NextRequest, NextResponse } from 'next/server'
import { telegramBot } from '@/lib/telegram'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, chatId, userId, data } = await request.json()

    if (!action || !chatId) {
      return NextResponse.json(
        { error: 'Acción y Chat ID son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que supabaseAdmin esté disponible para acciones que lo necesiten
    if ((action === 'send_progress_update' || action === 'log_interaction') && !supabaseAdmin) {
      console.error('Supabase admin client no está configurado')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    switch (action) {
      case 'send_daily_verse':
        await telegramBot.sendDailyVerse(
          chatId,
          data.verse || 'Versículo por defecto',
          data.reference || 'Referencia'
        )
        break

      case 'send_emotional_support':
        await telegramBot.sendEmotionalSupport(
          chatId,
          data.emotion || 'ansiedad',
          data.message || 'Mensaje de apoyo'
        )
        break

      case 'send_test_reminder':
        await telegramBot.sendTestReminder(
          chatId,
          data.userName || 'Usuario'
        )
        break

      case 'send_progress_update':
        // Obtener datos de progreso del usuario
        if (userId) {
          const { data: recentTests } = await supabaseAdmin
            .from('emotional_tests')
            .select('mood_score, test_date')
            .eq('user_id', userId)
            .order('test_date', { ascending: false })
            .limit(7)

          const progressData = {
            averageMood: recentTests && recentTests.length > 0 
              ? recentTests.reduce((sum, test) => sum + test.mood_score, 0) / recentTests.length 
              : 0,
            trend: 'Estable',
            testCount: recentTests?.length || 0,
            encouragement: 'Sigue adelante en tu journey de bienestar emocional. Dios está contigo.'
          }

          await telegramBot.sendProgressUpdate(chatId, progressData)
        }
        break

      case 'register_chat':
        // Asociar chat ID con usuario
        const { error } = await supabaseAdmin
          .from('user_telegram')
          .upsert({
            user_id: userId,
            chat_id: chatId,
            is_active: true,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error registering telegram chat:', error)
        }
        break

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Mensaje enviado exitosamente' 
    })

  } catch (error) {
    console.error('Error in telegram API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Webhook para recibir mensajes de Telegram
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Verificar token simple para seguridad
    if (token !== process.env.TELEGRAM_WEBHOOK_TOKEN) {
      return NextResponse.json(
        { error: 'Token no válido' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      status: 'Webhook activo',
      timestamp: new Date().toISOString() 
    })

  } catch (error) {
    console.error('Error in telegram webhook:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}