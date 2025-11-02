# 🚂 Variables de Entorno para n8n en Railway

## 📋 Variables que debes configurar en Railway

### Variables Básicas de n8n
```
N8N_HOST=0.0.0.0
N8N_PORT=8080
N8N_PROTOCOL=https
N8N_EDITOR_BASE_URL=https://n8n-production-020f.up.railway.app
WEBHOOK_URL=https://n8n-production-020f.up.railway.app
```

### Autenticación n8n
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=Break_IA_2024!
```

### Base de Datos (Opcional - Railway PostgreSQL)
```
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${{Postgres.PGHOST}}
DB_POSTGRESDB_PORT=${{Postgres.PGPORT}}
DB_POSTGRESDB_DATABASE=${{Postgres.PGDATABASE}}
DB_POSTGRESDB_USER=${{Postgres.PGUSER}}
DB_POSTGRESDB_PASSWORD=${{Postgres.PGPASSWORD}}
```

### Telegram Bot
```
TELEGRAM_BOT_TOKEN=8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY
ADMIN_CHAT_ID=TU_CHAT_ID_AQUI
```

### Break_IA Integration
```
BREAK_IA_WEBHOOK_SECRET=break-ia-webhook-2024
SUPABASE_URL=https://rxsbiyjxilersrylukcj.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4c2JpeWp4aWxlcnNyeWx1a2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNDE2OTYsImV4cCI6MjA3NzYxNzY5Nn0.VHg1ZdJgzY3yJLXf09O3NU_EeFQbKFKJYLEEsgtkq_Y
```

## 🔧 Pasos en Railway Dashboard

### 1. Configurar Variables
1. Ve a tu proyecto n8n en Railway
2. Click en "Variables"
3. Añade todas las variables de arriba
4. Deploy automático se ejecutará

### 2. Acceder a n8n
URL: https://n8n-production-020f.up.railway.app
Usuario: admin
Contraseña: Break_IA_2024!

### 3. Configurar Webhook
URL del webhook: https://n8n-production-020f.up.railway.app/webhook/break-ia-alert

## 📱 Obtener Chat ID de Telegram

1. Inicia conversación con tu bot:
   - Busca: @tu_bot_name
   - Envía: /start

2. Obtén Chat ID:
   - Ve a: https://api.telegram.org/bot8414956688:AAETMAvPOgbuuBLCRlwRTezgbkXfxe1XSVY/getUpdates
   - Busca "chat":{"id": TU_CHAT_ID
   - Copia el número

3. Actualiza variable ADMIN_CHAT_ID en Railway

## 🚀 Deployment
Una vez configuradas las variables, n8n se reiniciará automáticamente.