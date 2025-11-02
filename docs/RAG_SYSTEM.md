# 🤖 Sistema RAG (Retrieval-Augmented Generation) - Break_IA

## 📋 Descripción del Sistema

El sistema RAG de Break_IA combina **búsqueda semántica vectorial** con **inteligencia artificial** para proporcionar respuestas bíblicas contextualizadas y relevantes basadas en las emociones y necesidades específicas del usuario.

## 🏗️ Arquitectura del Sistema

```
Usuario → Input Emocional → Análisis IA → Embedding → Búsqueda Vectorial → Versículos Relevantes → IA Contextualizada → Respuesta Final
```

### Componentes Principales:

1. **Generación de Embeddings** (`embeddings.ts`)
2. **Base de Datos Vectorial** (Supabase + pgvector)
3. **Análisis Contextual** (OpenAI GPT-4)
4. **Búsqueda Semántica** (Función `match_verses`)
5. **Síntesis Inteligente** (Combinación de datos + IA)

## 🔧 Funcionalidades del Sistema RAG

### 1. Búsqueda Semántica de Versículos

```typescript
// Buscar versículos relacionados con una consulta específica
const verses = await searchSimilarVerses(
  "me siento muy triste y necesito esperanza",
  "tristeza",
  0.75, // threshold de similitud
  5     // número de resultados
)
```

**Características:**
- ✅ Búsqueda por significado, no solo palabras clave
- ✅ Combinación de texto libre + emociones específicas
- ✅ Threshold configurable de similitud
- ✅ Fallback a búsqueda tradicional si falla

### 2. Análisis Contextual Emocional

```typescript
// Obtener versículos contextualizados para una situación específica
const {verses, searchQuery, emotionalInsight} = await getContextualVerses(
  "Mi matrimonio está pasando por una crisis",
  "ansiedad",
  userHistory
)
```

**Proceso:**
1. **Análisis de mensaje**: Extrae emociones, temas y palabras clave
2. **Optimización de búsqueda**: Genera query optimizada para vectores
3. **Búsqueda inteligente**: Encuentra versículos más relevantes
4. **Insight emocional**: Proporciona contexto pastoral

### 3. Mejora de Respuestas de IA

```typescript
// Mejorar respuesta de IA con versículos contextuales
const enhancedResponse = await enhanceAIResponseWithVerses(
  originalAIResponse,
  contextualVerses
)
```

**Beneficios:**
- ✅ Respuestas más ricas y fundamentadas bíblicamente
- ✅ Integración natural de versículos relevantes
- ✅ Mantiene tono pastoral y empático
- ✅ Evita repetición innecesaria de versículos

## 🗄️ Estructura de Datos Vectoriales

### Tabla `biblical_verses`

```sql
CREATE TABLE biblical_verses (
    id UUID PRIMARY KEY,
    reference VARCHAR(100) NOT NULL,
    text_rv60 TEXT NOT NULL,
    text_ntv TEXT,
    emotion_tags TEXT[],
    category VARCHAR(50),
    embedding VECTOR(1536), -- OpenAI embeddings
    created_at TIMESTAMP
);
```

### Función de Búsqueda Vectorial

```sql
CREATE FUNCTION match_verses(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    reference VARCHAR(100),
    text_rv60 TEXT,
    text_ntv TEXT,
    emotion_tags TEXT[],
    category VARCHAR(50),
    similarity FLOAT
)
```

## 🔍 Ejemplos de Uso

### Ejemplo 1: Búsqueda por Emoción Específica

**Input del Usuario:**
```
"Me siento completamente abrumado por el trabajo y no sé cómo manejar tanto estrés"
```

**Procesamiento RAG:**
1. **Análisis emocional**: Detecta "estrés", "abrumado", "trabajo"
2. **Query optimizada**: "estrés trabajo abrumado carga ansiedad"
3. **Búsqueda vectorial**: Encuentra versículos sobre cargas, estrés, trabajo
4. **Resultado**: Salmo 55:22, Mateo 11:28, Filipenses 4:6-7

### Ejemplo 2: Situación Relacional

