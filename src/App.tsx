import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js"; 
import { supabase } from "./lib/supabase";

// Import your pages
import { Home } from "./pages/Home/Home";
import { MyAppointments } from "./pages/Appointments/Appointments";
import { AIHelp } from "./pages/AiHelp/AiHelp";
import { Auth } from "./pages/Auth/Auth";
import { Profile } from "./pages/Profile/Profile";
import { HospitalDashboard } from "./pages/HospitalDashboard/HospitalDashboard";
import { LandingPage } from "./pages/LandingPage/LandingPage"; // Import your new landing page component

// Import the separated Layout UI
import { Layout } from "./components/layout/Layout";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string>("patient");
  const [loading, setLoading] = useState(true);
  
  // Controls if unauthenticated users see the Landing Page or the Auth Portal
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        await supabase.auth.signOut();
        setSession(null);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // Fetch the user's role to determine where to route them
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setRole(profile.role || "patient");
        }
      }
      setLoading(false);
    };

    verifyUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(null);
        setRole("patient");
      } else {
        verifyUser(); // Re-verify to get the role on fresh login
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  // TRAFFIC CONTROLLER FOR UNAUTHENTICATED GUESTS
  if (!session) {
    // Show the login portal if they clicked an app-launch or call-to-action button
    if (showAuthForm) {
      return (
        <div className="relative min-h-screen bg-gray-50">
          {/* Back button to return to the landing overview */}
          <button 
            onClick={() => setShowAuthForm(false)}
            className="absolute top-4 left-4 z-50 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold px-4 py-2 text-xs rounded-xl shadow-xs transition-all"
          >
            ← Back to Information Page
          </button>
          <Auth />
        </div>
      );
    }
    
    // Default fallback view shows the new public marketing landing ecosystem
    return <LandingPage onLaunchApp={() => setShowAuthForm(true)} />;
  }

  // TRAFFIC CONTROLLER: Redirect Hospitals directly to their dashboard
  if (role === "hospital") {
    return <HospitalDashboard />;
  }

  // STANDARD ROUTE: Patients go to the main layout with the new footer
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/ai-help" element={<AIHelp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
