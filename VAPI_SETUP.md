# VAPI Integration Setup Guide

This guide explains how to set up VAPI for voice-based interview generation and interaction in your application.

## Understanding VAPI Integration

VAPI offers two main ways to create voice interactions:

1. **Assistants** - Single AI agents with continuous conversation capabilities
2. **Workflows** - Visual conversation flows with branching logic

Our application now uses a pre-configured **Assistant** via its ID, which simplifies the setup process.

## Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key_with_quotes"

# Google AI API
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Getting Your VAPI Web Token and Assistant ID

1. Sign up or log in to [VAPI Dashboard](https://dashboard.vapi.ai/)
2. Navigate to Settings > API Keys to get your web token
3. Create a new assistant in the Assistants section with the following configuration:
   - Set up a system prompt that instructs the assistant to collect interview information
   - Add a function tool called `generateInterview` that points to your API endpoint
   - Configure the voice and transcription settings as desired
4. Copy the Assistant ID from the dashboard and use it as your `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

### Assistant Configuration

When setting up your VAPI assistant, configure it with a function tool that has these parameters:

```json
{
  "name": "generateInterview",
  "description": "Generate and save interview questions based on provided parameters",
  "parameters": {
    "type": "object",
    "properties": {
      "role": {
        "type": "string",
        "description": "The job role for the interview (e.g., 'Frontend Developer')"
      },
      "level": {
        "type": "string",
        "description": "The experience level for the role (e.g., 'Junior', 'Mid', 'Senior')"
      },
      "techstack": {
        "type": "string",
        "description": "Comma-separated list of technologies (e.g., 'React,TypeScript,Next.js')"
      },
      "type": {
        "type": "string",
        "description": "The focus of questions: 'Technical', 'Behavioral', or 'Mixed'"
      },
      "amount": {
        "type": "number",
        "description": "Number of questions to generate"
      }
    },
    "required": ["role", "level", "techstack", "type", "amount"]
  }
}
```

Set the function URL to: `/api/vapi/generate`
Method: `POST`
Headers: `Content-Type: application/json`

## Setting Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Get your Web API keys from Project Settings > General
4. Create a Service Account in Project Settings > Service Accounts
5. Generate a new private key and download the JSON file
6. Extract the required values for your environment variables

## How It Works

The application now uses a pre-configured VAPI assistant with the following capabilities:

1. **Interview Generator Assistant**:

   - Collects information about job role, experience level, tech stack, etc.
   - Uses a function call to trigger our API endpoint to generate and save questions
   - Communicates with the user through voice

2. **Interview Conductor Assistant**:
   - Uses pre-generated questions to conduct the interview
   - Records and processes user responses
   - Provides feedback after the interview

## Troubleshooting

If you encounter issues:

1. **"Workflow not found" error**: This should no longer occur as we're using an assistant ID directly.

2. **Firebase connection issues**:

   - Verify your Firebase credentials in `.env.local`
   - Ensure your Firebase project has Firestore enabled
   - Check that your service account has proper permissions

3. **VAPI connection issues**:

   - Verify your VAPI web token and assistant ID
   - Check browser console for specific error messages
   - Ensure your VAPI account has sufficient credits

4. **Interview not being saved**:
   - Check server logs for Firebase errors
   - Verify that all required parameters are being passed to the API
   - Ensure Firebase rules allow writing to the 'interviews' collection

## Additional Resources

- [VAPI Documentation](https://docs.vapi.ai/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
