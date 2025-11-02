/**
 * Script para probar el webhook de n8n en Railway
 */

const RAILWAY_WEBHOOK_URL = 'https://n8n-production-020f.up.railway.app/webhook/break-ia-alert'

async function testRailwayWebhook() {
  console.log('🚂 PROBANDO WEBHOOK N8N EN RAILWAY')
  console.log('='.repeat(50))
  console.log('URL:', RAILWAY_WEBHOOK_URL)

  const testAlerts = [
    {
      name: 'CRITICAL Alert',
      data: {
        userId: 'test-user-123',
        message: 'Quiero morirme, no vale la pena vivir más',
        riskLevel: 'CRITICAL',
        score: 25,
        triggers: ['morirme', 'no vale la pena vivir'],
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'HIGH Alert', 
      data: {
        userId: 'test-user-456',
        message: 'No puedo más, todo va mal, estoy desesperanzado',
        riskLevel: 'HIGH',
        score: 18,
        triggers: ['no puedo más', 'desesperanzado'],
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'MEDIUM Alert',
      data: {
        userId: 'test-user-789',
        message: 'Me siento muy triste y deprimido',
        riskLevel: 'MEDIUM',
        score: 10,
        triggers: ['triste', 'deprimido'],
        timestamp: new Date().toISOString()
      }
    }
  ]

  for (const alert of testAlerts) {
    console.log(`\n🧪 Probando: ${alert.name}`)
    console.log('-'.repeat(30))

    try {
      const response = await fetch(RAILWAY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert.data)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ SUCCESS:', response.status)
        console.log('📤 Response:', JSON.stringify(result, null, 2))
      } else {
        console.log('❌ ERROR:', response.status, response.statusText)
        const errorText = await response.text()
        console.log('📝 Error details:', errorText)
      }

      // Pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 2000))

    } catch (error) {
      console.log('💥 FETCH ERROR:', error.message)
      
      if (error.message.includes('fetch failed')) {
        console.log('🔍 Posibles causas:')
        console.log('• n8n no está ejecutándose en Railway')
        console.log('• URL incorrecta')
        console.log('• Variables de entorno no configuradas')
        console.log('• Workflow no importado')
      }
    }
  }

  console.log('\n📋 INSTRUCCIONES:')
  console.log('1. Ve a Railway Dashboard')
  console.log('2. Configura las variables de entorno')
  console.log('3. Accede a n8n: https://n8n-production-020f.up.railway.app')
  console.log('4. Importa el workflow: n8n-break-ia-workflow.json')
  console.log('5. Configura credenciales de Telegram')
  console.log('6. Ejecuta este script nuevamente')
}

// Función para verificar si n8n está activo
async function checkN8nStatus() {
  console.log('\n🔍 Verificando estado de n8n...')
  
  try {
    const response = await fetch('https://n8n-production-020f.up.railway.app')
    console.log('✅ n8n está activo:', response.status)
    return true
  } catch (error) {
    console.log('❌ n8n no responde:', error.message)
    return false
  }
}

// Ejecutar
async function main() {
  await checkN8nStatus()
  await testRailwayWebhook()
}

main().catch(console.error)