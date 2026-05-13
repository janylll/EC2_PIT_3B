import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Bot, User, Calendar } from "lucide-react";
import { Badge } from "../../components/ui/badge";

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
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    role: "user",
    content: "I've been having chest pains and shortness of breath for the past few days.",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    role: "assistant",
    content: "I understand your concern. Chest pain and shortness of breath can be serious symptoms. Based on your symptoms, I recommend seeing a cardiologist as soon as possible.\n\nI suggest Northern Mindanao Medical Center (NMMC) as they have excellent cardiology services and 24/7 emergency care. They're located on J.R. Borja St in Cagayan de Oro.\n\nWould you like me to help you schedule an appointment?",
    timestamp: "10:01 AM",
    action: {
      label: "File an Appointment Here",
      onClick: () => alert("Appointment booking feature coming soon!"),
    },
  },
];

export function AIHelp() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "I'm processing your request. In a real implementation, I would analyze your symptoms and provide personalized recommendations for healthcare facilities in Cagayan de Oro.",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
          Get personalized health guidance and appointment recommendations
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
              <p className="text-xs text-blue-100">Always here to help</p>
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
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-linear-to-br from-purple-500 to-blue-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex flex-col ${
                      message.role === "user" ? "items-end" : "items-start"
                    } max-w-[80%]`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp}
                    </span>

                    {/* Action Button */}
                    {message.action && (
                      <Button
                        onClick={message.action.onClick}
                        className="mt-3 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {message.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 shrink-0">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms or ask a question..."
                className="flex-1 bg-white border-blue-200 focus:border-blue-400"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 px-1">
              This AI provides general guidance only. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
