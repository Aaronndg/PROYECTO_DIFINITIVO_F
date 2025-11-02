'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, BookOpen, Search, Filter, User, LogOut } from 'lucide-react'
import { Emotion } from '@/types'

interface BiblicalVerse {
  id: string
  reference: string
  text_rv60: string
  text_ntv?: string
  emotion_tags: string[]
  category: string
}

const emotions: Emotion[] = [
  'alegría', 'tristeza', 'ansiedad', 'miedo', 'ira', 'paz', 
  'esperanza', 'amor', 'perdón', 'gratitud', 'confusión', 'soledad'
]

export default function VersesPage() {
  const [verses, setVerses] = useState<BiblicalVerse[]>([])
  const [selectedEmotion, setSelectedEmotion] = useState<string>('')
  const [version, setVersion] = useState<'rv60' | 'ntv'>('rv60')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }
    
    // Cargar versículos iniciales
    loadVerses()
  }, [])

  const loadVerses = async (emotion?: string, query?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (emotion) params.append('emotion', emotion)
      if (version) params.append('version', version)
      if (query) params.append('query', query)

      const response = await fetch(`/api/verses?${params}`)
      const data = await response.json()
      
      if (data.verses) {
        setVerses(data.verses)
      }
    } catch (error) {
      console.error('Error loading verses:', error)
      // Cargar versículos de ejemplo si falla la API
      setVerses([
        {
          id: '1',
          reference: 'Filipenses 4:6-7',
          text_rv60: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
          text_ntv: 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.',
          emotion_tags: ['ansiedad', 'paz'],
          category: 'paz'
        },
        {
          id: '2',
          reference: 'Salmo 34:18',
          text_rv60: 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.',
          text_ntv: 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.',
          emotion_tags: ['tristeza', 'esperanza'],
          category: 'consuelo'
        },
        {
          id: '3',
          reference: 'Salmo 118:24',
          text_rv60: 'Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.',
          text_ntv: 'Este es el día que hizo el Señor; nos gozaremos y nos alegraremos en él.',
          emotion_tags: ['alegría', 'gratitud'],
          category: 'gozo'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleEmotionFilter = (emotion: string) => {
    setSelectedEmotion(emotion)
    loadVerses(emotion, searchQuery)
  }

  const handleSearch = () => {
    loadVerses(selectedEmotion, searchQuery)
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
              <Link href="/verses" className="text-purple-600 font-semibold">
                Versículos
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-purple-600 transition-colors">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Versículos Bíblicos</h1>
          </div>
          <p className="text-lg text-gray-600">
            Encuentra versículos específicos para tu estado emocional actual
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar versículos... (ej: 'paz', 'fortaleza', 'amor')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* Version Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-gray-700 font-medium">Versión:</span>
            <button
              onClick={() => setVersion('rv60')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                version === 'rv60' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reina Valera 1960
            </button>
            <button
              onClick={() => setVersion('ntv')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                version === 'ntv' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nueva Traducción Viviente
            </button>
          </div>

          {/* Emotion Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filtrar por emoción:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEmotionFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedEmotion === ''
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionFilter(emotion)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedEmotion === emotion
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando versículos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verses.map((verse) => (
              <div key={verse.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-blue-600 mb-2">{verse.reference}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {verse.emotion_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {version === 'rv60' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900 leading-relaxed italic">
                        "{verse.text_rv60}"
                      </p>
                      <p className="text-blue-700 text-sm font-semibold mt-2">- RV60</p>
                    </div>
                  )}

                  {version === 'ntv' && verse.text_ntv && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-900 leading-relaxed italic">
                        "{verse.text_ntv}"
                      </p>
                      <p className="text-green-700 text-sm font-semibold mt-2">- NTV</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">
                    Categoría: {verse.category}
                  </span>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
                    Compartir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {verses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron versículos</h3>
            <p className="text-gray-500">
              Intenta con otra emoción o término de búsqueda
            </p>
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            "Lámpara es a mis pies tu palabra, Y lumbrera a mi camino."
          </h3>
          <p className="text-blue-200">Salmo 119:105 - RV60</p>
        </div>
      </main>
    </div>
  )
}