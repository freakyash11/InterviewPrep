import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // Log the incoming request for debugging
    const requestData = await request.json();
    console.log("Received request data:", requestData);

    // Extract data from the request
    // This handles both direct API calls and VAPI function calls which may nest parameters
    const data = requestData.functionCall?.parameters || requestData;

    const { type, role, level, techstack, amount, userid } = data;

    console.log("Extracted interview parameters:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
    });

    // Input validation
    if (!type || !role || !level || !techstack || !amount) {
      console.error("Missing required parameters");
      return Response.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    try {
      const { text: questions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Prepare questions for a job interview.
          The job role is ${role}.
          The job experience level is ${level}.
          The tech stack used in the job is: ${techstack}.
          The focus between behavioural and technical questions should lean towards: ${type}.
          The amount of questions required is: ${amount}.
          Please return only the questions, without any additional text.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
          Return the questions formatted like this:
          ["Question 1", "Question 2", "Question 3"]
          
          Thank you! <3
      `,
      });

      console.log("Generated questions:", questions);

      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(questions);
      } catch (parseError) {
        console.error("Error parsing questions:", parseError);
        // If parsing fails, try to clean up the string and parse again
        const cleanedQuestions = questions
          .replace(/^```json\s*|\s*```$/g, "")
          .trim();
        try {
          parsedQuestions = JSON.parse(cleanedQuestions);
        } catch (secondParseError) {
          console.error("Error parsing cleaned questions:", secondParseError);
          return Response.json(
            { success: false, error: "Failed to parse generated questions" },
            { status: 500 }
          );
        }
      }

      const interview = {
        role: role,
        type: type,
        level: level,
        techstack:
          typeof techstack === "string" ? techstack.split(",") : techstack,
        questions: parsedQuestions,
        userId: userid,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
      };

      console.log("Saving interview to Firebase:", interview);

      try {
        const docRef = await db.collection("interviews").add(interview);
        console.log("Interview saved with ID:", docRef.id);

        // Format response for both direct API calls and VAPI function calls
        const responseData = {
          success: true,
          interviewId: docRef.id,
          message: "Interview questions generated and saved successfully",
          questions: parsedQuestions,
        };

        return Response.json(responseData, { status: 200 });
      } catch (dbError) {
        console.error("Firebase DB error:", dbError);
        // Return the questions even if saving to DB fails
        return Response.json(
          {
            success: true,
            warning: "Data not saved to database due to configuration issues",
            questions: parsedQuestions,
          },
          { status: 200 }
        );
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      return Response.json(
        { success: false, error: String(aiError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
