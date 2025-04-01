const path = require('path');

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

// Add detailed environment variable logging
console.log('=== Environment Variables Check ===');
console.log('Current directory:', __dirname);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not set');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
console.log('WEBHOOK_URL:', process.env.WEBHOOK_URL || 'Not set');
console.log('================================');

const multiPlayerModeHandler = require('./mode-controllers/multiplayer');
const singlePlayerModeHandler = require('./mode-controllers/singleplayer');

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const { singlePlayerWelcomeMsg, serverErrorMsg } = require('./messages');
const {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
} = require('./utils');

const app = express();
const PORT = process.env.PORT || 4500;

// Enable CORS
app.use(cors());

// Parse incoming Twilio request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware
app.use(session(sessionConfig));

// Custom properties attached on each request & response
app.use((req, res, next) => {
  req.user = req.session.user;
  res.sendMessage = sendMessage(res, req);
  req.saveUserSession = saveUserSession(req);
  req.broadcastMessage = broadcastMessage(req);
  next();
});

// Status callback endpoint for Twilio
app.post('/api/sms-webhook/status-callback', (req, res) => {
  console.log('Message status callback:', req.body);
  res.status(200).send('OK');
});

// The main endpoint where messages arrive
app.post('/api/sms-webhook', async (req, res) => {
  console.log('=== Incoming Webhook Request ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  // Validate Twilio request
  if (!req.body.From || !req.body.To) {
    console.error('Missing required Twilio parameters');
    return res.status(400).send('Bad Request');
  }

  // Handle WhatsApp messages
  if (req.body.From && req.body.From.startsWith('whatsapp:')) {
    console.log('Processing WhatsApp message from:', req.body.From);
    // Remove 'whatsapp:' prefix for session management
    req.body.From = req.body.From.replace('whatsapp:', '');
  }

  // Ensure To number is properly formatted
  if (req.body.To && !req.body.To.startsWith('whatsapp:')) {
    req.body.To = `whatsapp:${req.body.To}`;
  }

  const user = req.session.user || {};

  try {
    if (user.mode === 'single-player') {
      console.log('Handling single player mode');
      await singlePlayerModeHandler(req, res);
    } else if (user.mode === 'multi-player') {
      console.log('Handling multi player mode');
      await multiPlayerModeHandler(req, res);
    } else {
      console.log('Initializing new user session');
      const userSession = {
        phone: req.body.From,
        mode: 'single-player'
      };

      await req.saveUserSession(userSession);
      console.log('Sending welcome message');
      await res.sendMessage(singlePlayerWelcomeMsg);
    }
  } catch (error) {
    console.error('=== Error Processing Request ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    try {
      await res.sendMessage(serverErrorMsg);
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not set');
  console.log('Twilio Token:', process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set');
  console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
  console.log('Webhook URL:', process.env.WEBHOOK_URL || 'Not set');
});