**Input del Usuario:**
```
"Tengo problemas para perdonar a alguien que me lastimó profundamente"
```

**Procesamiento RAG:**
1. **Análisis**: "perdón", "lastimado", "relaciones", "dolor"
2. **Versículos encontrados**: Efesios 4:32, Colosenses 3:13, Mateo 6:14-15
3. **Respuesta mejorada**: IA + versículos + aplicación práctica

### Ejemplo 3: Crisis de Fe

**Input del Usuario:**
```
"Siento que Dios no me escucha y que mis oraciones no tienen sentido"
```

**Procesamiento RAG:**
1. **Análisis**: "duda", "oración", "silencio de Dios", "fe"
2. **Versículos contextuales**: Salmo 13, Salmo 27:14, Hebreos 11:1
3. **Insight pastoral**: Comprensión + esperanza + dirección

## 📊 Métricas de Efectividad

### Threshold de Similitud Recomendados:

- **0.85+**: Coincidencia muy alta (uso en respuestas automáticas)
- **0.75-0.84**: Coincidencia alta (uso en sugerencias principales)
- **0.65-0.74**: Coincidencia moderada (uso en opciones adicionales)
- **<0.65**: Baja relevancia (filtrar)

### Optimizaciones Implementadas:

- ✅ **Cache de embeddings**: Evita regeneración innecesaria
- ✅ **Fallback inteligente**: Búsqueda tradicional si falla vectorial
- ✅ **Límites configurables**: Control de rendimiento y costos
- ✅ **Análisis contextual**: Mejora relevancia de resultados

## 🚀 Configuración y Uso

### 1. Variables de Entorno Necesarias

```env
OPENAI_API_KEY=tu-openai-api-key
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 2. Generar Embeddings Iniciales

```bash
npm run generate-embeddings
```

### 3. Verificar Funcionamiento

```bash
# Test de búsqueda vectorial
curl -X GET "http://localhost:3000/api/verses?query=necesito%20paz&emotion=ansiedad"

# Test de chat con RAG
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "me siento muy triste", "userId": "test", "emotionalContext": "tristeza"}'
```

## 🎯 Casos de Uso Principales

### 1. Chat Consejería IA
- Usuario comparte situación emocional
- RAG encuentra versículos relevantes
- IA genera respuesta pastoral contextualizada

### 2. Búsqueda Inteligente de Versículos
- Usuario busca por situación específica
- Sistema entiende contexto emocional
- Retorna versículos ordenados por relevancia

### 3. Recomendaciones Automáticas
- Basado en tests emocionales diarios
- Análisis de patrones de usuario
- Sugerencias personalizadas de versículos

### 4. Análisis de Progreso Espiritual
- Tracking de temas recurrentes en chat
- Identificación de áreas de crecimiento
- Recomendaciones de estudio bíblico

## 🔮 Evoluciones Futuras

### Fase 2: RAG Avanzado
- [ ] Análisis de sentimientos en tiempo real
- [ ] Personalización basada en historial
- [ ] Detección de crisis emocionales
- [ ] Recomendaciones proactivas

### Fase 3: RAG Comunitario
- [ ] Compartir versículos efectivos entre usuarios
- [ ] Análisis de efectividad de respuestas
- [ ] Aprendizaje colectivo del sistema
- [ ] Insights pastorales automáticos

## 🏆 Beneficios del Sistema RAG

### Para Usuarios:
- ✅ **Respuestas más relevantes** a situaciones específicas
- ✅ **Consejería personalizada** basada en necesidades reales
- ✅ **Descubrimiento inteligente** de versículos aplicables
- ✅ **Acompañamiento continuo** en el crecimiento espiritual

### Para el Sistema:
- ✅ **Escalabilidad inteligente** sin intervención manual
- ✅ **Mejora continua** basada en interacciones
- ✅ **Eficiencia computacional** con búsquedas precisas
- ✅ **Integración natural** de múltiples fuentes de datos

¡El sistema RAG de Break_IA representa el futuro de la consejería cristiana digital! 🚀✨