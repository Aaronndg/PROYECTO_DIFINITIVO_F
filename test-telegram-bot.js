// Test directo del bot de Telegram
const TELEGRAM_BOT_TOKEN = '8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY';
const CHAT_ID = '6310843918';

async function testTelegramBot() {
  console.log('🤖 Probando bot de Telegram directamente...');
  console.log(`📱 Chat ID: ${CHAT_ID}`);
  
  try {
    // 1. Verificar info del bot
    console.log('\n1️⃣ Verificando información del bot...');
    const botInfo = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botData = await botInfo.json();
    
    if (botData.ok) {
      console.log(`✅ Bot encontrado: @${botData.result.username}`);
      console.log(`📝 Nombre: ${botData.result.first_name}`);
    } else {
      console.log(`❌ Error obteniendo info del bot: ${botData.description}`);
      return;
    }
    
    // 2. Enviar mensaje de prueba
    console.log('\n2️⃣ Enviando mensaje de prueba...');
    const message = '🧪 TEST: Break_IA sistema de alertas funcionando correctamente!';
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Mensaje enviado exitosamente!');
      console.log(`📧 ID del mensaje: ${result.result.message_id}`);
    } else {
      console.log(`❌ Error enviando mensaje: ${result.description}`);
      console.log(`🔍 Error code: ${result.error_code}`);
      
      if (result.error_code === 403) {
        console.log('🚨 El bot no puede enviar mensajes. Posibles causas:');
        console.log('   - El usuario no ha iniciado conversación con el bot');
        console.log('   - El bot fue bloqueado');
        console.log('   - Chat ID incorrecto');
      }
    }
    
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
}

testTelegramBot();