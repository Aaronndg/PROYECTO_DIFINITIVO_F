/**
 * Script para probar el sistema dual de alertas
 * Debe enviar TANTO a n8n COMO directamente a Telegram
 */

const { assessRiskLevel, sendRiskAlert } = require('./src/lib/risk-detection.ts')

// Configurar variables de entorno
process.env.N8N_WEBHOOK_URL = 'https://primary-production-7b95.up.railway.app/webhook/crisis-alert'
process.env.TELEGRAM_BOT_TOKEN = '8561666551:AAHP8AWktwZ58V_y5_cDESeMYuRCuC6ZpmQ'

async function testDualAlerts() {
  console.log('🧪 Probando sistema dual de alertas...\n')

  // Mensaje de prueba con riesgo ALTO
  const testMessage = 'Me siento muy triste y no veo salida a mis problemas, quiero morir'
  const userId = 'test-user-' + Date.now()

  try {
    // 1. Evaluar riesgo
    console.log('1️⃣ Evaluando nivel de riesgo...')
    const riskAssessment = assessRiskLevel(testMessage)
    console.log(`   📊 Resultado: ${riskAssessment.level} (score: ${riskAssessment.score})`)
    console.log(`   🔍 Triggers: ${riskAssessment.triggers.join(', ')}\n`)

    // 2. Enviar alertas (dual)
    console.log('2️⃣ Enviando alertas duales...')
    const success = await sendRiskAlert(
      userId,
      testMessage,
      riskAssessment,
      'test@example.com',
      'test-session-123'
    )

    if (success) {
      console.log('✅ ÉXITO: Sistema dual de alertas funcionando')
      console.log('   🌐 n8n: Webhook enviado')
      console.log('   📱 Telegram: Mensaje directo enviado')
    } else {
      console.log('❌ ERROR: Falló el sistema de alertas')
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
  }
}

// Ejecutar prueba
testDualAlerts().then(() => {
  console.log('\n🏁 Prueba completada')
}).catch(console.error)