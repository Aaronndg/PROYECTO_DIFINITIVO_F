# 🚀 Configuración de Base de Datos Supabase para Break_IA

## 📋 Pasos para Configurar la Base de Datos

### 1. Accede a tu proyecto de Supabase
- Ve a: https://rxsbiyjxilersrylukcj.supabase.co
- O accede desde: https://app.supabase.com/project/rxsbiyjxilersrylukcj

### 2. Habilitar extensión pgvector
```sql
-- En SQL Editor de Supabase, ejecutar:
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Ejecutar el script de configuración principal
Ve al **SQL Editor** en Supabase y ejecuta el siguiente script:

```sql
-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de tests emocionales
CREATE TABLE IF NOT EXISTS emotional_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    emotional_state INTEGER CHECK (emotional_state >= 1 AND emotional_state <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    spiritual_state INTEGER CHECK (spiritual_state >= 1 AND spiritual_state <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    mood_description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    summary TEXT,
    emotion_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_user BOOLEAN NOT NULL DEFAULT true,
    emotion_analysis JSONB,
    contextual_verses JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de versículos bíblicos con vectores
CREATE TABLE IF NOT EXISTS biblical_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(100) NOT NULL,
    text_rv60 TEXT NOT NULL,
    text_ntv TEXT,
    emotion_tags TEXT[] DEFAULT '{}',
    category VARCHAR(50) DEFAULT 'general',
    theme VARCHAR(100),
    embedding VECTOR(1536), -- Para OpenAI embeddings
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de progreso del usuario
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    week_start DATE,
    emotional_wellbeing_avg DECIMAL(3,2),
    spiritual_growth_score DECIMAL(3,2),
    prayer_consistency INTEGER DEFAULT 0,
    bible_study_time INTEGER DEFAULT 0, -- minutos
    chat_sessions_count INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    goals_completed INTEGER DEFAULT 0,
    goals_total INTEGER DEFAULT 6,
    insights JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_biblical_verses_emotion_tags ON biblical_verses USING GIN(emotion_tags);
CREATE INDEX IF NOT EXISTS idx_biblical_verses_category ON biblical_verses(category);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_tests_user_id ON emotional_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_tests_created_at ON emotional_tests(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Función para búsqueda de versículos similares usando vectores
CREATE OR REPLACE FUNCTION match_verses(
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
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    reference,
    text_rv60,
    text_ntv,
    emotion_tags,
    category,
    1 - (biblical_verses.embedding <=> query_embedding) AS similarity
  FROM biblical_verses
  WHERE 1 - (biblical_verses.embedding <=> query_embedding) > match_threshold
  ORDER BY biblical_verses.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar el trigger a las tablas que lo necesitan
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biblical_verses_updated_at BEFORE UPDATE ON biblical_verses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Configurar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas de seguridad para emotional_tests
CREATE POLICY "Users can view own tests" ON emotional_tests FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = emotional_tests.user_id));
CREATE POLICY "Users can insert own tests" ON emotional_tests FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = emotional_tests.user_id));

-- Políticas de seguridad para chat_sessions
CREATE POLICY "Users can view own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));
CREATE POLICY "Users can insert own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));
CREATE POLICY "Users can update own sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));

-- Políticas de seguridad para chat_messages
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_messages.user_id));
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_messages.user_id));

-- Políticas de seguridad para user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));

-- Los versículos bíblicos son públicos (solo lectura para usuarios)
CREATE POLICY "Anyone can view verses" ON biblical_verses FOR SELECT TO authenticated USING (true);
```

### 4. Insertar datos de versículos de ejemplo
```sql
-- Insertar versículos bíblicos de ejemplo
INSERT INTO biblical_verses (reference, text_rv60, text_ntv, emotion_tags, category) VALUES
('Filipenses 4:6-7', 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.', ARRAY['ansiedad', 'preocupación', 'paz', 'oración'], 'paz'),

('Salmo 23:1-3', 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará. Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre.', 'El Señor es mi pastor; tengo todo lo que necesito. En verdes prados me deja descansar; me conduce junto a arroyos tranquilos. Él renueva mis fuerzas. Me guía por sendas correctas, y así da honra a su nombre.', ARRAY['confianza', 'paz', 'protección', 'descanso'], 'confianza'),

('Jeremías 29:11', 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.', ARRAY['esperanza', 'futuro', 'planes', 'confianza'], 'esperanza'),

('Proverbios 3:5-6', 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.', 'Confía en el Señor con todo tu corazón; no dependas de tu propio entendimiento. Busca su voluntad en todo lo que hagas, y él te mostrará cuál camino tomar.', ARRAY['confianza', 'sabiduría', 'dirección', 'guía'], 'sabiduría'),

('Salmo 34:18', 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.', 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.', ARRAY['tristeza', 'dolor', 'consolación', 'sanidad'], 'consolación'),

('Isaías 41:10', 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.', ARRAY['miedo', 'fortaleza', 'ayuda', 'apoyo'], 'fortaleza'),

('Romanos 8:28', 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.', ARRAY['esperanza', 'propósito', 'confianza', 'bien'], 'esperanza'),

('Mateo 11:28', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', 'Luego dijo Jesús: «Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso.', ARRAY['cansancio', 'carga', 'descanso', 'alivio'], 'descanso');
```

### 5. Verificar que todo esté funcionando
```sql
-- Verificar que las tablas se crearon correctamente
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verificar que los versículos se insertaron
SELECT reference, emotion_tags FROM biblical_verses LIMIT 5;

-- Verificar que la función de búsqueda existe
SELECT proname FROM pg_proc WHERE proname = 'match_verses';
```

## 🔑 Obtener Service Role Key

1. Ve a **Settings** > **API** en tu proyecto de Supabase
2. Copia el **service_role key** (no el anon key)
3. Actualiza tu `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## ✅ Una vez configurado

Después de ejecutar estos scripts, tu aplicación Break_IA estará completamente funcional con:
- ✅ Base de datos PostgreSQL con extensión pgvector
- ✅ Tablas para usuarios, chat, tests y versículos
- ✅ Sistema de búsqueda vectorial
- ✅ Políticas de seguridad (RLS)
- ✅ Datos de ejemplo listos para usar

¡Tu aplicación estará lista para usar el sistema RAG completo! 🚀