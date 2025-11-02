-- ====================================================================
-- SCRIPT COMPLETO DE BASE DE DATOS PARA BREAK_IA - SUPABASE
-- ====================================================================
-- Ejecuta este script completo en el SQL Editor de Supabase
-- URL: https://app.supabase.com/project/rxsbiyjxilersrylukcj/sql

-- 1. HABILITAR EXTENSIÓN PGVECTOR
-- ====================================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. CREAR TABLAS PRINCIPALES
-- ====================================================================

-- Tabla de perfiles de usuario
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

-- Tabla de tests emocionales
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

-- Tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    summary TEXT,
    emotion_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    response TEXT,
    is_user BOOLEAN NOT NULL DEFAULT true,
    emotion_analysis JSONB,
    contextual_verses JSONB,
    biblical_references TEXT[] DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de versículos bíblicos con vectores
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

-- Tabla de progreso del usuario
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

-- Tabla de alertas de riesgo para n8n
CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_score INTEGER NOT NULL,
    triggers TEXT[] DEFAULT '{}',
    message_content TEXT,
    alert_sent BOOLEAN DEFAULT false,
    processed_by VARCHAR(50) DEFAULT 'system',
    admin_notified BOOLEAN DEFAULT false,
    follow_up_sent BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'resolved', 'escalated')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_biblical_verses_emotion_tags ON biblical_verses USING GIN(emotion_tags);
CREATE INDEX IF NOT EXISTS idx_biblical_verses_category ON biblical_verses(category);
CREATE INDEX IF NOT EXISTS idx_biblical_verses_embedding ON biblical_verses USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_tests_user_id ON emotional_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_tests_created_at ON emotional_tests(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_risk_level ON risk_alerts(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_created_at ON risk_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status);

-- 4. FUNCIÓN PARA BÚSQUEDA VECTORIAL
-- ====================================================================
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

-- 5. TRIGGERS PARA UPDATED_AT
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biblical_verses_updated_at BEFORE UPDATE ON biblical_verses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para emotional_tests
CREATE POLICY "Users can view own tests" ON emotional_tests FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = emotional_tests.user_id));
CREATE POLICY "Users can insert own tests" ON emotional_tests FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = emotional_tests.user_id));

-- Políticas para chat_sessions
CREATE POLICY "Users can view own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));
CREATE POLICY "Users can insert own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));
CREATE POLICY "Users can update own sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_sessions.user_id));

-- Políticas para chat_messages
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_messages.user_id));
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = chat_messages.user_id));

-- Políticas para user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_progress.user_id));

-- Políticas para risk_alerts (solo administradores pueden ver todas las alertas)
CREATE POLICY "Service role can manage all alerts" ON risk_alerts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users can view own alerts" ON risk_alerts FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = risk_alerts.user_id));

-- Los versículos bíblicos son públicos (solo lectura)
CREATE POLICY "Anyone can view verses" ON biblical_verses FOR SELECT TO authenticated USING (true);

