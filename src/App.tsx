import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import type { Session } from "@supabase/supabase-js"; // Fixed: Added 'type' keyword

// Import your pages
import { Home } from "./pages/Home/Home";
import { MyAppointments } from "./pages/Appointments/Appointments";
import { AIHelp } from "./pages/AiHelp/AiHelp";
import { PatientProfile } from "./components/profile/PatientProfile";
import { Auth } from "./pages/Auth/Auth";

// Import UI components
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { supabase } from "./lib/supabase";

// 1. The Layout Component (Contains your navigation bar)
function Layout() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-Linear-to-b from-blue-50 to-white">
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

            {/* User Avatar */}
            <button
              onClick={() => setProfileOpen(true)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <AvatarImage src="" alt="Patient" />
                <AvatarFallback className="bg-blue-100 text-blue-700">JD</AvatarFallback>
              </Avatar>
            </button>
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
          </Routes>
        </div>
      </main>

      {/* Patient Profile Slide-out */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <PatientProfile />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// 2. The Main App Component (Checks Auth before showing Layout)
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if they are already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login/logout events
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

  // Force users to log in if they have no session
  if (!session) {
    return <Auth />;
  }

  // Show the main MedGuide dashboard if they are logged in
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}