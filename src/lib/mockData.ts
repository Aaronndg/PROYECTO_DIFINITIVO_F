// Mock data para desarrollo local sin necesidad de Supabase
export const mockVerses = [
  {
    id: '1',
    reference: 'Filipenses 4:6-7',
    text_rv60: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
    text_ntv: 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.',
    emotion_tags: ['ansiedad', 'preocupación', 'paz', 'oración'],
    category: 'paz'
  },
  {
    id: '2',
    reference: 'Salmo 23:1-3',
    text_rv60: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará. Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre.',
    text_ntv: 'El Señor es mi pastor; tengo todo lo que necesito. En verdes prados me deja descansar; me conduce junto a arroyos tranquilos. Él renueva mis fuerzas. Me guía por sendas correctas, y así da honra a su nombre.',
    emotion_tags: ['confianza', 'paz', 'protección', 'descanso'],
    category: 'confianza'
  },
  {
    id: '3',
    reference: 'Jeremías 29:11',
    text_rv60: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    text_ntv: 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.',
    emotion_tags: ['esperanza', 'futuro', 'planes', 'confianza'],
    category: 'esperanza'
  },
  {
    id: '4',
    reference: 'Proverbios 3:5-6',
    text_rv60: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.',
    text_ntv: 'Confía en el Señor con todo tu corazón; no dependas de tu propio entendimiento. Busca su voluntad en todo lo que hagas, y él te mostrará cuál camino tomar.',
    emotion_tags: ['confianza', 'sabiduría', 'dirección', 'guía'],
    category: 'sabiduría'
  },
  {
    id: '5',
    reference: 'Salmo 34:18',
    text_rv60: 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.',
    text_ntv: 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.',
    emotion_tags: ['tristeza', 'dolor', 'consolación', 'sanidad'],
    category: 'consolación'
  },
  {
    id: '6',
    reference: 'Isaías 41:10',
    text_rv60: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    text_ntv: 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.',
    emotion_tags: ['miedo', 'fortaleza', 'ayuda', 'apoyo'],
    category: 'fortaleza'
  },
  {
    id: '7',
    reference: 'Romanos 8:28',
    text_rv60: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
    text_ntv: 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.',
    emotion_tags: ['esperanza', 'propósito', 'confianza', 'bien'],
    category: 'esperanza'
  },
  {
    id: '8',
    reference: 'Mateo 11:28',
    text_rv60: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
    text_ntv: 'Luego dijo Jesús: «Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso.',
    emotion_tags: ['cansancio', 'carga', 'descanso', 'alivio'],
    category: 'descanso'
  }
];

export const mockUsers = [
  {
    id: 'demo-user-1',
    email: 'usuario@demo.com',
    name: 'Usuario Demo',
    created_at: new Date().toISOString()
  }
];

export const mockChatSessions = [
  {
    id: 'session-1',
    user_id: 'demo-user-1',
    title: 'Conversación sobre ansiedad',
    created_at: new Date().toISOString()
  }
];

export const mockChatMessages = [
  {
    id: 'msg-1',
    session_id: 'session-1',
    content: 'Hola, me siento muy ansioso últimamente',
    is_user: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'msg-2',
    session_id: 'session-1',
    content: 'Entiendo tu preocupación. La ansiedad es algo muy común y Dios tiene palabras de paz para ti. Te recomiendo leer Filipenses 4:6-7: "Por nada estéis afanosos..." ¿Te gustaría que conversemos sobre qué específicamente te está causando ansiedad?',
    is_user: false,
    created_at: new Date().toISOString()
  }
];

export const mockEmotionalTests = [
  {
    id: 'test-1',
    user_id: 'demo-user-1',
    emotional_state: 6,
    stress_level: 4,
    spiritual_state: 7,
    notes: 'Me siento mejor después de orar',
    created_at: new Date().toISOString()
  }
];

// Función para buscar versículos por emoción (simulando búsqueda semántica)
export function searchMockVerses(query: string, emotion?: string) {
  let results = mockVerses;
  
  if (emotion) {
    results = results.filter(verse => 
      verse.emotion_tags.some(tag => 
        tag.toLowerCase().includes(emotion.toLowerCase())
      )
    );
  }
  
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(verse => 
      verse.text_rv60.toLowerCase().includes(queryLower) ||
      verse.text_ntv.toLowerCase().includes(queryLower) ||
      verse.emotion_tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }
  
  return results;
}

// Función para simular respuestas de IA
export function mockAIResponse(message: string) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('ansio') || messageLower.includes('preocup')) {
    return {
      content: 'Entiendo que te sientes ansioso. Es normal sentirse así a veces. Dios nos invita a llevar nuestras cargas a Él. En Filipenses 4:6-7 encontramos una hermosa promesa: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." ¿Te gustaría que oremos juntos por esta situación?',
      verses: searchMockVerses('', 'ansiedad').slice(0, 2)
    };
  }
  
  if (messageLower.includes('trist') || messageLower.includes('dolor')) {
    return {
      content: 'Siento que estés pasando por un momento difícil. Dios está cerca de los quebrantados de corazón. En Salmo 34:18 leemos: "Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu." No estás solo en esto.',
      verses: searchMockVerses('', 'tristeza').slice(0, 2)
    };
  }
  
  if (messageLower.includes('miedo') || messageLower.includes('tem')) {
    return {
      content: 'El miedo es una emoción humana natural, pero Dios nos da fortaleza. En Isaías 41:10 encontramos estas palabras consoladoras: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." Él está contigo.',
      verses: searchMockVerses('', 'miedo').slice(0, 2)
    };
  }
  
  return {
    content: 'Gracias por compartir conmigo. Dios se interesa por cada aspecto de tu vida. ¿Hay algo específico en lo que te gustaría que te acompañe en oración o reflexión bíblica?',
    verses: mockVerses.slice(0, 2)
  };
}