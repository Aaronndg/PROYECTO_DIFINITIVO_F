-- =========================================
-- BREAK_IA DATABASE SETUP
-- Configuración completa de la base de datos
-- =========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =========================================
-- TABLA DE USUARIOS
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    emotional_state VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

-- =========================================
-- TABLA DE VERSÍCULOS BÍBLICOS
-- =========================================
CREATE TABLE IF NOT EXISTS biblical_verses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference VARCHAR(100) NOT NULL,
    text_rv60 TEXT NOT NULL,
    text_ntv TEXT,
    emotion_tags TEXT[] DEFAULT '{}',
    category VARCHAR(50) DEFAULT 'general',
    embedding VECTOR(1536), -- OpenAI embeddings dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice vectorial para búsqueda semántica
CREATE INDEX IF NOT EXISTS biblical_verses_embedding_idx 
ON biblical_verses USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- =========================================
-- TABLA DE TESTS EMOCIONALES
-- =========================================
CREATE TABLE IF NOT EXISTS emotional_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    notes TEXT,
    recommendations TEXT[],
    predominant_emotion VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar múltiples tests en el mismo día
    UNIQUE(user_id, test_date)
);

-- =========================================
-- TABLA DE MENSAJES DE CHAT
-- =========================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    emotion_context VARCHAR(50),
    biblical_references TEXT[],
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID -- Para agrupar conversaciones
);

-- =========================================
-- TABLA DE CONFIGURACIÓN DE TELEGRAM
-- =========================================
CREATE TABLE IF NOT EXISTS user_telegram (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chat_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notification_settings JSONB DEFAULT '{
        "daily_verse": true,
        "test_reminder": true,
        "emotional_support": true,
        "progress_updates": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, chat_id)
);

-- =========================================
-- TABLA DE PROGRESO DEL USUARIO
-- =========================================
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_count INTEGER DEFAULT 0,
    average_mood DECIMAL(3,2),
    improvement_trend VARCHAR(20) CHECK (improvement_trend IN ('positive', 'negative', 'stable')),
    last_test_date DATE,
    favorite_verses UUID[],
    achievements TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =========================================
-- FUNCIÓN PARA BÚSQUEDA VECTORIAL
-- =========================================
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
        biblical_verses.id,
        biblical_verses.reference,
        biblical_verses.text_rv60,
        biblical_verses.text_ntv,
        biblical_verses.emotion_tags,
        biblical_verses.category,
        1 - (biblical_verses.embedding <=> query_embedding) AS similarity
    FROM biblical_verses
    WHERE 1 - (biblical_verses.embedding <=> query_embedding) > match_threshold
    ORDER BY biblical_verses.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- =========================================
