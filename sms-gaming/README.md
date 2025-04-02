# SMS Gaming Platform

A gaming platform powered by Twilio SMS.

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

If you encounter the error "Cannot find module 'superb'", make sure that:

1. The 'superb' module is listed in your package.json dependencies
2. The build process is correctly installing all dependencies
3. The vercel.json file is correctly configured

You can test the dependencies locally by running:
```
node test-dependencies.js
``` 