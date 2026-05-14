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
  };

  const handleViewProfile = () => {
    onClose(); // Close the slide-out
    navigate("/profile"); // Navigate to the new page
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
      <Avatar className="h-24 w-24 border-4 border-blue-200 shadow-md">
        <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500 mt-1">Verified Patient</p>
      </div>

      <div className="w-full space-y-3 mt-8 px-4">
        <Button onClick={handleViewProfile} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
          <User className="w-5 h-5 mr-2" /> View Profile
        </Button>
        <Button onClick={handleLogout} variant="destructive" className="w-full py-6 text-lg">
          <LogOut className="w-5 h-5 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}