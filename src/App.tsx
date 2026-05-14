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

// Import the separated Layout UI
import { Layout } from "./components/layout/Layout";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string>("patient");
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

  if (!session) {
    return <Auth />;
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