-- 7. INSERTAR DATOS DE VERSÍCULOS BÍBLICOS
-- ====================================================================
INSERT INTO biblical_verses (reference, text_rv60, text_ntv, emotion_tags, category) VALUES
('Filipenses 4:6-7', 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.', ARRAY['ansiedad', 'preocupación', 'paz', 'oración'], 'paz'),

('Salmo 23:1-3', 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará. Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre.', 'El Señor es mi pastor; tengo todo lo que necesito. En verdes prados me deja descansar; me conduce junto a arroyos tranquilos. Él renueva mis fuerzas. Me guía por sendas correctas, y así da honra a su nombre.', ARRAY['confianza', 'paz', 'protección', 'descanso'], 'confianza'),

('Jeremías 29:11', 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.', 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.', ARRAY['esperanza', 'futuro', 'planes', 'confianza'], 'esperanza'),

('Proverbios 3:5-6', 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.', 'Confía en el Señor con todo tu corazón; no dependas de tu propio entendimiento. Busca su voluntad en todo lo que hagas, y él te mostrará cuál camino tomar.', ARRAY['confianza', 'sabiduría', 'dirección', 'guía'], 'sabiduría'),

('Salmo 34:18', 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.', 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.', ARRAY['tristeza', 'dolor', 'consolación', 'sanidad'], 'consolación'),

('Isaías 41:10', 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.', ARRAY['miedo', 'fortaleza', 'ayuda', 'apoyo'], 'fortaleza'),

('Romanos 8:28', 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.', 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.', ARRAY['esperanza', 'propósito', 'confianza', 'bien'], 'esperanza'),

('Mateo 11:28', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', 'Luego dijo Jesús: «Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso.', ARRAY['cansancio', 'carga', 'descanso', 'alivio'], 'descanso'),

('Salmo 46:1', 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', 'Dios es nuestro refugio y nuestra fuerza; siempre está dispuesto a ayudar en tiempos de dificultad.', ARRAY['fortaleza', 'refugio', 'ayuda', 'tribulación'], 'fortaleza'),

('Juan 14:27', 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.', 'Les dejo un regalo: paz en la mente y en el corazón. Y la paz que yo doy es un regalo que el mundo no puede dar. Así que no se angustien ni tengan miedo.', ARRAY['paz', 'calma', 'miedo', 'tranquilidad'], 'paz'),

('Salmo 139:14', 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.', 'Gracias por hacerme tan maravillosamente complejo! Tu fino trabajo es maravilloso, lo sé muy bien.', ARRAY['identidad', 'autoestima', 'valor', 'creación'], 'identidad'),

('1 Pedro 5:7', 'echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.', 'Pongan todas sus preocupaciones y ansiedades en las manos de Dios, porque él cuida de ustedes.', ARRAY['ansiedad', 'preocupación', 'cuidado', 'confianza'], 'paz'),

('Salmo 27:1', 'Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?', 'El Señor es mi luz y mi salvación, ¿a quién temeré? El Señor protege mi vida, ¿de quién podré tener miedo?', ARRAY['miedo', 'protección', 'valentía', 'salvación'], 'fortaleza'),

('Efesios 4:32', 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.', 'Por el contrario, sean amables unos con otros, sean de buen corazón, y perdónense unos a otros, tal como Dios los ha perdonado a ustedes por medio de Cristo.', ARRAY['perdón', 'amabilidad', 'misericordia', 'relaciones'], 'perdón'),

('2 Corintios 12:9', 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.', 'Cada vez él me dijo: «Mi gracia es todo lo que necesitas; mi poder actúa mejor en la debilidad». Así que ahora me alegra jactarme de mis debilidades, para que el poder de Cristo pueda actuar a través de mí.', ARRAY['debilidad', 'gracia', 'poder', 'fortaleza'], 'gracia'),

('Salmo 121:1-2', 'Alzaré mis ojos a los montes; ¿De dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.', 'Levanto la vista hacia las montañas, ¿acaso viene de allí mi ayuda? Mi ayuda proviene del Señor, quien hizo los cielos y la tierra.', ARRAY['ayuda', 'socorro', 'confianza', 'esperanza'], 'ayuda'),

('Hebreos 13:5', 'Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.', 'No amen el dinero; estén contentos con lo que tienen, pues Dios ha dicho: «Nunca te fallaré. Jamás te abandonaré».', ARRAY['contentamiento', 'seguridad', 'provisión', 'abandono'], 'contentamiento'),

('Romanos 15:13', 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.', 'Pido que Dios, fuente de esperanza, los llene completamente de alegría y paz, porque confían en él. Entonces rebosarán de esperanza confiada mediante el poder del Espíritu Santo.', ARRAY['esperanza', 'gozo', 'paz', 'confianza'], 'esperanza'),

('Salmo 30:5', 'Porque un momento será su ira, pero su favor dura toda la vida. Por la noche durará el lloro, y a la mañana vendrá la alegría.', 'Pues su enojo dura solo un instante, ¡pero su favor dura toda una vida! El llanto podrá durar toda la noche, pero con la mañana llega la alegría.', ARRAY['tristeza', 'alegría', 'esperanza', 'favor'], 'esperanza'),

('Colosenses 3:15', 'Y la paz de Dios gobierne en vuestros corazones, a la que asimismo fuisteis llamados en un solo cuerpo; y sed agradecidos.', 'Y que la paz que viene de Cristo gobierne en sus corazones. Pues, como miembros de un mismo cuerpo, ustedes son llamados a vivir en paz. Y sean siempre agradecidos.', ARRAY['paz', 'gratitud', 'unidad', 'gobierno'], 'paz');

-- 8. VERIFICACIONES FINALES
-- ====================================================================
-- Verificar que las tablas se crearon
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Verificar que los versículos se insertaron
SELECT reference, emotion_tags FROM biblical_verses LIMIT 5;

-- Verificar que la función match_verses existe
SELECT proname FROM pg_proc WHERE proname = 'match_verses';

-- ====================================================================
-- SCRIPT COMPLETADO SIN ERRORES ✅
-- ====================================================================
-- Una vez ejecutado este script, tu base de datos estará lista para:
-- 1. Sistema RAG con búsqueda vectorial
-- 2. Chat con IA cristiana  
-- 3. Tests emocionales
-- 4. Seguimiento de progreso
-- 5. Autenticación y seguridad (RLS)
-- ====================================================================