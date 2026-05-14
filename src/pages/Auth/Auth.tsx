import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Mail, Lock, Loader2, User, Phone, Calendar, Eye, EyeOff } from "lucide-react";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // New state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              dob: dob,
            }
          }
        });
        if (error) throw error;
        setSuccessMsg("Account created! You can now sign in.");
        setIsLogin(true); 
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND IMAGE LAYER */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/auth-bg.jpg')", 
        }}
      />
      
      {/* SOLID COLOR OVERLAY */}
      <div className="absolute inset-0 bg-green-900/60" />

      {/* THE AUTH CARD LAYER - Increased to max-w-lg for a wider, comfier panel */}
      <Card className="w-full max-w-lg shadow-2xl border-white/30 relative z-10 bg-white/95 backdrop-blur-sm">
        {/* Increased padding for breathing room */}
        <CardContent className="pt-10 pb-10 px-10">
          <div className="flex flex-col items-center mb-10">
            
            {/* CUSTOM PNG LOGO */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-5 overflow-hidden p-2">
              {/* CHANGE 'logo.png' TO YOUR ACTUAL FILE NAME IN THE PUBLIC FOLDER */}
              <img src="/icon.png" alt="CDO MedGuide Logo" className="w-full h-full object-contain" />
            </div>
            
            {/* Larger Text for older users */}
            <h1 className="text-3xl font-bold text-gray-900">CDO MedGuide</h1>
            <p className="text-gray-500 text-base mt-2 text-center">
              {isLogin ? "Welcome back to your health dashboard" : "Create an account to get started"}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-base mb-6 border border-red-200 shadow-sm">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-base mb-6 border border-green-200 shadow-sm">
              {successMsg}
            </div>
          )}

          {/* Increased space between inputs (space-y-5) */}
          <form onSubmit={handleAuth} className="space-y-5">
            
            {!isLogin && (
              <>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-12 h-14 text-base focus-visible:ring-green-500" required />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <Input type="tel" placeholder="Contact Number (e.g. 09123456789)" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-12 h-14 text-base focus-visible:ring-green-500" required />
                </div>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="pl-12 h-14 text-base text-gray-600 focus-visible:ring-green-500" required />
                </div>
              </>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 text-base focus-visible:ring-green-500" required />
            </div>
            
            {/* PASSWORD WITH SHOW/HIDE TOGGLE */}
            <div className="relative group">
              <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (Min 6 characters)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-12 pr-12 h-14 text-base focus-visible:ring-green-500" 
                required 
                minLength={6} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-green-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>

            {/* Taller button with larger text */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-semibold shadow-md transition-all mt-2" disabled={loading}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-8 text-center">
            {/* Larger bottom text */}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); setSuccessMsg(""); }} className="text-base text-green-700 hover:text-green-800 hover:underline focus:outline-none font-medium">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}