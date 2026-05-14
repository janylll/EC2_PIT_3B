import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PatientProfile } from "../profile/PatientProfile";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between min-h-16 md:min-h-20 py-2 md:py-0 gap-y-3">
            
            <div className="flex items-center gap-3 shrink-0 w-1/2 md:w-auto md:flex-1 order-1">
              <img src="/icon.png" alt="CDO MedGuide Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">CDO MedGuide</span>
            </div>

            <nav className="flex items-center justify-center gap-2 sm:gap-4 w-full md:w-auto order-3 md:order-2 pb-2 md:pb-0 overflow-x-auto scrollbar-hide">
              <NavLink to="/" end className={({ isActive }) => `px-4 py-2 text-sm md:text-base font-semibold transition-all rounded-full whitespace-nowrap ${isActive ? "text-green-800 bg-green-100 shadow-sm" : "text-gray-500 hover:text-green-700 hover:bg-green-50"}`}>
                Home
              </NavLink>
              <NavLink to="/appointments" className={({ isActive }) => `px-4 py-2 text-sm md:text-base font-semibold transition-all rounded-full whitespace-nowrap ${isActive ? "text-green-800 bg-green-100 shadow-sm" : "text-gray-500 hover:text-green-700 hover:bg-green-50"}`}>
                My Appointments
              </NavLink>
              <NavLink to="/ai-help" className={({ isActive }) => `px-4 py-2 text-sm md:text-base font-semibold transition-all rounded-full whitespace-nowrap ${isActive ? "text-green-800 bg-green-100 shadow-sm" : "text-gray-500 hover:text-green-700 hover:bg-green-50"}`}>
                AI Help
              </NavLink>
            </nav>

            <div className="flex items-center justify-end shrink-0 w-1/2 md:w-auto md:flex-1 order-2 md:order-3">
              <div 
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button className="focus:outline-none focus:ring-4 focus:ring-green-100 rounded-full cursor-default transition-all">
                  <Avatar className="h-11 w-11 border-2 border-green-200 hover:border-green-400 transition-colors shadow-sm">
                    <AvatarImage src="" alt="Patient" />
                    <AvatarFallback className="bg-green-100 text-green-700 font-bold text-lg">Me</AvatarFallback>
                  </Avatar>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full pt-2 w-64 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <PatientProfile onClose={() => setProfileOpen(false)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* flex-1 forces the main content to grow and pushes the footer down */}
      <main className="flex-1 pt-32 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* The New Footer! */}
      <Footer />
    </div>
  );
}