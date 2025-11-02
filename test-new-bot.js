// Test con el nuevo bot
const NEW_BOT_TOKEN = '8561666551:AAHP8AWktwZ58V_y5_cDESeMYuRCuC6ZpmQ';
const CHAT_ID = '6310843918';

async function testNewBot() {
  console.log('🤖 Probando nuevo bot directamente...');
  
  try {
    const message = '🧪 TEST NUEVO BOT - Break_IA funcionando con bot actualizado!';
    
    const response = await fetch(`https://api.telegram.org/bot${NEW_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ ¡Nuevo bot funciona! Mensaje enviado exitosamente');
      console.log('📱 Revisa tu Telegram');
    } else {
      console.log(`❌ Error: ${result.description}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testNewBot();