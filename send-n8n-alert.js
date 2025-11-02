// Enviar mensaje exacto como si fuera de n8n
const BOT_TOKEN = '8561666551:AAHP8AWktwZ58V_y5_cDESeMYuRCuC6ZpmQ';
const CHAT_ID = '6310843918';

async function sendN8nStyleAlert() {
  console.log('🚨 Enviando alerta estilo n8n...');
  
  // Mensaje exacto como está configurado en n8n
  const alertMessage = `🚨 ALERTA CRÍTICA - Break_IA

Usuario en riesgo detectado
Revisar inmediatamente

📞 Líneas de emergencia:
• Emergencias: 112
• Teléfono Esperanza: 91 459 00 50
• Línea 024: Prevención suicidio

🔴 ACCIÓN REQUERIDA`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: alertMessage,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ ¡ALERTA CRÍTICA ENVIADA!');
      console.log('🚨 Mensaje de emergencia Break_IA entregado');
      console.log('📱 Revisa tu Telegram - debería parecer una alerta real');
    } else {
      console.log(`❌ Error: ${result.description}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

sendN8nStyleAlert();