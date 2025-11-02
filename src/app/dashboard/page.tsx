'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  BookOpen, 
  MessageCircle, 
  BarChart3, 
  User,
  Settings,
  LogOut,
  Calendar,
  TrendingUp,
  Smile
} from 'lucide-react'

interface UserData {
  email: string
  name: string
}

interface RecentTest {
  date: string
  mood: number
  overall: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [recentTests, setRecentTests] = useState<RecentTest[]>([])

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      // Simulamos datos de tests recientes
      setRecentTests([
        { date: '2025-11-01', mood: 8, overall: 'Muy bien' },
        { date: '2025-10-31', mood: 6, overall: 'Regular' },
        { date: '2025-10-30', mood: 7, overall: 'Bien' }
      ])
    } else {
      window.location.href = '/login'
    }
  }, [])

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
              <Link href="/verses" className="text-gray-700 hover:text-purple-600 transition-colors">
                Versículos
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-purple-600 transition-colors">
                Chat IA
              </Link>
              <Link href="/test" className="text-gray-700 hover:text-purple-600 transition-colors">
                Test Diario
              </Link>
              <Link href="/progress" className="text-gray-700 hover:text-purple-600 transition-colors">
                Mi Progreso
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Buen día, {user.name}! 🌅
          </h1>
          <p className="text-lg text-gray-600">
            "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." - Salmo 118:24
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            href="/test"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Diario</h3>
            <p className="text-gray-600 text-sm">Evalúa tu estado emocional hoy</p>
          </Link>

          <Link 
            href="/chat"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat IA</h3>
            <p className="text-gray-600 text-sm">Conversa con nuestro consejero IA</p>
          </Link>

          <Link 
            href="/verses"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Versículos</h3>
            <p className="text-gray-600 text-sm">Encuentra versículos por emoción</p>
          </Link>

          <Link 
            href="/progress"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mi Progreso</h3>
            <p className="text-gray-600 text-sm">Ve tu evolución emocional</p>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tests Recientes</h2>
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Smile className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{test.date}</p>
                        <p className="text-sm text-gray-600">{test.overall}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">{test.mood}/10</p>
                      <p className="text-xs text-gray-500">Estado general</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                href="/test"
                className="block w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
              >
                Hacer Test de Hoy
              </Link>
            </div>
          </div>

          {/* Today's Verse */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Versículo del Día</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-900 italic mb-2">
                  "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias."
                </p>
                <p className="text-blue-700 text-sm font-semibold">Filipenses 4:6 - RV60</p>
              </div>
              <p className="text-gray-600 text-sm">
                Cuando sientes ansiedad, recuerda que puedes entregar todas tus preocupaciones a Dios en oración.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen Semanal</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tests completados</span>
                  <span className="font-bold text-purple-600">3/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado promedio</span>
                  <span className="font-bold text-green-600">7.0/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tendencia</span>
                  <span className="font-bold text-blue-600">📈 Mejorando</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Reflexión del Día</h3>
          <p className="text-lg mb-2">
            "Dios no te ha dado un espíritu de temor, sino de poder, amor y dominio propio."
          </p>
          <p className="text-purple-200">2 Timoteo 1:7 - RV60</p>
        </div>
      </main>
    </div>
  )
}