const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;

// Check if environment variables are properly loaded
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Validate Twilio credentials before initializing the client
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('Error: Twilio credentials are missing. Please check your .env file.');
  console.error('Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are properly set.');
}

if (!WEBHOOK_URL) {
  console.error('Error: WEBHOOK_URL is missing. Please check your .env file.');
  console.error('This is required for Twilio to know where to send messages.');
}

// Initialize Twilio client with explicit parameters
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendMessage = (res, req) => async message => {
  try {
    console.log('=== Starting Message Send Process ===');
    console.log('Original message:', message);
    
    // Create a new TwiML response
    const twiml = new MessagingResponse();

    // Format the message for WhatsApp
    const formattedMessage = message instanceof Array 
      ? message.join('\n\n')
      : message.replace(/\n/g, '\n\n');

    console.log('Formatted message:', formattedMessage);

    // Add the message to the response with explicit WhatsApp parameters
    twiml.message({
      to: req.body.From,
      from: req.body.To,
      body: formattedMessage,
      action: `${WEBHOOK_URL}/status-callback`,
      method: 'POST'
    });

    // Convert to string and ensure proper XML formatting
    const response = twiml.toString();
    console.log('Generated TwiML:', response);

    // Set proper headers for WhatsApp
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'X-Twilio-Webhook-Enabled': 'true'
    };

    // Set headers one by one and log each
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
      console.log(`Set header ${key}: ${value}`);
    });

    // Set status code explicitly
    res.status(200);
    
    // Log the complete response object before sending
    console.log('Response object before send:', {
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      finished: res.finished
    });

    // Send the response and ensure it's completed
    return new Promise((resolve, reject) => {
      res.send(response);
      
      // Wait for the response to be finished
      res.on('finish', () => {
        console.log('Response finished successfully');
        console.log('Final response object:', {
          headers: res.getHeaders(),
          statusCode: res.statusCode,
          finished: res.finished
        });
        resolve(true);
      });

      res.on('error', (error) => {
        console.error('Error while sending response:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('=== Error in Message Send Process ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    try {
      // Send a fallback error message
      const errorTwiml = new MessagingResponse();
      errorTwiml.message({
        to: req.body.From,
        from: req.body.To,
        body: 'Sorry, there was an error processing your request. Please try again.',
        action: `${WEBHOOK_URL}/status-callback`,
        method: 'POST'
      });
      const errorResponse = errorTwiml.toString();
      
      console.log('Sending fallback error message');
      
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Twilio-Webhook-Enabled', 'true');
      
      res.status(200);
      
      // Send error response and ensure it's completed
      return new Promise((resolve, reject) => {
        res.send(errorResponse);
        
        res.on('finish', () => {
          console.log('Error response finished successfully');
          resolve(false);
        });

        res.on('error', (error) => {
          console.error('Error while sending error response:', error);
          reject(error);
        });
      });
    } catch (fallbackError) {
      console.error('Error sending fallback message:', fallbackError);
      res.status(500).send('Internal Server Error');
      return false;
    }
  }
};

const saveUserSession = req => user => {
  return new Promise((resolve, reject) => {
    try {
      req.session.user = user;
      req.session.save(err => {
        if (err) {
          console.error('Error saving user session:', err);
          reject(err);
        } else {
          console.log('User session saved successfully');
          resolve(user);
        }
      });
    } catch (error) {
      console.error('Error in saveUserSession:', error);
      reject(error);
    }
  });
};

const broadcastMessage = req => async (message, users) => {
  try {
    const { To: smsGamingNum } = req.body;
    console.log('Broadcasting message to users:', users);

    for (const user of users) {
      try {
        // Handle WhatsApp numbers
        const toNumber = user.phone.startsWith('whatsapp:') ? user.phone : `whatsapp:${user.phone}`;
        const fromNumber = smsGamingNum.startsWith('whatsapp:') ? smsGamingNum : `whatsapp:${smsGamingNum}`;

        console.log(`Sending message from ${fromNumber} to ${toNumber}`);
        
        await client.messages.create({
          body: message,
          from: fromNumber,
          to: toNumber,
          statusCallback: `${process.env.WEBHOOK_URL}/status-callback`
        });
        console.log(`Message sent to ${toNumber}`);
      } catch (error) {
        console.error(`Error sending message to ${user.phone}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in broadcastMessage:', error);
    throw error;
  }
};

const sessionConfig = {
  name: 'SESS_ID',
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

module.exports = {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
};
