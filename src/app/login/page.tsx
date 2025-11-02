'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Usuarios predeterminados para facilitar el testing
    const predefinedUsers = [
      { email: 'juan@ejemplo.com', password: 'password123' },
      { email: 'maria@ejemplo.com', password: 'password123' }
    ]

    const user = predefinedUsers.find(u => 
      u.email === formData.email && u.password === formData.password
    )

    if (user) {
      // Simulamos login exitoso
      localStorage.setItem('user', JSON.stringify({ 
        email: user.email, 
        name: user.email === 'juan@ejemplo.com' ? 'Juan Pérez' : 'María González' 
      }))
      window.location.href = '/dashboard'
    } else {
      alert('Credenciales incorrectas. Usa juan@ejemplo.com o maria@ejemplo.com con password123')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-10 w-10 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Break_IA</h1>
          </div>
          <h2 className="text-xl text-gray-600">Bienvenido de vuelta</h2>
          <p className="text-sm text-gray-500 mt-2">
            "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." - Mateo 11:28
          </p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botón de Login */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Usuarios de Prueba */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Usuarios de Prueba:</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Usuario 1:</strong> juan@ejemplo.com / password123</p>
              <p><strong>Usuario 2:</strong> maria@ejemplo.com / password123</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Primera vez aquí?{' '}
              <Link href="/" className="text-purple-600 hover:text-purple-700 font-semibold">
                Conoce Break_IA
              </Link>
            </p>
          </div>
        </div>

        {/* Versículo inspiracional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            "El Señor tu Dios está en medio de ti como guerrero victorioso. Se gozará sobre ti con alegría, callará de amor, se regocijará sobre ti con cánticos."
          </p>
          <p className="text-xs text-gray-400 mt-1">Sofonías 3:17 - RV60</p>
        </div>
      </div>
    </div>
  )
}