import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import type { Session } from "@supabase/supabase-js"; 

// Import your pages
import { Home } from "./pages/Home/Home";
import { MyAppointments } from "./pages/Appointments/Appointments";
import { AIHelp } from "./pages/AiHelp/AiHelp";
import { PatientProfile } from "./components/profile/PatientProfile";
import { Auth } from "./pages/Auth/Auth";
import { Profile } from "./pages/Profile/Profile";

// Import UI components
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { supabase } from "./lib/supabase";

// 1. The Layout Component
function Layout() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-blue-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-blue-900">CDO MedGuide</span>
            </div>

            {/* FIXED: Hover-Based User Avatar & Dropdown Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full cursor-default">
                <Avatar className="h-10 w-10 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <AvatarImage src="" alt="Patient" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">Me</AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown Box with an invisible padding bridge (pt-2) so hover doesn't break */}
              {profileOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 z-50">
                  <div className="bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <PatientProfile onClose={() => setProfileOpen(false)} />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="border-t border-blue-100 bg-blue-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1">
              <NavLink to="/" end className={({ isActive }) => `px-6 py-3 text-sm font-medium transition-all ${isActive ? "text-blue-700 border-b-2 border-blue-600 bg-white" : "text-gray-600 hover:text-blue-600 hover:bg-white/50"}`}>
                Home
              </NavLink>
              <NavLink to="/appointments" className={({ isActive }) => `px-6 py-3 text-sm font-medium transition-all ${isActive ? "text-blue-700 border-b-2 border-blue-600 bg-white" : "text-gray-600 hover:text-blue-600 hover:bg-white/50"}`}>
                My Appointments
              </NavLink>
              <NavLink to="/ai-help" className={({ isActive }) => `px-6 py-3 text-sm font-medium transition-all ${isActive ? "text-blue-700 border-b-2 border-blue-600 bg-white" : "text-gray-600 hover:text-blue-600 hover:bg-white/50"}`}>
                AI Help
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/ai-help" element={<AIHelp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// 2. The Main App Component 
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        await supabase.auth.signOut();
        setSession(null);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      }
      setLoading(false);
    };

    verifyUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}