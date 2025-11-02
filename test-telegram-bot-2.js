// Test #2 del bot de Telegram
const TELEGRAM_BOT_TOKEN = '8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY';
const CHAT_ID = '6310843918';

async function testTelegramBot2() {
  console.log('🔄 Enviando segundo mensaje de prueba...');
  
  try {
    const message = `🧪 TEST #2: ${new Date().toLocaleTimeString('es-ES')}
    
✅ Bot de Telegram funcionando
📱 Chat ID: ${CHAT_ID} confirmado
🤖 Preparado para recibir alertas de Break_IA`;
    
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
      console.log('✅ Segundo mensaje enviado exitosamente!');
      console.log(`📧 ID del mensaje: ${result.result.message_id}`);
      console.log('📱 Revisa tu Telegram ahora...');
    } else {
      console.log(`❌ Error: ${result.description}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testTelegramBot2();