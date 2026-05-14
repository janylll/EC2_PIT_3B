import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Bot, User, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { getTriageRecommendation } from "../../services/aiServices";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  action?: {
    label: string;
    data: any; // The JSON booking data extracted from AI
  };
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your CDO MedGuide AI assistant. I can answer health questions or help you book an appointment right here in the chat. How can I help you today?",
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  }
];

export function AIHelp() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    // FIXED: We filter out the initial greeting (id: 1) so Gemini doesn't crash!
    const geminiHistory: {role: "user"|"model", parts: [{text: string}]}[] = newMessages
      .filter(m => m.id !== 1) 
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

    // Call AI Service
    const aiTextResponse = await getTriageRecommendation(geminiHistory);

    // MAGIC PARSER: Look for the hidden JSON block in the AI's response
    let cleanResponseText = aiTextResponse;
    let extractedBookingData = null;

    const jsonMatch = aiTextResponse.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        extractedBookingData = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the text so the user doesn't see it
        cleanResponseText = aiTextResponse.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.error("AI tried to send booking data, but the JSON was malformed.", e);
      }
    }

    const aiResponse: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: cleanResponseText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      action: extractedBookingData ? {
        label: `Confirm & Book at ${extractedBookingData.hospital}`,
        data: extractedBookingData,
      } : undefined,
    };
    
    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  // FUNCTION TO SAVE THE APPOINTMENT TO SUPABASE
  const handleBookAppointment = async (bookingData: any) => {
    setIsBooking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to book.");

      const appointmentData = {
        user_id: user.id,
        hospital: bookingData.hospital,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        symptoms: bookingData.symptoms,
        status: "Pending" 
      };

      const { error } = await supabase.from("appointments").insert([appointmentData]);
      if (error) throw error;

      // Add a success message to the chat
      setMessages((prev) => [...prev, {
        id: Date.now(),
        role: "assistant",
        content: `✅ Success! Your appointment at ${bookingData.hospital} for ${bookingData.date} at ${bookingData.time} has been officially requested. The hospital will review it shortly. You can track its status in the "My Appointments" tab!`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      }]);

    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Health Assistant</h1>
        <p className="text-gray-600">
          Get personalized health guidance and let the AI book appointments for you!
        </p>
      </div>

      <Card className="border-blue-100 shadow-lg flex-1 flex flex-col overflow-hidden bg-white">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-blue-600 p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">CDO MedGuide AI</h3>
              <p className="text-xs text-blue-100">Booking Agent & Health Guide</p>
            </div>
            <Badge className="ml-auto bg-green-500 text-white border-none">Online</Badge>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${message.role === "user" ? "bg-blue-500" : "bg-blue-600"}`}>
                    {message.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>

                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div className={`rounded-2xl px-5 py-3 shadow-sm ${message.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 px-1 font-medium">{message.timestamp}</span>

                    {/* MAGICAL BOOKING BUTTON */}
                    {message.action && (
                      <div className="mt-3 bg-blue-50 p-4 rounded-xl border border-blue-100 w-full shadow-sm">
                        <p className="text-sm text-blue-800 font-semibold mb-3">AI has prepared your appointment details:</p>
                        <Button 
                          onClick={() => handleBookAppointment(message.action!.data)} 
                          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md py-6 text-md font-bold"
                          disabled={isBooking}
                        >
                          {isBooking ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                          {message.action.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-600 shadow-sm">
                     <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center shadow-sm">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="ml-3 text-gray-500 text-sm font-medium">AI is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 bg-white shrink-0">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message CDO MedGuide AI..."
                className="flex-1 bg-gray-50 border-gray-200 focus:border-blue-400 h-12 text-base rounded-xl"
                disabled={isLoading || isBooking}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || isBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 rounded-xl shadow-sm"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}