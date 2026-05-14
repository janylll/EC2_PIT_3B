import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "MISSING_KEY");

export async function getTriageRecommendation(chatHistory: {role: "user" | "model", parts: [{text: string}]}[]): Promise<string> {
  try {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // WE ARE BACK TO THE CORRECT, MODERN MODEL!
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are the official CDO MedGuide AI Assistant for Cagayan de Oro City.
      TODAY'S DATE IS: ${today}. Use this to accurately calculate any dates (like "tomorrow" or "in 3 days").
      
      Your job is to assist patients with health inquiries AND help them book appointments.

      CDO Hospitals available:
      - Northern Mindanao Medical Center (NMMC)
      - J.R. Borja General Hospital
      - Polymedic Medical Plaza
      - Capitol University Medical Center
      - Maria Reyna Xavier University Hospital

      BOOKING PROTOCOL (CRITICAL):
      If the user wants to book an appointment, you must act as a booking agent and collect these 4 things ONE BY ONE:
      1. Which hospital do they prefer? (Must be from the list above)
      2. What exact date? (Format: YYYY-MM-DD. Calculate this based on TODAY'S DATE: ${today})
      3. What time? (Format: HH:MM AM/PM)
      4. What are their symptoms and how long have they had them?

      Ask questions naturally and conversationally. Do NOT ask for all information at once. 
      
      ONCE YOU HAVE ALL 4 PIECES OF INFORMATION, say a brief confirmation message and then EXACTLY append this JSON block at the very end of your response:

      \`\`\`json
      {
        "hospital": "[Selected Hospital Name]",
        "date": "[YYYY-MM-DD]",
        "time": "[HH:MM AM/PM]",
        "symptoms": "Feels: [Symptoms] | Duration: [Duration]"
      }
      \`\`\`

      CRITICAL: Do not output this JSON until you have collected all required information. If you are missing details, just ask for them. Respond in standard plain text only without markdown bolding.`,
    });

    const previousHistory = chatHistory.slice(0, -1);
    const lastMessage = chatHistory[chatHistory.length - 1].parts[0].text;

    const chat = model.startChat({ history: previousHistory });
    const result = await chat.sendMessage(lastMessage);
    
    return result.response.text();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `⚠️ API Error: ${error.message || "Unknown error occurred"}`;
  }
}