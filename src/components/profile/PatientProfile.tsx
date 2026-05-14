import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { User, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function PatientProfile({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState("Loading...");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => { if (data) setName(data.full_name || "Patient"); });
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose(); // Close the menu when logging out
  };

  const handleViewProfile = () => {
    onClose(); // Close the menu
    navigate("/profile"); 
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <Avatar className="h-16 w-16 border-2 border-blue-200 shadow-sm mb-3">
        <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <h2 className="text-lg font-bold text-gray-800 text-center leading-tight">{name}</h2>
      <p className="text-xs text-gray-500 mt-1 mb-5">Verified Patient</p>

      <div className="w-full space-y-2">
        <Button onClick={handleViewProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex justify-start border-none">
          <User className="w-4 h-4 mr-2" /> View Profile
        </Button>
        
        {/* FIXED: Replaced 'variant="destructive"' with explicit red Tailwind classes */}
        <Button onClick={handleLogout} className="w-full flex justify-start bg-red-600 hover:bg-red-700 text-white border-none shadow-sm">
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}