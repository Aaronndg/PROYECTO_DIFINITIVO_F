import Link from "next/link";
import { Heart, BookOpen, MessageCircle, BarChart3, Bot } from "lucide-react";

// Force Vercel rebuild - v1.0.1 with TypeScript fixes
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Break_IA</h1>
            </div>
            <Link 
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu Bienestar Emocional
            <span className="block text-purple-600">Con Fundamento Bíblico</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Encuentra paz, esperanza y guía a través de las Escrituras. 
            Break_IA te acompaña en tu journey de bienestar emocional con 
            sabiduría bíblica e inteligencia artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Comenzar Gratis
            </Link>
            <a
              href="https://t.me/BreakIA_AlertBot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <Bot className="h-5 w-5" />
              Bot de Alertas
            </a>
            <Link
              href="#features"
              className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Conocer Más
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Herramientas para tu Bienestar
          </h2>
          <p className="text-xl text-gray-600">
            Cada funcionalidad está diseñada para apoyarte en tu crecimiento espiritual y emocional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Versículos Bíblicos */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Versículos por Emoción</h3>
            <p className="text-gray-600 mb-6">
              Encuentra versículos específicos de Reina Valera 60 y NTV filtrados por tu estado emocional actual.
            </p>
            <Link 
              href="/verses" 
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Explorar Versículos →
            </Link>
          </div>

          {/* Chat con IA */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Consejería IA Cristiana</h3>
            <p className="text-gray-600 mb-6">
              Conversa con nuestra IA especializada en consejería cristiana, fundamentada en las Escrituras.
            </p>
            <Link 
              href="/chat" 
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Iniciar Conversación →
            </Link>
          </div>

          {/* Tests Emocionales */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tests Diarios</h3>
            <p className="text-gray-600 mb-6">
              Realiza evaluaciones diarias de tu estado emocional y observa tu progreso a lo largo del tiempo.
            </p>
            <Link 
              href="/test" 
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Hacer Test →
            </Link>
          </div>

          {/* Telegram Bot */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Notificaciones</h3>
            <p className="text-gray-600 mb-6">
              Recibe versículos diarios, recordatorios y apoyo emocional directamente en Telegram.
            </p>
            <Link 
              href="/notifications" 
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              Configurar →
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Alert System */}
      <section className="bg-red-50 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-900 mb-4">
              Sistema de Alertas de Emergencia
            </h2>
            <p className="text-xl text-red-800 mb-8 max-w-3xl mx-auto">
              Nuestro chat IA detecta automáticamente mensajes de riesgo y activa alertas de emergencia. 
              Si necesitas ayuda inmediata, nuestro sistema te conectará con recursos de apoyo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/BreakIA_AlertBot"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <Bot className="h-5 w-5" />
                Acceder al Bot de Alertas
              </a>
              <Link
                href="/chat"
                className="border border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Chat con Detección IA
              </Link>
            </div>
            <div className="mt-8 text-sm text-red-700">
              <p>📞 <strong>Emergencias:</strong> 112 | <strong>Teléfono Esperanza:</strong> 91 459 00 50 | <strong>Línea 024:</strong> Prevención suicidio</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús."
          </h2>
          <p className="text-xl mb-8 opacity-90">Filipenses 4:7 - RV60</p>
          <Link
            href="/login"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center justify-center"
          >
            Comenzar tu Journey Espiritual
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">Break_IA</span>
            </div>
            <p className="text-gray-400 mb-4">
              Bienestar emocional con fundamento bíblico
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Break_IA. Desarrollado con amor y propósito.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
