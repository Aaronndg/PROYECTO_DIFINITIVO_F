-- =========================================
-- VERSÍCULOS BÍBLICOS ORGANIZADOS POR EMOCIONES
-- Base de datos completa para el sistema RAG
-- =========================================

-- VERSÍCULOS PARA ANSIEDAD Y PREOCUPACIÓN
INSERT INTO biblical_verses (reference, text_rv60, text_ntv, emotion_tags, category) VALUES
('Mateo 6:26', 'Mirad las aves del cielo, que no siembran, ni siegan, ni recogen en graneros; y vuestro Padre celestial las alimenta. ¿No valéis vosotros mucho más que ellas?', 'Miren los pájaros. No plantan ni cosechan ni guardan comida en graneros, porque el Padre celestial los alimenta. ¿Y no son ustedes para él mucho más valiosos que ellos?', ARRAY['ansiedad', 'valor', 'cuidado'], 'paz'),

('Mateo 6:34', 'Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. Basta a cada día su propio mal.', 'Por lo tanto, no se preocupen por el mañana, porque el día de mañana traerá sus propias preocupaciones. Los problemas del día de hoy son suficientes por hoy.', ARRAY['ansiedad', 'presente', 'futuro'], 'paz'),

('Proverbios 3:5-6', 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.', 'Confía en el Señor con todo tu corazón, no dependas de tu propio entendimiento. Busca su voluntad en todo lo que hagas, y él te mostrará cuál camino tomar.', ARRAY['confianza', 'dirección', 'sabiduría'], 'guía'),

-- VERSÍCULOS PARA TRISTEZA Y DOLOR
('Salmo 30:5', 'Porque un momento será su ira, Pero su favor dura toda la vida; Por la noche durará el lloro, Y a la mañana vendrá la alegría.', 'Pues su ira dura solo un instante, ¡pero su favor dura toda la vida! El llanto podrá durar toda la noche, pero con la mañana llega la alegría.', ARRAY['tristeza', 'esperanza', 'gozo'], 'esperanza'),

('Salmo 147:3', 'El sana a los quebrantados de corazón, Y venda sus heridas.', 'Él sana a los de corazón quebrantado y les venda las heridas.', ARRAY['tristeza', 'sanidad', 'dolor'], 'sanidad'),

('Isaías 61:3', 'A ordenar que a los afligidos de Sion se les dé gloria en lugar de ceniza, óleo de gozo en lugar de luto, manto de alegría en lugar del espíritu angustiado; y serán llamados árboles de justicia, plantío de Jehová, para gloria suya.', 'A todos los que se lamentan en Israel les dará una corona de belleza en lugar de cenizas, una gozosa bendición en lugar de luto, una festiva alabanza en lugar de desesperación. Ellos, en su justicia, serán como grandes robles que el Señor ha plantado para su propia gloria.', ARRAY['tristeza', 'transformación', 'belleza'], 'restauración'),

-- VERSÍCULOS PARA MIEDO
('Josué 1:9', 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', '¡Sé fuerte y valiente! No tengas miedo ni te desanimes, porque el Señor tu Dios está contigo dondequiera que vayas.', ARRAY['miedo', 'valentía', 'presencia'], 'fortaleza'),

('Salmo 27:1', 'Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?', 'El Señor es mi luz y mi salvación, ¿a quién temeré? El Señor protege mi vida, ¿de quién podré tener miedo?', ARRAY['miedo', 'protección', 'luz'], 'protección'),

('2 Timoteo 1:7', 'Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.', 'Pues Dios no nos ha dado un espíritu de temor y timidez sino de poder, amor y autodisciplina.', ARRAY['miedo', 'poder', 'amor'], 'fortaleza'),

-- VERSÍCULOS PARA IRA Y ENOJO
('Efesios 4:26', 'Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo.', 'Y no pequen al dejar que el enojo los controle. No permitan que el sol se ponga mientras siguen enojados.', ARRAY['ira', 'control', 'perdón'], 'autocontrol'),

('Proverbios 15:1', 'La blanda respuesta quita la ira; Mas la palabra áspera hace subir el furor.', 'La respuesta apacible desvía el enojo, pero las palabras ásperas encienden los ánimos.', ARRAY['ira', 'respuesta', 'paz'], 'sabiduría'),

('Santiago 1:19-20', 'Por esto, mis amados hermanos, todo hombre sea pronto para oír, tardo para hablar, tardo para airarse; porque la ira del hombre no obra la justicia de Dios.', 'Entiendan esto, mis amados hermanos: sean lentos para hablar, lentos para enojarse, porque el enojo humano no produce la rectitud que Dios desea.', ARRAY['ira', 'paciencia', 'justicia'], 'autocontrol'),

-- VERSÍCULOS PARA SOLEDAD
('Hebreos 13:5', 'Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.', 'No amen el dinero; estén contentos con lo que tienen, pues Dios ha dicho: «Nunca te fallaré. Jamás te abandonaré».', ARRAY['soledad', 'presencia', 'fidelidad'], 'compañía'),

('Salmo 68:6', 'Dios hace habitar en familia a los desamparados; Saca a los cautivos a prosperidad; Mas los rebeldes habitan en tierra seca.', 'Dios ubica a los solitarios en familias; libera a los prisioneros y los llena de alegría. Pero a los rebeldes los deja vivir en una tierra reseca.', ARRAY['soledad', 'familia', 'comunidad'], 'pertenencia'),

('Isaías 43:2', 'Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás, ni la llama arderá en ti.', 'Cuando pases por aguas profundas, yo estaré contigo. Cuando pases por ríos de dificultad, no te ahogarás. Cuando pases por el fuego de la opresión, no te quemarás; las llamas no te consumirán.', ARRAY['soledad', 'presencia', 'protección'], 'compañía'),

-- VERSÍCULOS PARA ALEGRÍA Y GRATITUD
('Nehemías 8:10', 'Luego les dijo: Id, comed grosuras, y bebed vino dulce, y enviad porciones a los que no tienen nada preparado; porque día santo es a nuestro Señor; no os entristezcáis, porque el gozo de Jehová es vuestra fortaleza.', 'Y Nehemías continuó: «Vayan y disfruten de comidas selectas y bebidas dulces, y obsequien porciones de comida a quienes no tengan nada preparado. Este es un día sagrado delante de nuestro Señor. ¡No se entristezcan, porque el gozo del Señor es su fuerza!».', ARRAY['alegría', 'fortaleza', 'celebración'], 'gozo'),

('Salmo 126:3', 'Grandes cosas ha hecho Jehová con nosotros; Estaremos alegres.', 'Sí, el Señor ha hecho cosas maravillosas por nosotros. ¡Qué alegría!', ARRAY['alegría', 'gratitud', 'grandeza'], 'gratitud'),

('1 Tesalonicenses 5:16-18', 'Estad siempre gozosos. Orad sin cesar. Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.', 'Estén siempre alegres. Nunca dejen de orar. Sean agradecidos en toda circunstancia, pues esta es la voluntad de Dios para ustedes, los que pertenecen a Cristo Jesús.', ARRAY['alegría', 'gratitud', 'oración'], 'gratitud'),

-- VERSÍCULOS PARA ESPERANZA
('Romanos 15:13', 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.', 'Pido a Dios, fuente de esperanza, que los llene completamente de alegría y paz, porque confían en él. Entonces rebosarán de esperanza confiada por el poder del Espíritu Santo.', ARRAY['esperanza', 'gozo', 'paz'], 'esperanza'),

('Lamentaciones 3:22-23', 'Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.', 'El fiel amor del Señor nunca se acaba; sus misericordias jamás terminan. Grande es su fidelidad; sus misericordias son nuevas cada mañana.', ARRAY['esperanza', 'fidelidad', 'misericordia'], 'fidelidad'),

('Isaías 40:31', 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', 'Pero los que confían en el Señor encontrarán nuevas fuerzas; volarán alto, como las águilas. Correrán y no se cansarán; caminarán y no desmayarán.', ARRAY['esperanza', 'fortaleza', 'renovación'], 'fortaleza'),

-- VERSÍCULOS PARA AMOR Y RELACIONES
('1 Corintios 13:4-5', 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece; no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor.', 'El amor es paciente y bondadoso. El amor no es celoso ni fanfarrón ni orgulloso ni ofensivo. No exige que las cosas se hagan a su manera. No se irrita ni lleva un registro de las ofensas recibidas.', ARRAY['amor', 'paciencia', 'bondad'], 'amor'),

('1 Juan 4:18', 'En el amor no hay temor, sino que el perfecto amor echa fuera el temor; porque el temor lleva en sí castigo. De donde el que teme, no ha sido perfeccionado en el amor.', 'Un amor así no tiene temor, porque el amor perfecto expulsa todo temor. Si tenemos miedo, es por temor al castigo, y esto muestra que no hemos experimentado plenamente el perfecto amor de Dios.', ARRAY['amor', 'temor', 'perfección'], 'amor'),

-- VERSÍCULOS PARA PERDÓN
('Efesios 4:32', 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.', 'Por el contrario, sean amables unos con otros, sean de buen corazón, y perdónense unos a otros, tal como Dios los ha perdonado a ustedes por medio de Cristo.', ARRAY['perdón', 'bondad', 'misericordia'], 'perdón'),

('Colosenses 3:13', 'Soportándoos unos a otros, y perdonándoos unos a otros si alguno tuviere queja contra otro. De la manera que Cristo os perdonó, así también hacedlo vosotros.', 'Sean comprensivos con las faltas de los demás y perdonen a todo el que los ofenda. Recuerden que el Señor los perdonó a ustedes, así que ustedes deben perdonar a otros.', ARRAY['perdón', 'comprensión', 'ejemplo'], 'perdón'),

-- VERSÍCULOS PARA CONFUSIÓN Y DIRECCIÓN
('Proverbios 16:9', 'El corazón del hombre piensa su camino; Mas Jehová endereza sus pasos.', 'Podemos hacer nuestros planes, pero el Señor determina nuestros pasos.', ARRAY['confusión', 'planes', 'dirección'], 'guía'),

('Salmo 32:8', 'Te haré entender, y te enseñaré el camino en que debes andar; Sobre ti fijaré mis ojos.', 'El Señor dice: «Te guiaré por el mejor sendero para tu vida; te aconsejaré y velaré por ti.', ARRAY['confusión', 'enseñanza', 'guía'], 'guía'),

('Isaías 30:21', 'Entonces tus oídos oirán a tus espaldas palabra que diga: Este es el camino, andad por él; y no echéis a la mano derecha, ni tampoco torzáis a la mano izquierda.', 'Tus propios oídos lo escucharán. Detrás de ti, una voz dirá: «Este es el camino por donde debes ir», ya sea a la derecha o a la izquierda.', ARRAY['confusión', 'voz', 'camino'], 'guía')

ON CONFLICT (reference) DO NOTHING;