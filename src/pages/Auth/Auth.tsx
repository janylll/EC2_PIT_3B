import { useState } from "react";
import { supabase } from "../../lib/supabase"; // Your Supabase connection
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Activity, Mail, Lock, Loader2 } from "lucide-react";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Handle Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Check your email to verify your account!");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">CDO MedGuide</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin ? "Welcome back to your health dashboard" : "Create an account to get started"}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}