-- FUNCIONES DE TRIGGERS PARA UPDATED_AT
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a las tablas que necesitan updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biblical_verses_updated_at BEFORE UPDATE ON biblical_verses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_telegram_updated_at BEFORE UPDATE ON user_telegram
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- FUNCIÓN PARA ACTUALIZAR PROGRESO DEL USUARIO
-- =========================================
CREATE OR REPLACE FUNCTION update_user_progress_after_test()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress (user_id, test_count, average_mood, last_test_date)
    VALUES (NEW.user_id, 1, NEW.mood_score, NEW.test_date)
    ON CONFLICT (user_id) DO UPDATE SET
        test_count = user_progress.test_count + 1,
        average_mood = (
            SELECT AVG(mood_score)::DECIMAL(3,2)
            FROM emotional_tests
            WHERE user_id = NEW.user_id
        ),
        last_test_date = NEW.test_date,
        improvement_trend = (
            CASE 
                WHEN NEW.mood_score > (
                    SELECT mood_score 
                    FROM emotional_tests 
                    WHERE user_id = NEW.user_id 
                      AND test_date < NEW.test_date 
                    ORDER BY test_date DESC 
                    LIMIT 1
                ) + 1 THEN 'positive'
                WHEN NEW.mood_score < (
                    SELECT mood_score 
                    FROM emotional_tests 
                    WHERE user_id = NEW.user_id 
                      AND test_date < NEW.test_date 
                    ORDER BY test_date DESC 
                    LIMIT 1
                ) - 1 THEN 'negative'
                ELSE 'stable'
            END
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar progreso después de cada test
CREATE TRIGGER update_progress_after_test
    AFTER INSERT ON emotional_tests
    FOR EACH ROW EXECUTE FUNCTION update_user_progress_after_test();

-- =========================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =========================================
CREATE INDEX IF NOT EXISTS idx_emotional_tests_user_date ON emotional_tests(user_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_biblical_verses_emotions ON biblical_verses USING GIN(emotion_tags);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =========================================
-- POLÍTICAS RLS (Row Level Security)
-- =========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_telegram ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Política para usuarios (solo pueden ver y editar sus propios datos)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para tests emocionales
CREATE POLICY "Users can view own tests" ON emotional_tests
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own tests" ON emotional_tests
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Política para mensajes de chat
CREATE POLICY "Users can view own messages" ON chat_messages
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Los versículos bíblicos son públicos (solo lectura)
CREATE POLICY "Biblical verses are public" ON biblical_verses
    FOR SELECT TO PUBLIC USING (true);

-- =========================================
-- DATOS INICIALES - VERSÍCULOS BÍBLICOS
-- =========================================
INSERT INTO biblical_verses (reference, text_rv60, text_ntv, emotion_tags, category) VALUES
('Filipenses 4:6-7', 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.', ARRAY['ansiedad', 'paz', 'preocupación'], 'paz'),

('Salmo 34:18', 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.', 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.', ARRAY['tristeza', 'esperanza', 'dolor'], 'consuelo'),

('Salmo 118:24', 'Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.', 'Este es el día que hizo el Señor; nos gozaremos y nos alegraremos en él.', ARRAY['alegría', 'gratitud', 'gozo'], 'gozo'),

('Isaías 41:10', 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.', ARRAY['miedo', 'fortaleza', 'confianza'], 'fortaleza'),

('1 Pedro 5:7', 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.', 'Pongan todas sus preocupaciones y ansiedades en las manos de Dios, porque él cuida de ustedes.', ARRAY['ansiedad', 'cuidado', 'confianza'], 'paz'),

('Salmo 55:22', 'Echa sobre Jehová tu carga, y él te sustentará; No dejará para siempre caído al justo.', 'Entrega tus cargas al Señor, y él cuidará de ti; no permitirá que los justos tropiecen y caigan.', ARRAY['carga', 'apoyo', 'sustento'], 'fortaleza'),

('Romanos 8:28', 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.', ARRAY['esperanza', 'propósito', 'confianza'], 'esperanza'),

('Jeremías 29:11', 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.', ARRAY['esperanza', 'futuro', 'paz'], 'esperanza'),

('Mateo 11:28', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', 'Luego dijo Jesús: "Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso.', ARRAY['cansancio', 'descanso', 'invitación'], 'descanso'),

('2 Corintios 12:9', 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.', 'Cada vez él me dijo: «Mi gracia es todo lo que necesitas; mi poder actúa mejor en la debilidad». Así que ahora me alegra jactarme de mis debilidades, para que el poder de Cristo pueda actuar a través de mí.', ARRAY['debilidad', 'poder', 'gracia'], 'fortaleza')

ON CONFLICT (reference) DO NOTHING;

-- =========================================
-- USUARIOS DE PRUEBA
-- =========================================
INSERT INTO users (id, email, name, emotional_state) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'juan@ejemplo.com', 'Juan Pérez', 'esperanza'),
('550e8400-e29b-41d4-a716-446655440002', 'maria@ejemplo.com', 'María González', 'paz')
ON CONFLICT (email) DO NOTHING;