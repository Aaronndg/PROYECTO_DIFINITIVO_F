/**
 * Sistema de detección de riesgo y alertas para Break_IA
 * Detecta mensajes que indican riesgo de autolesión, suicidio o crisis emocional
 */

// Palabras clave que indican riesgo alto
const HIGH_RISK_KEYWORDS = [
  'suicidio', 'suicidarme', 'matarme', 'morir', 'muerte', 'acabar con todo',
  'no vale la pena vivir', 'mejor estar muerto', 'quiero morirme',
  'hacerme daño', 'lastimarme', 'cortarme', 'autolesión',
  'no sirvo para nada', 'no hay salida', 'no puedo más',
  'perdí la esperanza', 'todo está perdido', 'nadie me entiende',
  'estoy solo', 'nadie me quiere', 'soy un fracaso'
]

// Palabras clave que indican riesgo medio
const MEDIUM_RISK_KEYWORDS = [
  'depresión', 'deprimido', 'triste', 'desesperanzado', 'vacío',
  'ansiedad', 'pánico', 'miedo', 'preocupado', 'angustia',
  'no tengo ganas', 'todo es difícil', 'me siento mal',
  'perdido', 'confundido', 'abrumado', 'estresado'
]

// Frases que indican crisis emocional
const CRISIS_PHRASES = [
  'no puedo seguir así',
  'ya no aguanto más',
  'necesito ayuda urgente',
  'me siento muy mal',
  'estoy en crisis',
  'todo va mal',
  'no sé qué hacer'
]

export interface RiskAssessment {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  score: number
  triggers: string[]
  requiresIntervention: boolean
  suggestedAction: string
}

export interface AlertPayload {
  userId: string
  message: string
  riskLevel: string
  score: number
  triggers: string[]
  timestamp: string
  userEmail?: string
  sessionId?: string
}

/**
 * Analiza un mensaje para detectar señales de riesgo
 */
export function assessRiskLevel(message: string): RiskAssessment {
  const text = message.toLowerCase()
  let score = 0
  const triggers: string[] = []

  // Verificar palabras clave de alto riesgo
  HIGH_RISK_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 10
      triggers.push(keyword)
    }
  })

  // Verificar palabras clave de riesgo medio
  MEDIUM_RISK_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 5
      triggers.push(keyword)
    }
  })

  // Verificar frases de crisis
  CRISIS_PHRASES.forEach(phrase => {
    if (text.includes(phrase)) {
      score += 8
      triggers.push(phrase)
    }
  })

  // Determinar nivel de riesgo
  let level: RiskAssessment['level']
  let requiresIntervention = false
  let suggestedAction = ''

  if (score >= 20) {
    level = 'CRITICAL'
    requiresIntervention = true
    suggestedAction = 'Contactar servicios de emergencia inmediatamente'
  } else if (score >= 15) {
    level = 'HIGH'
    requiresIntervention = true
    suggestedAction = 'Intervención profesional urgente requerida'
  } else if (score >= 8) {
    level = 'MEDIUM'
    requiresIntervention = true
    suggestedAction = 'Seguimiento profesional recomendado'
  } else {
    level = 'LOW'
    requiresIntervention = false
    suggestedAction = 'Continuar con apoyo espiritual y emocional'
  }

  return {
    level,
    score,
    triggers,
    requiresIntervention,
    suggestedAction
  }
}

/**
 * Envía una alerta a n8n cuando se detecta riesgo
 * TAMBIÉN envía directamente a Telegram como respaldo
 */
export async function sendRiskAlert(
  userId: string,
  message: string,
  riskAssessment: RiskAssessment,
  userEmail?: string,
  sessionId?: string
): Promise<boolean> {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL no configurado')
      return false
    }

    const payload: AlertPayload = {
      userId,
      message: message.substring(0, 500), // Limitar longitud por seguridad
      riskLevel: riskAssessment.level,
      score: riskAssessment.score,
      triggers: riskAssessment.triggers,
      timestamp: new Date().toISOString(),
      userEmail,
      sessionId
    }

    // 1. Enviar a n8n (como antes)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`)
    }

    console.log('✅ Alerta de riesgo enviada a n8n:', {
      userId,
      riskLevel: riskAssessment.level,
      score: riskAssessment.score
    })

    // 2. ENVIAR TAMBIÉN DIRECTAMENTE A TELEGRAM (como respaldo)
    await sendDirectTelegramAlert(riskAssessment.level, userId, message, riskAssessment.score)

    return true

  } catch (error) {
    console.error('❌ Error enviando alerta a n8n:', error)
    
    // Si n8n falla, al menos intentar enviar directo a Telegram
    try {
      await sendDirectTelegramAlert(riskAssessment.level, userId, message, riskAssessment.score)
      console.log('✅ Alerta enviada directamente a Telegram como respaldo')
      return true
    } catch (telegramError) {
      console.error('❌ Error enviando alerta directa a Telegram:', telegramError)
      return false
    }
  }
}

