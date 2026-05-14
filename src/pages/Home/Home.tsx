import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MapPin, Phone, Clock, X, ExternalLink, Search, Sparkles } from "lucide-react";

// Explicit structural TypeScript interface declaration
export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
  images: string;
  description: string;
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Northern Mindanao Medical Center (NMMC)",
    address: "J.R. Borja St, Cagayan de Oro",
    phone: "(088) 857-5282",
    hours: "24/7 Emergency",
    specialties: ["Emergency Care", "Surgery", "Cardiology"],
    images: "/NMMC.jpg",
    description: "A premier tertiary government training hospital in Northern Mindanao, renowned for providing comprehensive advanced medical procedures, regional trauma management, and specialized intensive cardiac clinical programs."
  },
  {
    id: 2,
    name: "Maria Reyna Xavier University Hospital",
    address: "Corrales Ave, Cagayan de Oro",
    phone: "(088) 858-4641",
    hours: "24/7 Emergency",
    specialties: ["Pediatrics", "Internal Medicine", "OB-GYN"],
    images: "/Maria-Reyna.jpg",
    description: "A historic, community-trusted Catholic health facility operating in partnership with Xavier University. It blends modern clinical advancements with holistic diagnostic care, specializing in maternal health and family medicine wellness."
  },
  {
    id: 3,
    name: "CDO Medical Center",
    address: "Yacal-Gomez St, Cagayan de Oro",
    phone: "(088) 856-0912",
    hours: "24/7 Emergency",
    specialties: ["Orthopedics", "Radiology", "Laboratory"],
    images: "/CDO-Medical-Center.jpg",
    description: "Centrally established private medical institution specializing in sophisticated orthopedic surgery pathways, modern diagnostic laboratory profiling, and rapid urgent care rehabilitation services."
  },
  {
    id: 4,
    name: "Capitol University Medical City",
    address: "RN Pelaez Blvd, Cagayan de Oro",
    phone: "(088) 858-3280",
    hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    specialties: ["General Medicine", "Surgery", "Diagnostics"],
    images: "/hospitals/cumc.jpg",
    description: "A state-of-the-art base teaching hospital integrated with advanced diagnostic technologies, high-capacity surgery theaters, and broad outpatient general medicine facilities."
  },
  {
    id: 5,
    name: "Polymedic Medical Plaza",
    address: "Capistrano St, Cagayan de Oro",
    phone: "(088) 857-2912",
    hours: "Mon-Sun: 8:00 AM - 8:00 PM",
    specialties: ["Family Medicine", "Dental", "Physical Therapy"],
    images: "/hospitals/polymedic.jpg",
    description: "A premier modern medical plaza focused heavily on private continuous family medicine, personalized physical rehabilitation suites, and comprehensive preventative dental care configurations."
  },
  {
    id: 6,
    name: "J.R. Borja Memorial Hospital",
    address: "Tiano Bros St, Cagayan de Oro",
    phone: "(088) 856-1011",
    hours: "24/7 Emergency",
    specialties: ["Emergency Care", "ICU", "Surgery"],
    images: "/hospitals/jr borja.jpg",
    description: "The primary city-funded public hospital dedicated to offering subsidized healthcare services, equipped with emergency response teams, critical care icu infrastructure, and routine operational surgeries."
  },
];

