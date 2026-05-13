import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Bot, User, Calendar, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { getTriageRecommendation } from "../../services/aiServices"; // Import the AI Service

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your CDO MedGuide AI assistant. I can help you find the right healthcare facility and book appointments. How are you feeling today?",
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  }
];

export function AIHelp() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // 1. Add User Message
    const newUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // 2. Call Gemini API
    const aiTextResponse = await getTriageRecommendation(inputValue);

    // 3. Add AI Message
    const aiResponse: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: aiTextResponse,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      // Optional: You can conditionally add this action button based on the AI's response text later!
      action: aiTextResponse.toLowerCase().includes("book") || aiTextResponse.toLowerCase().includes("appointment") ? {
        label: "File an Appointment Here",
        onClick: () => alert("Appointment booking feature coming soon!"),
      } : undefined,
    };
    
    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
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
          Get personalized health guidance and appointment recommendations in CDO
        </p>
      </div>

      <Card className="border-blue-100 shadow-lg flex-1 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">CDO MedGuide AI</h3>
              <p className="text-xs text-blue-100">Powered by Gemini</p>
            </div>
            <Badge className="ml-auto bg-green-500 text-white hover:bg-green-500">
              Online
            </Badge>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-linear-to-br from-purple-500 to-blue-500"
                    }`}
                  >
                    {message.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>

                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>

                    {message.action && (
                      <Button onClick={message.action.onClick} className="mt-3 bg-green-600 hover:bg-green-700 text-white shadow-lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        {message.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-purple-500 to-blue-500">
                     <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-500 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 shrink-0">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className="flex-1 bg-white border-blue-200 focus:border-blue-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
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