# 🔧 Configuración de Supabase para Break_IA

## 📋 Prerequisitos

1. **Cuenta de Supabase**: Crear una cuenta gratuita en [supabase.com](https://supabase.com)
2. **OpenAI API Key**: Para generar embeddings vectoriales
3. **Node.js**: Versión 18 o superior

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una nueva cuenta
2. Crea un nuevo proyecto:
   - **Nombre**: `break-ia`
   - **Región**: Elige la más cercana a tu ubicación
   - **Plan**: Free (suficiente para desarrollo)
3. Espera a que el proyecto se inicialice (2-3 minutos)

### 2. Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Ejecuta el contenido del archivo `supabase/setup.sql`:
   - Copia todo el contenido del archivo
   - Pégalo en el SQL Editor
   - Haz clic en **Run**
3. Ejecuta el contenido del archivo `supabase/verses_data.sql`:
   - Copia todo el contenido del archivo
   - Pégalo en el SQL Editor
   - Haz clic en **Run**

### 3. Obtener Credenciales

1. Ve a **Settings > API** en tu proyecto de Supabase
2. Copia las siguientes credenciales:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY)

### 4. Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores placeholder:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# OpenAI API (para chat y embeddings)
OPENAI_API_KEY=tu-openai-api-key-aqui

# Telegram Bot (opcional por ahora)
TELEGRAM_BOT_TOKEN=tu-telegram-bot-token

# NextAuth
NEXTAUTH_SECRET=un-secreto-aleatorio-muy-seguro
NEXTAUTH_URL=http://localhost:3000
```

### 5. Generar Embeddings Vectoriales

Una vez configuradas las variables de entorno:

```bash
# Generar embeddings para todos los versículos
npm run generate-embeddings
```

Este proceso:
- ✅ Genera embeddings vectoriales para búsqueda semántica
- ✅ Habilita el sistema RAG (Retrieval-Augmented Generation)
- ✅ Permite búsquedas inteligentes por emociones

## 🧪 Verificar Configuración

### Verificar Conexión a Supabase
```bash
npm run dev
```

Ve a la aplicación y:
1. Haz login con `juan@ejemplo.com` / `password123`
2. Ve a la página de **Versículos**
3. Intenta filtrar por emociones
4. Si ves versículos, ¡la configuración es exitosa! ✅

### Verificar Sistema RAG
1. Ve a la página de **Versículos**
2. Usa la búsqueda con términos como:
   - "me siento triste"
   - "necesito paz"
   - "tengo miedo"
3. Deberías ver versículos relevantes ordenados por similitud

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **`users`**: Usuarios del sistema
- **`biblical_verses`**: Versículos bíblicos con embeddings vectoriales
- **`emotional_tests`**: Tests emocionales diarios
- **`chat_messages`**: Historial de conversaciones con IA
- **`user_telegram`**: Configuración de notificaciones Telegram
- **`user_progress`**: Progreso emocional de usuarios

### Funciones Especiales

- **`match_verses()`**: Búsqueda vectorial semántica
- **`update_user_progress_after_test()`**: Actualización automática de progreso

## 🔍 Sistema RAG (Retrieval-Augmented Generation)

El sistema RAG permite:

1. **Búsqueda Semántica**: Encuentra versículos relevantes usando embeddings
2. **Filtrado por Emociones**: Combina filtros tradicionales con IA
3. **Contexto Inteligente**: Proporciona versículos relevantes al chat IA

### Flujo RAG:
```
Usuario busca → Generar embedding → Búsqueda vectorial → Resultados relevantes
```

## 🛠️ Model Context Protocol (MCP)

MCP proporciona acceso estructurado a la base de datos:

### Configuración MCP:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["mcp-supabase-server.js"],
      "env": {
        "SUPABASE_URL": "tu-supabase-url",
        "SUPABASE_SERVICE_KEY": "tu-service-key"
      }
    }
  }
}
```

### Herramientas MCP Disponibles:
- `query_verses`: Buscar versículos por emoción/texto
- `get_user_progress`: Obtener progreso de usuario
- `get_emotional_tests`: Obtener tests emocionales
- `analyze_emotional_trend`: Analizar tendencias emocionales
- `search_chat_history`: Buscar en historial de chat

## 🔧 Troubleshooting

### Error: "Invalid supabaseUrl"
- ✅ Verifica que NEXT_PUBLIC_SUPABASE_URL esté correctamente configurado
- ✅ Asegúrate de que la URL comience con https://

### Error: "No se pueden cargar versículos"
- ✅ Ejecuta los scripts SQL en Supabase
- ✅ Verifica las credenciales de la API
- ✅ Confirma que las tablas existen

### Error: "Embeddings no funcionan"
- ✅ Configura OPENAI_API_KEY correctamente
- ✅ Ejecuta `npm run generate-embeddings`
- ✅ Verifica que tengas créditos en OpenAI

### La búsqueda no encuentra resultados
- ✅ Asegúrate de que los embeddings estén generados
- ✅ Verifica que la función `match_verses()` exista en Supabase
- ✅ Revisa la extensión `vector` esté habilitada

## 🎯 Siguiente Paso

Una vez configurado Supabase:
1. ✅ **Sistema RAG funcional**
2. ⏭️ **Configurar n8n para automatización**
3. ⏭️ **Crear bot de Telegram**
4. ⏭️ **Deploy en Vercel**

¡Tu base de datos está lista para soportar todas las funcionalidades de Break_IA! 🚀