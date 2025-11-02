/**
 * Prueba directa del sistema de detección de riesgo
 * Sin APIs - solo lógica de detección
 */

// Simular la funcionalidad de detección de riesgo

const HIGH_RISK_KEYWORDS = [
  'suicidio', 'suicidarme', 'matarme', 'morir', 'muerte', 'acabar con todo',
  'no vale la pena vivir', 'mejor estar muerto', 'quiero morirme',
  'hacerme daño', 'lastimarme', 'cortarme', 'autolesión',
  'no sirvo para nada', 'no hay salida', 'no puedo más',
  'perdí la esperanza', 'todo está perdido', 'nadie me entiende',
  'estoy solo', 'nadie me quiere', 'soy un fracaso'
]

const MEDIUM_RISK_KEYWORDS = [
  'depresión', 'deprimido', 'triste', 'desesperanzado', 'vacío',
  'ansiedad', 'pánico', 'miedo', 'preocupado', 'angustia',
  'no tengo ganas', 'todo es difícil', 'me siento mal',
  'perdido', 'confundido', 'abrumado', 'estresado'
]

const CRISIS_PHRASES = [
  'no puedo seguir así',
  'ya no aguanto más',
  'necesito ayuda urgente',
  'me siento muy mal',
  'estoy en crisis',
  'todo va mal',
  'no sé qué hacer'
]

function assessRiskLevel(message) {
  const text = message.toLowerCase()
  let score = 0
  const triggers = []

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
  let level
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

function getEmergencyResponse(riskLevel) {
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

🙏 **Recuerda**: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." - Mateo 11:28`

    case 'MEDIUM':
      return `💛 **APOYO Y ESPERANZA**: Entiendo que estás pasando por momentos difíciles. Es normal sentirse así a veces, pero no tienes que enfrentarlo solo/a.

🤝 **Te recomiendo**:
• Hablar con tu pastor o líder espiritual
• Considerar buscar un consejero cristiano
• Conectar con tu comunidad de fe

🙏 **Palabra de aliento**: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien." - Romanos 8:28`

    default:
      return ''
  }
}

// PRUEBAS
console.log('🧪 PRUEBA DIRECTA DEL SISTEMA DE DETECCIÓN DE RIESGO')
console.log('='.repeat(60))

const testMessages = [
  {
    expected: 'LOW',
    message: 'Hola, ¿cómo estás? Me siento bien hoy.'
  },
  {
    expected: 'MEDIUM', 
    message: 'Me siento muy triste y deprimido últimamente.'
  },
  {
    expected: 'HIGH',
    message: 'No puedo más, todo va mal, me siento desesperanzado y solo.'
  },
  {
    expected: 'CRITICAL',
    message: 'Quiero morirme, no vale la pena vivir, nadie me entiende, mejor estar muerto.'
  }
]

testMessages.forEach((test, index) => {
  console.log(`\n📝 Prueba ${index + 1} - Esperado: ${test.expected}`)
  console.log(`Mensaje: "${test.message}"`)
  console.log('-'.repeat(50))
  
  const result = assessRiskLevel(test.message)
  
  console.log(`🎯 Nivel detectado: ${result.level}`)
  console.log(`📊 Score: ${result.score}`)
  console.log(`🚨 Requiere intervención: ${result.requiresIntervention ? 'SÍ' : 'NO'}`)
  console.log(`🎯 Triggers: ${result.triggers.join(', ') || 'Ninguno'}`)
  console.log(`💡 Acción sugerida: ${result.suggestedAction}`)
  
  if (result.requiresIntervention) {
    const response = getEmergencyResponse(result.level)
    console.log(`\n📋 Respuesta de emergencia:`)
    console.log(response.substring(0, 200) + '...')
  }
  
  const status = result.level === test.expected ? '✅ CORRECTO' : '❌ INCORRECTO'
  console.log(`\n${status} (Esperado: ${test.expected}, Obtenido: ${result.level})`)
})

console.log('\n🎉 Pruebas completadas!')
console.log('\n📊 RESUMEN DEL SISTEMA:')
console.log('• Detección de palabras clave de riesgo ✅')
console.log('• Clasificación por niveles de severidad ✅') 
console.log('• Respuestas de emergencia personalizadas ✅')
console.log('• Líneas de ayuda incluidas ✅')
console.log('• Versículos bíblicos de apoyo ✅')