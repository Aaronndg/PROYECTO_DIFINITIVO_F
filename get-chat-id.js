// Script para obtener Chat ID del nuevo bot
const NEW_BOT_TOKEN = '8561666551:AAHP8AWktwZ58V_y5_cDESeMYuRCuC6ZpmQ';

async function getChatId() {
  console.log('🔍 Obteniendo Chat ID del nuevo bot...');
  console.log('📱 Primero: Ve a Telegram y busca tu nuevo bot');
  console.log('💬 Envía cualquier mensaje al bot (ej: "Hola")');
  console.log('⏳ Luego presiona Enter aquí para continuar...');
  
  // Esperar a que el usuario envíe mensaje
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });
  
  try {
    console.log('\n🔎 Buscando tu mensaje...');
    
    const response = await fetch(`https://api.telegram.org/bot${NEW_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      const latestMessage = data.result[data.result.length - 1];
      const chatId = latestMessage.message.chat.id;
      const userName = latestMessage.message.from.first_name;
      
      console.log('\n✅ ¡Chat ID encontrado!');
      console.log(`👤 Usuario: ${userName}`);
      console.log(`🆔 Chat ID: ${chatId}`);
      console.log('\n📋 Copia este Chat ID para configurar n8n');
      
    } else {
      console.log('❌ No se encontraron mensajes.');
      console.log('🔄 Asegúrate de haber enviado un mensaje al bot primero.');
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

getChatId();