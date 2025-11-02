import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint para recibir webhooks de n8n
 * Este endpoint puede ser usado por n8n para enviar notificaciones de vuelta a la aplicación
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📨 Webhook recibido de n8n:', body)

    // Aquí puedes procesar diferentes tipos de webhooks de n8n
    const { type, data } = body

    switch (type) {
      case 'alert_processed':
        console.log('✅ Alerta procesada por n8n:', data)
        break
      
      case 'telegram_sent':
        console.log('📱 Mensaje enviado por Telegram:', data)
        break
      
      case 'professional_notified':
        console.log('👨‍⚕️ Profesional notificado:', data)
        break
      
      default:
        console.log('📋 Webhook n8n sin tipo específico:', body)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook procesado correctamente' 
    })

  } catch (error) {
    console.error('❌ Error procesando webhook de n8n:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Break_IA Webhook Endpoint - Use POST para enviar webhooks',
    timestamp: new Date().toISOString()
  })
}