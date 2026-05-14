import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
// We removed Sparkles from this import!
import { Send, User, Loader2, CheckCircle2 } from "lucide-react";
import { getTriageRecommendation } from "../../services/aiServices";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  action?: {
    label: string;
    data: any; 
  };
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your CDO MedGuide AI. I can answer health questions, analyze symptoms, or help you book an appointment directly. How can I assist you today?",
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  }
];

export function AIHelp() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const geminiHistory: {role: "user"|"model", parts: [{text: string}]}[] = newMessages
      .filter(m => m.id !== 1) 
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

    const aiTextResponse = await getTriageRecommendation(geminiHistory);

    let cleanResponseText = aiTextResponse;
    let extractedBookingData = null;

    const jsonMatch = aiTextResponse.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        extractedBookingData = JSON.parse(jsonMatch[1]);
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

      setMessages((prev) => [...prev, {
        id: Date.now(),
        role: "assistant",
        content: `✅ Success! Your appointment at **${bookingData.hospital}** for **${bookingData.date}** at **${bookingData.time}** has been officially requested.\n\nThe hospital will review it shortly. You can track its status in the "My Appointments" tab!`,
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
    <div className="flex flex-col h-[calc(100vh-7rem)] -mt-4 sm:-mt-8">
      
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto w-full py-8 space-y-8">
          
          {/* Subtle top branding */}
          <div className="text-center mb-12">
            {/* CUSTOM LOGO FOR HEADER */}
            <img src="/icon.png" alt="CDO MedGuide Logo" className="w-14 h-14 mx-auto mb-3 rounded-full drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-gray-800">CDO MedGuide AI</h1>
            <p className="text-gray-500 text-sm">Your intelligent healthcare companion</p>
          </div>

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              
              {/* AI Avatar */}
              {message.role === "assistant" && (
                <img 
                  src="/icon.png" 
                  alt="AI Avatar" 
                  className="w-8 h-8 rounded-full shrink-0 mt-1 shadow-sm border border-gray-100 bg-white object-cover" 
                />
              )}

              {/* Message Content */}
              <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}>
                <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                  message.role === "user" 
                    ? "bg-gray-100 text-gray-800 rounded-3xl rounded-tr-sm" 
                    : "bg-white text-gray-800 rounded-3xl rounded-tl-sm border border-gray-100"
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* MAGICAL BOOKING BUTTON */}
                {message.action && (
                  <div className="mt-3 bg-white p-5 rounded-2xl border border-blue-100 shadow-sm w-full sm:min-w-87.5">
                    <div className="flex items-center gap-2 mb-3">
                      <img src="/icon.png" alt="AI Icon" className="w-4 h-4 rounded-full" />
                      <p className="text-sm text-gray-800 font-semibold">Appointment Ready</p>
                    </div>
                    <Button 
                      onClick={() => handleBookAppointment(message.action!.data)} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md py-6 text-md font-bold rounded-xl"
                      disabled={isBooking}
                    >
                      {isBooking ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                      {message.action.label}
                    </Button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              {/* PULSING AI AVATAR FOR LOADING */}
              <img 
                src="/icon.png" 
                alt="AI Thinking" 
                className="w-8 h-8 rounded-full shrink-0 mt-1 shadow-sm border border-gray-100 bg-white object-cover animate-pulse" 
              />
              <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-sm px-5 py-4 flex items-center shadow-sm">
                <div className="flex gap-1.5 items-center opacity-60">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* FLOATING INPUT AREA */}
      <div className="shrink-0 px-4 pb-6 pt-2 bg-linear-to-t from-gray-50 via-gray-50/80 to-transparent">
        <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-white border border-gray-300 rounded-[28px] p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything or say 'I want to book an appointment'..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none min-h-11 max-h-37.5 py-3 px-4 text-base outline-none scrollbar-hide"
            rows={1}
            disabled={isLoading || isBooking}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || isBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 w-11 p-0 shrink-0 shadow-sm self-end mb-0.5 mr-0.5"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          AI can make mistakes. Always consult with a real healthcare professional for serious concerns.
        </p>
      </div>
      
    </div>
  );
}