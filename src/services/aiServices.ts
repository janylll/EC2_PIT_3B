import OpenAI from "openai";

// Initialize OpenAI but point it to the OpenRouter network
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "MISSING_KEY",
  dangerouslyAllowBrowser: true, // Required for Vite/React client-side calls
});

export async function getTriageRecommendation(
  chatHistory: { role: "user" | "model"; parts: [{ text: string }] }[]
): Promise<string> {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const systemInstruction = `You are the official CDO MedGuide AI Assistant for Cagayan de Oro City.
  TODAY'S DATE IS: ${today}. Use this to accurately calculate any dates (like "tomorrow").
  
  Your job is to assist patients with health inquiries AND help them book appointments.

  CDO Hospitals available:
  - Northern Mindanao Medical Center (NMMC)
  - J.R. Borja General Hospital
  - Polymedic Medical Plaza
  - Capitol University Medical Center
  - Maria Reyna Xavier University Hospital

  BOOKING PROTOCOL (CRITICAL):
  If the user wants to book an appointment, collect these 4 things ONE BY ONE:
  1. Which hospital do they prefer?
  2. What exact date? (Format: YYYY-MM-DD)
  3. What time? (Format: HH:MM AM/PM)
  4. What are their symptoms and duration?

  Once you have all 4, append this EXACT JSON block at the end of your response:
  \`\`\`json
  {
    "hospital": "[Selected Hospital Name]",
    "date": "[YYYY-MM-DD]",
    "time": "[HH:MM AM/PM]",
    "symptoms": "Feels: [Symptoms] | Duration: [Duration]"
  }
  \`\`\`
  CRITICAL: Do not output this JSON until all info is collected. Respond in plain text.`;

  // Map your custom Gemini frontend history format to the universal OpenAI format
  const mappedMessages = chatHistory.map((msg) => ({
    role: msg.role === "model" ? ("assistant" as const) : ("user" as const),
    content: msg.parts[0].text,
  }));

  const fullConversation = [
    { role: "system" as const, content: systemInstruction },
    ...mappedMessages,
  ];

  try {
    // 🥇 PLAN A: Try Google's Gemini 2.5 Flash
    console.log("Attempting route: Gemini 2.5 Flash...");
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: fullConversation,
    });

    return response.choices[0].message.content || "Sorry, I couldn't process that.";

  } catch (primaryError) {
    console.warn("Gemini failed or rate-limited. Falling back to PLAN B (OpenAI)...", primaryError);

    try {
      // 🥈 PLAN B: Automatic Fallback to OpenAI's GPT-4o-Mini
      const fallbackResponse = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: fullConversation,
      });

      return fallbackResponse.choices[0].message.content || "Sorry, I couldn't process that.";

    } catch (fallbackError: any) {
      // 🚨 TOTAL FAILURE: Both APIs are down or out of quota
      console.error("Critical API Failure on both primary and fallback routes:", fallbackError);
      return `⚠️ API Error: Both primary and backup medical servers are currently busy. Please try again in a few minutes.`;
    }
  }
}