# Vercel Deployment Guide

## Firebase Configuration

To fix the deployment errors related to Firebase service account credentials, you need to add the following environment variables to your Vercel project:

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### How to get Firebase credentials:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Use the values from the JSON file for your environment variables

**Important note about FIREBASE_PRIVATE_KEY:**
The private key contains newlines (`\n`), which need to be preserved. When adding to Vercel:

- Include the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Do NOT replace newlines with actual line breaks
- Do NOT add extra quotes around the key

## Create Required Firestore Indexes

Your application requires composite indexes for Firestore queries. You need to create these indexes in your Firebase project:

1. Click on the following links to create the required indexes:

   - [Index for getLatestInterviews](https://console.firebase.google.com/v1/r/project/prepwise-286c9/firestore/indexes?create_composite=ClFwcm9qZWN0cy9wcmVwd2lzZS0yODZjOS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvaW50ZXJ2aWV3cy9pbmRleGVzL18QARoNCglmaW5hbGl6ZWQQARoNCgljcmVhdGVkQXQQAhoKCgZ1c2VySWQQAhoMCghfX25hbWVfXxAC)

   - [Index for getInterviewsByUserId](https://console.firebase.google.com/v1/r/project/prepwise-286c9/firestore/indexes?create_composite=ClFwcm9qZWN0cy9wcmVwd2lzZS0yODZjOS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvaW50ZXJ2aWV3cy9pbmRleGVzL18QARoKCgZ1c2VySWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC)

2. For each link, you'll be taken to the Firebase console. Click "Create index" to confirm.

3. Wait for the indexes to finish building (this may take a few minutes).

Alternatively, you can manually create these indexes in the Firebase console:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Indexes > Composite
4. Click "Add index" and create the following indexes:

   For getLatestInterviews:

   - Collection ID: interviews
   - Fields to index:
     - finalized (Ascending)
     - createdAt (Descending)
     - userId (Ascending)

   For getInterviewsByUserId:

   - Collection ID: interviews
   - Fields to index:
     - userId (Ascending)
     - createdAt (Descending)

## Additional Error: userId is undefined

There's also an error related to userId being undefined in the general.action.ts file:

```
Error: Value for argument "value" is not a valid query constraint. Cannot use "undefined" as a Firestore value.
```

This has been fixed by updating the getInterviewsByUserId function to handle undefined userId values.

## Next Steps

After adding these environment variables and creating the required indexes, redeploy your application from the Vercel dashboard.
