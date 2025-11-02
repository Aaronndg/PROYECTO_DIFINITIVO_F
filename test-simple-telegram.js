// Test directo de Telegram via n8n webhook
async function testTelegramDirecto() {
  console.log('🧪 Probando webhook directo a Telegram...');
  
  // Datos simplificados solo para Telegram
  const alertaSimple = {
    riskLevel: "CRITICAL",
    message: "Test directo - mensaje de emergencia",
    userId: "test-123",
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch('https://primary-production-7b95.up.railway.app/webhook/break-ia-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertaSimple)
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Webhook enviado exitosamente');
      console.log(`📱 Revisa tu Telegram AHORA!`);
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testTelegramDirecto();