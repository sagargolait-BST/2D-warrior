# SMS Gaming Platform

A gaming platform powered by Twilio SMS.

## Local Development

To run the application locally:

```bash
npm install
npm run dev
```

## Testing

To test the application:

```bash
# Test Hangman module
node test-hangman.js

# Test app module
node test-serverless.js

# Test serverless handler
node test-serverless-handler.js

# Test entire application
node test-all.js
```

## Deployment to Vercel

To deploy this application to Vercel, follow these steps:

1. Make sure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `SESSION_SECRET`: A secret key for session management
- `GEMINI_API_KEY`: Your Google Gemini API key
- `WEBHOOK_URL`: The URL of your webhook

## Troubleshooting

If you encounter any issues:

1. Check the Vercel logs for errors
2. Make sure all environment variables are set correctly
3. Verify that the application works locally before deploying
4. Run the test scripts to verify that all components work correctly

If you encounter the error "Cannot find module 'superb'", make sure that:

1. The 'superb' module is listed in your package.json dependencies
2. The build process is correctly installing all dependencies
3. The vercel.json file is correctly configured

You can test the dependencies locally by running:
```
node test-dependencies.js
``` 