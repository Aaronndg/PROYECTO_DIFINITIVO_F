// Script para probar el sistema de alertas n8n completo

// URL del webhook de n8n en Railway
const N8N_WEBHOOK_URL = 'https://primary-production-7b95.up.railway.app/webhook/break-ia-alert';

// Datos de prueba para diferentes niveles de riesgo
const testAlerts = [
  {
    name: "Prueba CRITICAL",
    riskLevel: "CRITICAL",
    message: "me quiero suicidar no puedo más",
    userId: "test-user-123",
    timestamp: new Date().toISOString(),
    analysis: "Detectadas palabras de alto riesgo: suicidar, no puedo",
    score: 95
  },
  {
    name: "Prueba HIGH", 
    riskLevel: "HIGH",
    message: "estoy muy deprimido y no veo salida",
    userId: "test-user-456",
    timestamp: new Date().toISOString(),
    analysis: "Detectadas palabras de riesgo: deprimido, no veo salida",
    score: 75
  },
  {
    name: "Prueba MEDIUM",
    riskLevel: "MEDIUM", 
    message: "me siento triste y solo",
    userId: "test-user-789",
    timestamp: new Date().toISOString(),
    analysis: "Detectadas palabras de riesgo medio: triste, solo",
    score: 45
  }
];

async function testAlert(alert) {
  console.log(`\n🧪 Probando: ${alert.name}`);
  console.log(`📝 Mensaje: "${alert.message}"`);
  console.log(`⚠️ Nivel: ${alert.riskLevel} (Score: ${alert.score})`);
  
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert)
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log(`✅ Webhook enviado exitosamente`);
      console.log(`📡 Respuesta: ${result}`);
      console.log(`🤖 Revisa tu Telegram para ver la alerta!`);
    } else {
      console.log(`❌ Error: ${response.status} - ${response.statusText}`);
      console.log(`📡 Respuesta: ${result}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  // Esperar un poco antes de la siguiente prueba
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function runTests() {
  console.log('🚀 Iniciando pruebas del sistema de alertas Break_IA + n8n + Telegram');
  console.log(`📡 URL del webhook: ${N8N_WEBHOOK_URL}`);
  console.log('==========================================');
  
  for (const alert of testAlerts) {
    await testAlert(alert);
  }
  
  console.log('\n✨ Pruebas completadas!');
  console.log('📱 Revisa tu Telegram (@aaron) para ver las alertas recibidas');
}

// Ejecutar las pruebas
runTests().catch(console.error);