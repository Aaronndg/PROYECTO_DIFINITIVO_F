import TelegramBot from 'node-telegram-bot-api'

class TelegramBotService {
  private bot: TelegramBot | null = null
  private token: string

  constructor(token: string) {
    this.token = token
    if (token) {
      this.bot = new TelegramBot(token, { polling: false })
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.bot) {
      console.error('Telegram bot not initialized')
      return
    }

    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown'
      })
    } catch (error) {
      console.error('Error sending Telegram message:', error)
    }
  }

  async sendDailyVerse(chatId: string, verse: string, reference: string): Promise<void> {
    const message = `
🌅 *Versículo del día*

📖 *${reference}*

"${verse}"

Que tengas un día bendecido lleno de la paz de Dios. 🙏

_Enviado desde Break_IA_
    `

    await this.sendMessage(chatId, message)
  }

  async sendEmotionalSupport(chatId: string, emotion: string, supportMessage: string): Promise<void> {
    const message = `
💙 *Apoyo Emocional*

Hemos notado que últimamente has estado experimentando *${emotion}*.

${supportMessage}

Recuerda que no estás solo(a). Dios está contigo siempre. 🕊️

_Enviado desde Break_IA_
    `

    await this.sendMessage(chatId, message)
  }

  async sendTestReminder(chatId: string, userName: string): Promise<void> {
    const message = `
🔔 *Recordatorio Diario*

Hola ${userName}, no olvides realizar tu test emocional de hoy.

Tu bienestar es importante para nosotros y para Dios. 💜

[Realizar Test](${process.env.NEXTAUTH_URL}/test)

_Enviado desde Break_IA_
    `

    await this.sendMessage(chatId, message)
  }

  async sendProgressUpdate(chatId: string, progressData: any): Promise<void> {
    const message = `
📊 *Resumen de tu Progreso*

En los últimos 7 días:
• Estado promedio: ${progressData.averageMood}/10
• Tendencia: ${progressData.trend}
• Tests completados: ${progressData.testCount}

${progressData.encouragement}

¡Sigue adelante! 💪✨

_Enviado desde Break_IA_
    `

    await this.sendMessage(chatId, message)
  }
}

export const telegramBot = new TelegramBotService(process.env.TELEGRAM_BOT_TOKEN || '')