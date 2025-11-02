'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Send, User, LogOut, Bot } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface UserData {
  email: string
  name: string
}

export default function ChatPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emotionalContext, setEmotionalContext] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      // Mensaje de bienvenida
      setMessages([{
        id: '1',
        content: '¡Paz sea contigo! Soy tu consejero IA cristiano. Estoy aquí para acompañarte con sabiduría bíblica y amor pastoral. ¿Cómo te sientes hoy? ¿En qué puedo ayudarte?',
        isUser: false,
        timestamp: new Date()
      }])
    } else {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user?.email,
          emotionalContext: emotionalContext
        })
      })

      const data = await response.json()

      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('No se recibió respuesta')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error. Recuerda que "Jehová está cerca de los quebrantados de corazón; Y salva a los contritos de espíritu." - Salmos 34:18 (RV60)',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!user) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">Break_IA</Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/verses" className="text-gray-700 hover:text-purple-600 transition-colors">
                Versículos
              </Link>
              <Link href="/chat" className="text-purple-600 font-semibold">
                Chat IA
              </Link>
              <Link href="/test" className="text-gray-700 hover:text-purple-600 transition-colors">
                Test Diario
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Consejero IA Cristiano</h2>
                <p className="text-gray-600">Fundamentado en las Escrituras • Reina Valera 1960</p>
              </div>
            </div>

            {/* Emotional Context Selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cómo te sientes ahora? (Opcional - ayuda al AI a entender mejor)
              </label>
              <select
                value={emotionalContext}
                onChange={(e) => setEmotionalContext(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecciona tu estado emocional</option>
                <option value="alegría">Alegre</option>
                <option value="tristeza">Triste</option>
                <option value="ansiedad">Ansioso/a</option>
                <option value="miedo">Con miedo</option>
                <option value="ira">Enojado/a</option>
                <option value="confusión">Confundido/a</option>
                <option value="soledad">Solo/a</option>
                <option value="paz">En paz</option>
                <option value="esperanza">Esperanzado/a</option>
                <option value="gratitud">Agradecido/a</option>
              </select>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <Bot className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.isUser ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-[80%] p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Enviar</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Este chat está fundamentado en principios cristianos bíblicos. No reemplaza consejería profesional.
            </p>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white text-center">
          <p className="text-sm italic">
            "El consejo en el corazón del hombre es como aguas profundas; Mas el hombre entendido lo alcanzará."
          </p>
          <p className="text-xs text-green-200 mt-1">Proverbios 20:5 - RV60</p>
        </div>
      </main>
    </div>
  )
}