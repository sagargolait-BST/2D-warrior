export const smsConfig = {
  // Twilio configuration
  twilioPhone: '+14155238886',
  
  // API endpoints
  apiEndpoints: {
    start: '/api/sms-game?action=start',
    proxy: '/api/sms-game',
    webhook: '/api/sms-webhook',
  },
  
  // Server configuration
  server: {
    port: 4500,
    host: 'localhost',
  },
  
  // WhatsApp configuration
  whatsapp: {
    joinCode: 'join',
    qrCodeUrl: '/sms-qrcode.png',
  },
  
  // Webhook configuration (for Twilio)
  webhook: {
    // This would be the actual deployed URL
    // For local development, we use localhost
    url: 'http://localhost:3000/api/sms-webhook'
  }
}; 