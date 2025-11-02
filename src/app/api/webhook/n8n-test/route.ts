import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook de prueba que simula n8n para desarrollo
 * Esto nos permite probar el sistema de alertas sin configurar n8n
 */

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()
    
    console.log('🚨 ALERTA RECIBIDA (Simulando n8n):', {
      userId: alertData.userId,
      riskLevel: alertData.riskLevel,
      score: alertData.score,
      triggers: alertData.triggers,
      timestamp: alertData.timestamp
    })

    // Simular procesamiento según nivel de riesgo
    const { riskLevel } = alertData

    let response = {
      processed: true,
      actions: [] as string[]
    }

    switch (riskLevel) {
      case 'CRITICAL':
        response.actions = [
          '🚨 Alerta CRÍTICA enviada a administradores',
          '📧 Email de emergencia enviado',
          '📱 Notificación Telegram enviada',
          '🏥 Protocolo de emergencia activado'
        ]
        console.log('🚨 CRÍTICO: Activando protocolo de emergencia')
        break

      case 'HIGH':
        response.actions = [
          '⚠️ Alerta ALTA registrada',
          '📱 Notificación a supervisores',
          '📋 Seguimiento programado en 24h'
        ]
        console.log('⚠️ ALTO: Programando seguimiento')
        break

      case 'MEDIUM':
        response.actions = [
          '💛 Alerta MEDIA registrada',
          '📊 Métricas actualizadas',
          '🔔 Recordatorio de seguimiento'
        ]
        console.log('💛 MEDIO: Registro para seguimiento')
        break

      default:
        response.actions = ['📝 Evento registrado']
    }

    // Simular envío a Telegram (en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 SIMULANDO TELEGRAM:')
      console.log(`   Chat ID: ADMIN_CHAT`)
      console.log(`   Mensaje: 🚨 Alerta ${riskLevel} - Usuario: ${alertData.userId}`)
      console.log(`   Score: ${alertData.score}`)
      console.log(`   Triggers: ${alertData.triggers.join(', ')}`)
    }

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Alerta procesada correctamente (simulación)',
      ...response
    })

  } catch (error) {
    console.error('❌ Error procesando alerta:', error)
    return NextResponse.json(
      { error: 'Error procesando alerta' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Webhook n8n simulado activo',
    message: 'Este endpoint simula n8n para desarrollo',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/webhook/n8n-test': 'Recibir alertas de riesgo'
    }
  })
}