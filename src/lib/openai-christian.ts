import OpenAI from 'openai'
import { mockAIResponse } from './mockData'

const openai = process.env.ENABLE_MOCK_DATA === 'true' ? null : new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class ChristianAI {
  async getCounselingResponse(
    message: string, 
    emotionalContext?: string, 
    userHistory?: any[]
  ): Promise<string> {
    // Usar respuesta mock en desarrollo
    if (process.env.ENABLE_MOCK_DATA === 'true' || !openai) {
      console.log('Using mock AI response')
      const mockResponse = mockAIResponse(message)
      return mockResponse.content
    }

    try {
      const systemPrompt = `
      Eres un consejero cristiano especializado en bienestar emocional. Tu trabajo es:
      
      1. Proporcionar consejo basado en principios cristianos bíblicos
      2. Usar ÚNICAMENTE versículos de la Reina Valera 1960
      3. Ser empático, comprensivo y esperanzador
      4. Nunca dar consejos médicos profesionales
      5. Siempre incluir referencias bíblicas relevantes
      6. Enfocar en la paz, esperanza y amor de Dios
      7. Hablar con amor y sabiduría pastoral
      
      Contexto emocional actual: ${emotionalContext || 'No especificado'}
      
      Responde de manera pastoral, amorosa y fundamentada en las Escrituras.
      Incluye siempre al menos un versículo completo de la Reina Valera 1960.
      `

      const userPrompt = `
      Usuario dice: "${message}"
      
      Por favor proporciona una respuesta cristiana que incluya:
      - Comprensión empática y amorosa
      - Consejo bíblico apropiado y práctico
      - Al menos un versículo completo de Reina Valera 1960 con su referencia
      - Palabras de esperanza y ánimo
      - Aplicación práctica del versículo a la situación
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      return completion.choices[0].message.content || 'Lo siento, no pude procesar tu mensaje en este momento. Recuerda que "Jehová está cerca de los quebrantados de corazón; Y salva a los contritos de espíritu." - Salmos 34:18 (RV60)'

    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      return 'Lo siento, en este momento no puedo procesar tu mensaje. Recuerda que "Jehová está cerca de los quebrantados de corazón; Y salva a los contritos de espíritu." - Salmos 34:18 (RV60)'
    }
  }

  async getVerseRecommendation(emotion: string): Promise<string> {
    const systemPrompt = `
    Eres un experto en la Biblia Reina Valera 1960. 
    Proporciona UN versículo específico y relevante para la emoción: ${emotion}
    
    Formato de respuesta:
    Referencia: [Libro Capítulo:Versículo]
    Texto: [Versículo completo RV60]
    Aplicación: [Breve reflexión de cómo aplica a la emoción]
    `

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Necesito un versículo para alguien que siente: ${emotion}` }
        ],
        temperature: 0.3,
        max_tokens: 300
      })

      return completion.choices[0].message.content || 'Referencia: Filipenses 4:19\nTexto: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús."\nAplicación: Dios conoce nuestras necesidades y nos provee en todo momento.'

    } catch (error) {
      console.error('Error getting verse recommendation:', error)
      return 'Referencia: Filipenses 4:19\nTexto: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús."\nAplicación: Dios conoce nuestras necesidades y nos provee en todo momento.'
    }
  }

  async generateEmotionalInsight(testResults: any): Promise<string> {
    try {
      const systemPrompt = `
      Eres un consejero cristiano que analiza resultados de tests emocionales.
      Proporciona insights pastorales basados en las Escrituras.
      Sé alentador, esperanzador y siempre incluye perspectiva bíblica.
      `

      const userPrompt = `
      Resultados del test emocional:
      - Estado de ánimo: ${testResults.moodScore}/10
      - Nivel de ansiedad: ${testResults.anxietyLevel || 'No especificado'}/10
      - Nivel de estrés: ${testResults.stressLevel || 'No especificado'}/10
      - Nivel de energía: ${testResults.energyLevel || 'No especificado'}/10
      - Calidad del sueño: ${testResults.sleepQuality || 'No especificado'}/10
      - Notas adicionales: ${testResults.notes || 'Ninguna'}

      Proporciona un insight pastoral cristiano con:
      - Análisis empático de los resultados
      - Versículo bíblico relevante de RV60
      - Recomendaciones prácticas cristianas
      - Palabras de ánimo y esperanza
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })

      return completion.choices[0].message.content || 'Dios conoce tu corazón y está contigo en este momento. "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." - 1 Pedro 5:7'

    } catch (error) {
      console.error('Error generating emotional insight:', error)
      return 'Dios conoce tu corazón y está contigo en este momento. "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." - 1 Pedro 5:7'
    }
  }
}

export const christianAI = new ChristianAI()