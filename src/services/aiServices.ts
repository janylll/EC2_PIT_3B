import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCpmzz0cLSxH7FxBgCJ77wYc_pCUBE75co";

if (!apiKey) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getTriageRecommendation(userMessage: string): Promise<string> {
  try {
    // gemini-1.5-flash is extremely fast, perfect for chat interfaces
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are the official CDO MedGuide AI Assistant for Cagayan de Oro City, Philippines. 
      Your job is to read patient symptoms, assess the urgency, and recommend specific local hospitals.
      - If it is an emergency, tell them to go to Northern Mindanao Medical Center (NMMC) or J.R. Borja General Hospital.
      - For general consultations, suggest Capitol University Medical City, Maria Reyna, or Polymedic.
      Keep your responses concise, friendly, and structured. Always include a short disclaimer that you are an AI and they should see a real doctor.`,
    });

    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I am having trouble connecting to the medical database right now. Please try again in a few moments.";
  }
}