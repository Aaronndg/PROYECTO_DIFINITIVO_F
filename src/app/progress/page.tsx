'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Calendar, TrendingUp, Heart, BookOpen, MessageCircle, Target } from 'lucide-react'

interface ProgressData {
  emotionalWellbeing: number
  spiritualGrowth: number
  prayerConsistency: number
  bibleStudy: number
  weeklyGoals: {
    completed: number
    total: number
  }
  recentActivity: {
    date: string
    activity: string
    type: 'prayer' | 'study' | 'chat' | 'test'
  }[]
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData>({
    emotionalWellbeing: 75,
    spiritualGrowth: 68,
    prayerConsistency: 85,
    bibleStudy: 60,
    weeklyGoals: {
      completed: 4,
      total: 6
    },
    recentActivity: [
      { date: '2024-11-02', activity: 'Completó test emocional diario', type: 'test' },
      { date: '2024-11-02', activity: 'Conversación sobre ansiedad', type: 'chat' },
      { date: '2024-11-01', activity: 'Leyó versículos sobre paz', type: 'study' },
      { date: '2024-11-01', activity: 'Sesión de oración matutina', type: 'prayer' },
      { date: '2024-10-31', activity: 'Chat sobre esperanza', type: 'chat' }
    ]
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prayer': return <Heart className="w-4 h-4 text-pink-500" />
      case 'study': return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'chat': return <MessageCircle className="w-4 h-4 text-green-500" />
      case 'test': return <Target className="w-4 h-4 text-purple-500" />
      default: return <Calendar className="w-4 h-4 text-gray-500" />
    }
  }

  const progressItems = [
    {
      title: 'Bienestar Emocional',
      value: progressData.emotionalWellbeing,
      color: 'bg-green-500',
      description: 'Basado en tus tests emocionales'
    },
    {
      title: 'Crecimiento Espiritual',
      value: progressData.spiritualGrowth,
      color: 'bg-blue-500',
      description: 'Frecuencia de estudio y oración'
    },
    {
      title: 'Consistencia en Oración',
      value: progressData.prayerConsistency,
      color: 'bg-purple-500',
      description: 'Regularidad en momentos de oración'
    },
    {
      title: 'Estudio Bíblico',
      value: progressData.bibleStudy,
      color: 'bg-amber-500',
      description: 'Tiempo dedicado a la Palabra'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mi Progreso Espiritual
          </h1>
          <p className="text-gray-600">
            Seguimiento de tu crecimiento personal y espiritual
          </p>
        </div>

        {/* Progreso General */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {progressItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-800">
                      {item.value}%
                    </span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <Progress 
                    value={item.value} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Objetivos Semanales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Objetivos de la Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progreso semanal</span>
                  <span className="text-sm font-medium">
                    {progressData.weeklyGoals.completed} de {progressData.weeklyGoals.total}
                  </span>
                </div>
                <Progress 
                  value={(progressData.weeklyGoals.completed / progressData.weeklyGoals.total) * 100}
                  className="h-3"
                />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">✓ Oración matutina diaria</span>
                    <span className="text-green-600">Completado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">✓ Lectura bíblica 3 veces</span>
                    <span className="text-green-600">Completado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">✓ Test emocional diario</span>
                    <span className="text-green-600">Completado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">✓ Sesión de chat con IA</span>
                    <span className="text-green-600">Completado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600">○ Memorizar un versículo</span>
                    <span className="text-orange-600">Pendiente</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600">○ Orar por otros</span>
                    <span className="text-orange-600">Pendiente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas Mensuales */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Resumen del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">28</div>
                <div className="text-sm text-gray-600">Días de oración</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">15</div>
                <div className="text-sm text-gray-600">Sesiones de chat</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">22</div>
                <div className="text-sm text-gray-600">Tests completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">85</div>
                <div className="text-sm text-gray-600">Versículos leídos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje Motivacional */}
        <Card className="mt-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8 text-pink-200" />
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  ¡Vas por buen camino!
                </h3>
                <p className="text-purple-100">
                  Tu constancia en la oración y el estudio está dando frutos. 
                  Dios se complace en tu búsqueda sincera de Él.
                </p>
                <p className="text-sm text-purple-200 mt-2 italic">
                  "Acercaos a Dios, y él se acercará a vosotros" - Santiago 4:8
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}