// ADD THESE IMPORTS AT THE VERY TOP OF App.tsx
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Auth } from "./pages/Auth/Auth";
import { Session } from "@supabase/supabase-js";

// ... (Keep all your existing Layout code, Home, AIHelp imports exactly the same) ...

// UPDATE THE App FUNCTION AT THE BOTTOM:
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if they are already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for login/logout events (like when they click 'Sign In')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a blank screen or a spinner while Supabase checks the session
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50">Loading...</div>;
  }

  // If no active session, force them to the Auth page
  if (!session) {
    return <Auth />;
  }

  // If logged in, show the full Dashboard Navigation
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}