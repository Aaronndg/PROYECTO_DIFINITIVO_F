const { config } = require('dotenv')
config({ path: '.env.local' })

/**
 * Script para probar el sistema de detección de riesgo y alertas
 */

async function testRiskDetection() {
  console.log('🧪 PRUEBA DEL SISTEMA DE DETECCIÓN DE RIESGO')
  console.log('='.repeat(50))

  const testMessages = [
    {
      level: 'LOW',
      message: 'Hola, ¿cómo estás? Me siento bien hoy.'
    },
    {
      level: 'MEDIUM', 
      message: 'Me siento muy triste y deprimido últimamente.'
    },
    {
      level: 'HIGH',
      message: 'No puedo más, todo va mal, me siento desesperanzado y solo.'
    },
    {
      level: 'CRITICAL',
      message: 'Quiero morirme, no vale la pena vivir, nadie me entiende, mejor estar muerto.'
    }
  ]

  for (const test of testMessages) {
    console.log(`\n📝 Probando mensaje ${test.level}:`)
    console.log(`"${test.message}"`)
    console.log('-'.repeat(40))

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.message,
          userId: 'test-user-123',
          emotionalContext: 'testing'
        })
      })

      const result = await response.json()
      
      console.log(`🎯 Nivel detectado: ${result.riskLevel || 'No detectado'}`)
      console.log(`🚨 Alerta enviada: ${result.alertSent ? 'SÍ' : 'NO'}`)
      console.log(`⚠️ Respuesta de emergencia: ${result.isEmergencyResponse ? 'SÍ' : 'NO'}`)
      
      if (result.isEmergencyResponse) {
        console.log(`📋 Respuesta: ${result.response.substring(0, 100)}...`)
      }

      // Pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 1000))

    } catch (error) {
      console.error(`❌ Error: ${error.message}`)
    }
  }

  console.log('\n✅ Pruebas completadas!')
}

// Ejecutar pruebas
testRiskDetection().catch(console.error)