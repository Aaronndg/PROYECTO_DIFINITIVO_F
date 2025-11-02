# 🚀 Break_IA - Configuración n8n desde Cero

## 📋 Guía Paso a Paso

### 1. 🌐 Crear Cuenta en n8n Cloud

1. Ve a: https://n8n.cloud
2. Haz clic en "Get started for free"
3. Registrate con tu email
4. Verifica tu cuenta
5. Tu URL será: `https://tu-cuenta.app.n8n.cloud`

### 2. 🔑 Configurar Credenciales

#### Bot de Telegram
- **Nombre**: Break_IA_Bot
- **Token**: `8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY`

#### Webhook URL
- **URL**: `https://tu-cuenta.app.n8n.cloud/webhook/break-ia-alert`

### 3. 📱 Configurar Bot de Telegram

1. Abre Telegram
2. Busca tu bot: `@tu_bot_name` 
3. Inicia conversación: `/start`
4. Obtén tu Chat ID enviando un mensaje y verificando con:
   ```
   https://api.telegram.org/bot8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY/getUpdates
   ```

### 4. 🔧 Crear Workflow en n8n

#### Paso 1: Webhook Trigger
1. Arrastra nodo "Webhook"
2. Configura:
   - HTTP Method: POST
   - Path: `break-ia-alert`
   - Respond: "Using Respond to Webhook Node"

#### Paso 2: Condition Node
1. Arrastra nodo "IF"
2. Conecta desde Webhook
3. Configura:
   - Condition: `{{ $json.riskLevel }} equals CRITICAL`

#### Paso 3: Telegram Node (Critical)
1. Arrastra nodo "Telegram"
2. Conecta desde "True" del IF
3. Configura:
   - Credentials: Tu bot token
   - Chat ID: Tu chat ID
   - Message: 
   ```
   🚨 **ALERTA CRÍTICA - Break_IA**
   
   👤 Usuario: {{ $json.userId }}
   📝 Mensaje: {{ $json.message }}
   ⚠️ Nivel: {{ $json.riskLevel }}
   📊 Score: {{ $json.score }}
   🎯 Triggers: {{ $json.triggers.join(', ') }}
   ⏰ Tiempo: {{ $json.timestamp }}
   
   **ACCIÓN REQUERIDA: Contacto inmediato**
   ```

#### Paso 4: Response Node
1. Arrastra nodo "Respond to Webhook"
2. Conecta desde Telegram
3. Response Body:
   ```json
   {
     "success": true,
     "message": "Alerta procesada correctamente",
     "processed_at": "{{ new Date().toISOString() }}"
   }
   ```

### 5. 🧪 Probar Workflow

#### Webhook de Prueba:
```bash
curl -X POST https://tu-cuenta.app.n8n.cloud/webhook/break-ia-alert \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "message": "Prueba de alerta crítica",
    "riskLevel": "CRITICAL", 
    "score": 25,
    "triggers": ["test", "critical"],
    "timestamp": "2025-11-02T07:00:00Z"
  }'
```

### 6. 🔗 Conectar con Break_IA

Actualizar `.env.local`:
```bash
N8N_WEBHOOK_URL=https://tu-cuenta.app.n8n.cloud/webhook/break-ia-alert
```

### 7. 📊 Workflow Completo

```
Webhook → IF (¿Crítico?) → Telegram Alert → Response
    ↓
IF (¿Alto?) → Telegram Warning → Log → Response
    ↓  
Log Low/Medium → Response
```

### 8. 🚨 Configuración de Alertas

#### CRITICAL (Score ≥ 20)
- Telegram inmediato
- Email a admin
- Log en base de datos
- Seguimiento en 5 min

#### HIGH (Score ≥ 15)
- Telegram a supervisor
- Log en base de datos
- Seguimiento en 24h

#### MEDIUM (Score ≥ 8)
- Log en base de datos
- Seguimiento en 48h

### 9. 📞 Líneas de Emergencia (España)

```
📞 EMERGENCIAS: 112
📞 Teléfono de la Esperanza: 91 459 00 50
📞 Línea Prevención Suicidio: 024
```

### 10. ✅ Checklist de Configuración

- [ ] Cuenta n8n creada
- [ ] Bot Telegram configurado
- [ ] Credenciales añadidas
- [ ] Webhook creado
- [ ] Workflow importado
- [ ] Prueba realizada
- [ ] Break_IA conectado
- [ ] Alertas funcionando

### 11. 🔧 Variables de Entorno n8n

Si usas Railway o self-hosted:
```bash
TELEGRAM_BOT_TOKEN=8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY
ADMIN_CHAT_ID=tu_chat_id_admin
WEBHOOK_SECRET=break-ia-secret-2024
```

### 12. 📱 Comandos Bot Telegram

- `/start` - Iniciar bot
- `/help` - Ayuda
- `/status` - Estado del sistema
- `/emergency` - Líneas de emergencia

¿Listo para empezar? ¡Dime cuál opción prefieres y comenzamos! 🚀