export function Home() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent background body page scrolling when modal is active
  useEffect(() => {
    if (selectedHospital) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedHospital]);

  // Dynamic filter computing based on the new search layout selection input string
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 relative min-h-screen">
      
      {/* HIGH-FIDELITY DESIGNED GREEN HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 shadow-xl border border-green-800/30 p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[340px]">
        
        {/* Decorative Grid Overlay Pattern Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#166534_1px,transparent_1px),linear-gradient(to_bottom,#166534_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        
        {/* Dynamic Glassmorphic Structural Background Accent Ring */}
        <div className="absolute right-[-10%] top-[-20%] w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-[5%] bottom-[-10%] w-64 h-64 rounded-full bg-green-400/10 blur-2xl pointer-events-none" />

        {/* Hero Meta Layout Container */}
        <div className="relative z-10 space-y-6 max-w-3xl">
          
          {/* Platform Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-800/60 border border-green-700/50 text-xs font-semibold text-green-300 w-fit backdrop-blur-xs shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            AI-Assisted Navigation System Active
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-xs">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">CDO MedGuide</span>
            </h1>
            <p className="text-green-100/90 text-sm md:text-base lg:text-lg font-medium max-w-2xl leading-relaxed">
              Your trusted medical navigation platform for Cagayan de Oro City. Find hospitals, manage clinic appointments, and query diagnostic healthcare access parameters effortlessly.
            </p>
          </div>

          {/* Integrated Real-time Multi-Filter Search Bar */}
          <div className="relative max-w-xl w-full pt-2">
            <div className="absolute inset-y-0 left-3 pl-1 flex items-center pointer-events-none z-20">
              <Search className="h-5 w-5 text-green-600/90" />
            </div>
            <input
              type="text"
              placeholder="Search by hospital name or specialty (e.g., Surgery, Cardiology)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-12 pl-11 pr-4 bg-white/95 hover:bg-white text-stone-900 placeholder-stone-500 rounded-xl border border-green-700/20 shadow-md focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium transition-all text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center pr-1 text-stone-400 hover:text-stone-600 text-xs font-bold pt-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hospitals Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hospitals & Clinics in CDO</h2>
          {searchQuery && (
            <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
              Found {filteredHospitals.length} results
            </span>
          )}
        </div>

        {filteredHospitals.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 font-medium">
            No health facilities match your search criteria. Try filtering by another clinic specialty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-xl transition-all duration-300 border-green-100 hover:border-green-300 flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
                    <img 
                      src={hospital.images} 
                      alt={hospital.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                  </div>
                  <CardTitle className="text-lg text-green-900 min-h-[3.5rem] line-clamp-2">{hospital.name}</CardTitle>
                  <CardDescription className="space-y-2 mt-3">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                      <span className="text-sm line-clamp-1">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 shrink-0 text-green-500" />
                      <span className="text-sm">{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 shrink-0 text-green-500" />
                      <span className="text-sm">{hospital.hours}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty) => (
                      <span key={specialty} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    onClick={() => setSelectedHospital(hospital)} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm transition-transform active:scale-[0.98]"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CENTERED POP-UP OVERLAY MODAL */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${
          selectedHospital ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300" onClick={() => setSelectedHospital(null)} />
        
        {/* Fixed Frame Container */}
        <div 
          className={`relative bg-white border border-green-100 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transition-all duration-300 transform ${
            selectedHospital ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          {selectedHospital && (
            <>
              {/* Close Button */}
              <Button 
                onClick={() => setSelectedHospital(null)} 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4 z-10 rounded-full bg-white/80 backdrop-blur-xs text-gray-500 hover:text-gray-800 hover:bg-green-50 shadow-xs border border-green-100"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 items-stretch">
                {/* Desktop Image Section */}
                <div className="hidden md:block rounded-xl overflow-hidden shadow-inner bg-gray-100 relative min-h-[350px]">
                  <img src={selectedHospital.images} alt={selectedHospital.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                
                {/* Mobile Fallback Image Container */}
                <div className="block md:hidden h-44 rounded-xl overflow-hidden shadow-inner bg-gray-100">
                  <img src={selectedHospital.images} alt={selectedHospital.name} className="w-full h-full object-cover" />
                </div>

                {/* Content Side Panel */}
                <div className="flex flex-col justify-between space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-green-900 mb-3 pr-8 line-clamp-2 leading-snug">
                      {selectedHospital.name}
                    </h2>
                    
                    {/* Interactive Google Maps Link Button */}
                    <button
                      className="group text-green-700 border border-green-200 bg-green-50/70 hover:bg-green-100 hover:border-green-300 rounded-xl flex items-center gap-2 w-fit transition-all duration-200 shadow-xs active:scale-[0.98] cursor-pointer mb-4 px-3 py-1.5"
                      onClick={() => {
                        const destination = encodeURIComponent(`${selectedHospital.name}, ${selectedHospital.address}`);
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0 group-hover:animate-bounce transition-transform" />
                      <span className="text-xs font-semibold max-w-[180px] sm:max-w-xs truncate underline underline-offset-2 decoration-green-300 group-hover:decoration-green-600">
                        {selectedHospital.address}
                      </span>
                      <ExternalLink className="w-3 h-3 text-green-500 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* About Section */}
                    <div className="pb-4 border-b border-gray-100">
                      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        About the Facility
                      </h3>
                      <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-normal line-clamp-4 md:line-clamp-5">
                        {selectedHospital.description}
                      </p>
                    </div>
                  </div>

                  {/* Specialties Section */}
                  <div className="py-2">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Available Specialties
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHospital.specialties.map((specialty) => (
                        <span key={specialty} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 flex items-center gap-3 w-full">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 h-10 text-sm font-semibold shadow-sm rounded-xl transition-all">
                      Book an Appointment
                    </Button>
                    <Button 
                      onClick={() => setSelectedHospital(null)} 
                      variant="outline" 
                      className="w-auto h-10 border-green-200 text-green-700 hover:bg-green-50 rounded-xl text-sm px-5 transition-all"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
