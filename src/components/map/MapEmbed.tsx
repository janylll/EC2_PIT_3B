import { MapPin, Navigation, Clock } from "lucide-react";

export function MapEmbed({ hospital }: { hospital: string }) {
  // Simulated routing data for CDO Hospitals
  const routingData: Record<string, { time: string; dist: string }> = {
    "Northern Mindanao Medical Center": { time: "12 mins", dist: "3.2 km" },
    "J.R. Borja General Hospital": { time: "15 mins", dist: "4.1 km" },
    "Capitol University Medical City": { time: "8 mins", dist: "2.5 km" },
    "Maria Reyna Xavier University Hospital": { time: "10 mins", dist: "2.8 km" },
    "Polymedic Medical Plaza": { time: "18 mins", dist: "5.5 km" }
  };
  
  const info = routingData[hospital] || { time: "15 mins", dist: "4.0 km" };

  return (
    <div className="flex flex-col h-75 mt-4 bg-white rounded-xl shadow-inner border border-blue-200 overflow-hidden animate-in fade-in slide-in-from-top-4">
      <div className="bg-blue-50 border-b border-blue-100 p-3 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 font-medium text-blue-900">
          <MapPin className="w-4 h-4 text-blue-600" /> {hospital}
        </div>
        <div className="flex gap-4 text-blue-700 font-semibold">
          <span className="flex items-center gap-1"><Navigation className="w-4 h-4"/> {info.dist}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {info.time}</span>
        </div>
      </div>
      <iframe 
        src={`https://maps.google.com/maps?q=${encodeURIComponent(hospital + ' Cagayan de Oro')}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
      ></iframe>
    </div>
  );
}