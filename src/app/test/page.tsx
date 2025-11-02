'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, BarChart3, User, LogOut, CheckCircle, Smile, Brain } from 'lucide-react'

interface UserData {
  email: string
  name: string
}

interface TestData {
  moodScore: number
  anxietyLevel: number
  stressLevel: number
  energyLevel: number
  sleepQuality: number
  notes: string
}

export default function TestPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [testData, setTestData] = useState<TestData>({
    moodScore: 5,
    anxietyLevel: 5,
    stressLevel: 5,
    energyLevel: 5,
    sleepQuality: 5,
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }
  }, [])

  const handleSubmitTest = async () => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.email,
          ...testData
        })
      })

      const data = await response.json()

      if (data.test) {
        setTestResults(data)
        setTestCompleted(true)
      } else {
        throw new Error('Error al guardar el test')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Error al enviar el test. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const getEmotionEmoji = (score: number) => {
    if (score >= 8) return '😊'
    if (score >= 6) return '🙂'
    if (score >= 4) return '😐'
    if (score >= 2) return '😔'
    return '😢'
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    if (score >= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  if (!user) return <div>Cargando...</div>

  if (testCompleted) {
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

        {/* Results */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Test Completado!</h1>
            <p className="text-lg text-gray-600">Gracias por compartir tu estado emocional</p>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen de tu Estado Emocional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Estado de Ánimo</h3>
                <div className="text-3xl mb-2">{getEmotionEmoji(testData.moodScore)}</div>
                <p className={`text-2xl font-bold ${getScoreColor(testData.moodScore)}`}>
                  {testData.moodScore}/10
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Ansiedad</h3>
                <div className="text-3xl mb-2">{testData.anxietyLevel <= 3 ? '😌' : testData.anxietyLevel <= 6 ? '😰' : '😱'}</div>
                <p className={`text-2xl font-bold ${getScoreColor(10 - testData.anxietyLevel)}`}>
                  {testData.anxietyLevel}/10
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Energía</h3>
                <div className="text-3xl mb-2">{testData.energyLevel >= 7 ? '⚡' : testData.energyLevel >= 4 ? '🔋' : '🪫'}</div>
                <p className={`text-2xl font-bold ${getScoreColor(testData.energyLevel)}`}>
                  {testData.energyLevel}/10
                </p>
              </div>
            </div>

            {/* AI Recommendations */}
            {testResults?.recommendations && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Recomendación Bíblica para Ti</h3>
                <div className="text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {testResults.recommendations}
                </div>
              </div>
            )}

            {/* Trend */}
            {testResults?.trend && (
              <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tendencia</h3>
                <p className="text-lg">
                  {testResults.trend === 'positive' && '📈 ¡Tu estado emocional está mejorando!'}
                  {testResults.trend === 'negative' && '📉 Parece que has tenido días difíciles'}
                  {testResults.trend === 'stable' && '📊 Tu estado emocional se mantiene estable'}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Volver al Dashboard
            </Link>
            <Link
              href="/chat"
              className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Hablar con IA Consejero
            </Link>
            <Link
              href="/verses"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Ver Versículos
            </Link>
          </div>

          {/* Inspirational Quote */}
          <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white text-center">
            <p className="text-lg mb-2">
              "Echa sobre Jehová tu carga, y él te sustentará; No dejará para siempre caído al justo."
            </p>
            <p className="text-green-200">Salmo 55:22 - RV60</p>
          </div>
        </main>
      </div>
    )
  }

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
              <Link href="/chat" className="text-gray-700 hover:text-purple-600 transition-colors">
                Chat IA
              </Link>
              <Link href="/test" className="text-purple-600 font-semibold">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test Emocional Diario</h1>
          </div>
          <p className="text-lg text-gray-600">
            Evalúa tu estado emocional para obtener guía bíblica personalizada
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-medium text-gray-700">{currentStep}/6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {currentStep === 1 && (
            <div className="text-center">
              <Smile className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo te sientes hoy?</h2>
              <p className="text-gray-600 mb-8">Califica tu estado de ánimo general en una escala del 1 al 10</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Muy mal</span>
                  <span>Excelente</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={testData.moodScore}
                  onChange={(e) => setTestData({...testData, moodScore: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="text-center mt-4">
                  <span className="text-4xl">{getEmotionEmoji(testData.moodScore)}</span>
                  <p className={`text-2xl font-bold mt-2 ${getScoreColor(testData.moodScore)}`}>
                    {testData.moodScore}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <Brain className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nivel de Ansiedad</h2>
              <p className="text-gray-600 mb-8">¿Qué tan ansioso/a te has sentido hoy?</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Muy calmado</span>
                  <span>Muy ansioso</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={testData.anxietyLevel}
                  onChange={(e) => setTestData({...testData, anxietyLevel: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-center mt-4">
                  <span className="text-4xl">
                    {testData.anxietyLevel <= 3 ? '😌' : testData.anxietyLevel <= 6 ? '😰' : '😱'}
                  </span>
                  <p className={`text-2xl font-bold mt-2 ${getScoreColor(10 - testData.anxietyLevel)}`}>
                    {testData.anxietyLevel}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-6">⚡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nivel de Estrés</h2>
              <p className="text-gray-600 mb-8">¿Qué tan estresado/a te sientes?</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Sin estrés</span>
                  <span>Muy estresado</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={testData.stressLevel}
                  onChange={(e) => setTestData({...testData, stressLevel: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="text-center mt-4">
                  <span className="text-4xl">
                    {testData.stressLevel <= 3 ? '😌' : testData.stressLevel <= 6 ? '😤' : '🤯'}
                  </span>
                  <p className={`text-2xl font-bold mt-2 ${getScoreColor(10 - testData.stressLevel)}`}>
                    {testData.stressLevel}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <div className="text-yellow-500 text-6xl mb-6">🔋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nivel de Energía</h2>
              <p className="text-gray-600 mb-8">¿Cómo está tu energía hoy?</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Sin energía</span>
                  <span>Mucha energía</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={testData.energyLevel}
                  onChange={(e) => setTestData({...testData, energyLevel: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                />
                <div className="text-center mt-4">
                  <span className="text-4xl">
                    {testData.energyLevel >= 7 ? '⚡' : testData.energyLevel >= 4 ? '🔋' : '🪫'}
                  </span>
                  <p className={`text-2xl font-bold mt-2 ${getScoreColor(testData.energyLevel)}`}>
                    {testData.energyLevel}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center">
              <div className="text-indigo-500 text-6xl mb-6">💤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calidad del Sueño</h2>
              <p className="text-gray-600 mb-8">¿Cómo dormiste anoche?</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Muy mal</span>
                  <span>Excelente</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={testData.sleepQuality}
                  onChange={(e) => setTestData({...testData, sleepQuality: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-center mt-4">
                  <span className="text-4xl">
                    {testData.sleepQuality >= 7 ? '😴' : testData.sleepQuality >= 4 ? '😪' : '😵‍💫'}
                  </span>
                  <p className={`text-2xl font-bold mt-2 ${getScoreColor(testData.sleepQuality)}`}>
                    {testData.sleepQuality}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="text-center">
              <div className="text-purple-500 text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notas Adicionales</h2>
              <p className="text-gray-600 mb-8">¿Hay algo más que quieras compartir sobre cómo te sientes?</p>
              
              <textarea
                value={testData.notes}
                onChange={(e) => setTestData({...testData, notes: e.target.value})}
                placeholder="Escribe aquí cualquier detalle sobre tu estado emocional, situaciones que te afecten, o cualquier cosa que consideres importante..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Anterior
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Completar Test'}
              </button>
            )}
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
          <p className="text-lg mb-2">
            "Examíname, oh Dios, y conoce mi corazón; Pruébame y conoce mis pensamientos."
          </p>
          <p className="text-purple-200">Salmo 139:23 - RV60</p>
        </div>
      </main>
    </div>
  )
}