/**
 * Envía alerta directamente a Telegram (método de respaldo)
 */
async function sendDirectTelegramAlert(
  riskLevel: RiskAssessment['level'],
  userId: string,
  message: string,
  score: number
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = '6310843918' // Tu Chat ID

  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN no configurado')
  }

  // Generar mensaje según el nivel de riesgo
  let alertMessage = ''
  
  if (riskLevel === 'CRITICAL') {
    alertMessage = `🚨 ALERTA CRÍTICA - Break_IA

Usuario en riesgo detectado
Revisar inmediatamente

📊 Puntuación de riesgo: ${score}
👤 Usuario: ${userId}
💬 Fragmento: "${message.substring(0, 100)}..."

📞 Líneas de emergencia:
• Emergencias: 112
• Teléfono Esperanza: 91 459 00 50
• Línea 024: Prevención suicidio

🔴 ACCIÓN REQUERIDA`
  } else if (riskLevel === 'HIGH') {
    alertMessage = `⚠️ ALERTA ALTA - Break_IA

Usuario necesita atención
Evaluar situación

📊 Puntuación de riesgo: ${score}
👤 Usuario: ${userId}
💬 Fragmento: "${message.substring(0, 100)}..."

📞 Recursos de ayuda:
• Emergencias: 112
• Teléfono Esperanza: 91 459 00 50

🟡 SEGUIMIENTO RECOMENDADO`
  } else if (riskLevel === 'MEDIUM') {
    alertMessage = `📝 ALERTA MEDIA - Break_IA

Usuario requiere atención
Monitorear situación

📊 Puntuación de riesgo: ${score}
👤 Usuario: ${userId}
💬 Fragmento: "${message.substring(0, 100)}..."

📞 Recursos disponibles:
• Teléfono Esperanza: 91 459 00 50
• Apoyo pastoral recomendado

🟢 SEGUIMIENTO SUGERIDO`
  }

  // Enviar mensaje a Telegram
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  const response = await fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: alertMessage,
      parse_mode: 'HTML'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Telegram API error: ${error.description}`)
  }

  console.log('✅ Alerta enviada directamente a Telegram:', riskLevel)
}

/**
 * Obtiene una respuesta de emergencia apropiada según el nivel de riesgo
 */
export function getEmergencyResponse(riskLevel: RiskAssessment['level']): string {
  switch (riskLevel) {
    case 'CRITICAL':
      return `🚨 **MENSAJE IMPORTANTE**: Veo que estás pasando por un momento muy difícil. Tu vida tiene valor y hay personas que pueden ayudarte ahora mismo.

📞 **LÍNEAS DE EMERGENCIA**:
• Teléfono de la Esperanza: 91 459 00 50
• Línea de Prevención del Suicidio: 024
• Emergencias: 112

🙏 **Versículo para ti**: "Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu." - Salmo 34:18

Por favor, contacta inmediatamente a un profesional o a estas líneas de ayuda. No estás solo/a.`

    case 'HIGH':
      return `⚠️ **NECESITAS APOYO PROFESIONAL**: Reconozco que estás atravesando una situación muy difícil. Es importante que busques ayuda profesional.

📞 **Recursos de ayuda**:
• Teléfono de la Esperanza: 91 459 00 50
• Centro de Salud Mental de tu zona
• Tu médico de familia

🙏 **Recuerda**: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." - Mateo 11:28

Tu pastor, un consejero cristiano o un psicólogo pueden brindarte el apoyo que necesitas.`

    case 'MEDIUM':
      return `💛 **APOYO Y ESPERANZA**: Entiendo que estás pasando por momentos difíciles. Es normal sentirse así a veces, pero no tienes que enfrentarlo solo/a.

🤝 **Te recomiendo**:
• Hablar con tu pastor o líder espiritual
• Considerar buscar un consejero cristiano
• Conectar con tu comunidad de fe

🙏 **Palabra de aliento**: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien." - Romanos 8:28

¿Te gustaría que oremos juntos o que busquemos versículos específicos para tu situación?`

    default:
      return ''
  }
}

/**
 * Registra un evento de riesgo en la base de datos para seguimiento
 */
export async function logRiskEvent(
  userId: string,
  message: string,
  riskAssessment: RiskAssessment,
  alertSent: boolean
) {
  try {
    // Aquí podrías guardar en Supabase para seguimiento
    // Por ahora solo logueamos en consola
    console.log('📝 Evento de riesgo registrado:', {
      userId,
      riskLevel: riskAssessment.level,
      score: riskAssessment.score,
      triggers: riskAssessment.triggers,
      alertSent,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error logging risk event:', error)
  }
}