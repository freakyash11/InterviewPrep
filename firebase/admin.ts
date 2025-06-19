import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  try {
    if (!apps.length) {
      // Check if required environment variables are set
      if (
        !process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY
      ) {
        console.error(
          "Missing Firebase admin credentials in environment variables"
        );
        throw new Error("Firebase admin credentials not configured properly");
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace newlines in the private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });

      console.log("Firebase Admin initialized successfully");
    }

    return {
      auth: getAuth(),
      db: getFirestore(),
    };
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);

    // Return mock implementations for development/testing
    // This prevents the app from crashing if Firebase isn't configured
    return {
      auth: {
        // Add minimal mock implementations if needed
      },
      db: {
        collection: (name: string) => ({
          add: async (data: any) => {
            console.log(`[Mock Firebase] Would add to ${name}:`, data);
            return { id: "mock-id-" + Date.now() };
          },
          doc: (id: string) => ({
            get: async () => ({
              data: () => null,
              exists: false,
              id,
            }),
            set: async (data: any) => {
              console.log(
                `[Mock Firebase] Would set doc ${id} in ${name}:`,
                data
              );
            },
          }),
          where: () => ({
            where: () => ({
              limit: () => ({
                get: async () => ({
                  empty: true,
                  docs: [],
                }),
              }),
            }),
            orderBy: () => ({
              where: () => ({
                limit: () => ({
                  get: async () => ({
                    empty: true,
                    docs: [],
                  }),
                }),
              }),
            }),
            limit: () => ({
              get: async () => ({
                empty: true,
                docs: [],
              }),
            }),
          }),
          orderBy: () => ({
            get: async () => ({
              empty: true,
              docs: [],
            }),
            where: () => ({
              get: async () => ({
                empty: true,
                docs: [],
              }),
            }),
          }),
        }),
      },
    };
  }
}

export const { auth, db } = initFirebaseAdmin();
