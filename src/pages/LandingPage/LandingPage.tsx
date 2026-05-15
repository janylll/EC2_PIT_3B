import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  MapPin, Phone, ShieldCheck, Activity, Users, ArrowRight, HeartPulse, 
  Calendar, BrainCircuit, Building2, Smartphone, ChevronDown, 
  Star, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, HelpCircle
} from "lucide-react";

export interface LandingPageProps {
  onLaunchApp: () => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  // 1. STATE MANAGEMENT
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });

  // 2. DATA COLLECTIONS
  const [partnerHospitals] = useState([
    {
      name: "Northern Mindanao Medical Center (NMMC)",
      location: "J.R. Borja St, Cagayan de Oro",
      image: "/NMMC.jpg",
      tag: "Government Tertiary Center"
    },
    {
      name: "Maria Reyna Xavier University Hospital",
      location: "Corrales Ave, Cagayan de Oro",
      image: "/Maria-Reyna.jpg",
      tag: "Private University Training"
    },
    {
      name: "CDO Medical Center",
      location: "Yacal-Gomez St, Cagayan de Oro",
      image: "/CDO-Medical-Center.jpg",
      tag: "Private General Hospital"
    },
    {
      name: "Capitol University Medical City",
      location: "RN Pelaez Blvd, Cagayan de Oro",
      image: "/hospitals/cumc.jpg",
      tag: "Base Teaching Hospital"
    },
    {
      name: "Polymedic Medical Plaza",
      location: "Capistrano St, Cagayan de Oro",
      image: "/hospitals/polymedic.jpg",
      tag: "Modern Private Plaza"
    },
    {
      name: "J.R. Borja Memorial Hospital",
      location: "Tiano Bros St, Cagayan de Oro",
      image: "/hospitals/jr borja.jpg",
      tag: "City Public Hospital"
    }
  ]);

  const [testimonials] = useState([
    {
      quote: "CDO MedGuide saved us so much time during an emergency. We immediately found which partner hospital specialized in cardiology and open beds.",
      author: "Maria Santos",
      role: "Patient Family",
      location: "Nazareth, CDO",
      rating: 5
    },
    {
      quote: "The AI module correctly guided me to visit an orthopedist instead of a general clinic for my chronic knee issue. Booking was completed in under two minutes.",
      author: "Juan Dela Cruz",
      role: "App User",
      location: "Carmen, CDO",
      rating: 5
    },
    {
      quote: "Integrating our clinical hospital panel dashboard with this infrastructure streamlined our incoming patient queues and minimized desk backlogs.",
      author: "Dr. E. Lim, MD",
      role: "Chief of Clinic Operations",
      location: "Cagayan de Oro",
      rating: 5
    }
  ]);

  const [faqs] = useState([
    {
      question: "Is CDO MedGuide free to use for patients?",
      answer: "Yes, CDO MedGuide is entirely free for patients seeking medical facility routing, department directory references, and appointment tracking channels."
    },
    {
      question: "How does the AI Help feature assist me?",
      answer: "Our artificial intelligence parsing module accepts natural language symptom notes and securely analyzes clinical pathways to match you with corresponding healthcare specializations in CDO."
    },
    {
      question: "Are the appointment schedules synchronized in real-time?",
      answer: "Yes, we work directly alongside medical centers to synchronize active clinical hours and appointment slots instantly onto your patient dashboard profile."
    },
    {
      question: "How can our hospital register as a corporate partner?",
      answer: "Institutional operators can submit a verification query directly through our contact form. Our administrative board will process your application credentials to configure your custom workspace dashboard."
    }
  ]);

  // 3. ACTION HANDLERS
  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({ type: "error", msg: "Please fill out all operational form fields completely." });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setFormStatus({ type: "error", msg: "Please supply a valid secure email address pattern structure." });
      return;
    }
    setFormStatus({ type: "success", msg: "Message dispatched successfully! Our medical board will follow up shortly." });
    setFormState({ name: "", email: "", message: "" });
  };

  // Autoplay for testimonial slider animation layers
  useEffect(() => {
    const slideInterval = setInterval(handleNextTestimonial, 8000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen font-sans scroll-smooth">
      
      {/* NAVIGATION BAR HEADER */}
      <nav className="sticky top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 px-6 py-4 flex items-center justify-between shadow-xs transition-all">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="CDO MedGuide Logo" className="w-10 h-10 object-contain rounded-xl border border-green-100 shadow-inner" />
          <span className="text-xl font-black tracking-tight text-green-950">
            CDO <span className="text-green-600">MedGuide</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-semibold text-sm text-stone-600">
          <a href="#about" className="hover:text-green-700 transition-colors">About Us</a>
          <a href="#services" className="hover:text-green-700 transition-colors">Our Services</a>
          <a href="#partners" className="hover:text-green-700 transition-colors">Partner Hospitals</a>
          <a href="#testimonials" className="hover:text-green-700 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-green-700 transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-green-700 transition-colors">Contact</a>
        </div>
        <Button onClick={onLaunchApp} className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs px-5 h-9 transition-transform active:scale-[0.98] cursor-pointer">
          Launch App
        </Button>
      </nav>

      {/* HERO CALL-TO-ACTION FRAME */}
      <section className="relative px-6 py-20 lg:py-32 bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 text-white overflow-hidden text-center md:text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14532d_1px,transparent_1px),linear-gradient(to_bottom,#14532d_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 animate-pulse duration-1000" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-800/50 border border-green-700/50 text-xs font-semibold text-green-300 backdrop-blur-xs">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              Empowering Cagayan de Oro Healthcare Navigation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Your Health Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">Perfectly Guided.</span>
            </h1>
            <p className="text-green-100/90 text-base md:text-lg max-w-xl leading-relaxed">
              CDO MedGuide connects citizens directly to leading healthcare facilities, specialized clinical consultants, and simplified online booking services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button onClick={onLaunchApp} className="bg-green-500 hover:bg-green-600 text-stone-950 font-bold px-6 py-3 h-auto text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-950/40 group cursor-pointer transition-all duration-200">
                Find a Hospital Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a href="#about" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-green-700 text-white hover:bg-green-800/30 font-semibold px-6 py-3 h-auto text-base rounded-xl">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center relative animate-in fade-in zoom-in-75 duration-700">
            <div className="w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl absolute -inset-4 animate-ping duration-3000" />
            <img src="/icon.png" alt="Medical Hub Illustration" className="w-72 h-72 object-contain filter drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)]" />
          </div>
        </div>
      </section>

      {/* METRICS INFOGRAPHIC STATEMENT LAYER */}
      <section className="bg-white border-b border-green-100 py-10 px-6 relative z-20 shadow-xs">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1"><p className="text-3xl md:text-4xl font-black text-green-700">6</p><p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Partner Hospitals</p></div>
          <div className="space-y-1"><p className="text-3xl md:text-4xl font-black text-green-700">24/7</p><p className="text-stone-500 text-xs font-bold uppercase tracking-wider">AI Support Availability</p></div>
          <div className="space-y-1"><p className="text-3xl md:text-4xl font-black text-green-700">100%</p><p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Verified Specializations</p></div>
          <div className="space-y-1"><p className="text-3xl md:text-4xl font-black text-green-700">CDO</p><p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Region Focused</p></div>
        </div>
      </section>

      {/* SECTION: ABOUT US */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">About Us</h2>
          <h3 className="text-3xl font-black text-stone-900 tracking-tight">Bridging the Gap Between Patients and Specialized Care</h3>
          <p className="text-stone-600 font-medium">CDO MedGuide eliminates navigation friction in times of medical need throughout the Misamis Oriental region.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-xs space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><ShieldCheck className="w-6 h-6" /></div>
            <h4 className="text-lg font-bold text-green-950">Verified Medical Profiles</h4>
            <p className="text-stone-600 text-sm leading-relaxed">We coordinate real-time diagnostic updates directly with hospital boards to maintain accurate emergency parameters.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-xs space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><Activity className="w-6 h-6" /></div>
            <h4 className="text-lg font-bold text-green-950">AI-Powered Sorting</h4>
            <p className="text-stone-600 text-sm leading-relaxed">Find specializations across clinical pathways effortlessly using modern contextual queries and predictive search mechanics.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-xs space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><Users className="w-6 h-6" /></div>
            <h4 className="text-lg font-bold text-green-950">Unified Hub Navigation</h4>
            <p className="text-stone-600 text-sm leading-relaxed">Consolidates public and private primary centers under a single ecosystem for stress-free hospital location mapping.</p>
          </div>
        </div>
      </section>

      {/* SECTION: OUR SERVICES */}
      <section id="services" className="py-20 px-6 bg-white border-t border-green-100 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">Our Services</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Comprehensive Features Built for Patients & Hospitals</h3>
            <p className="text-stone-600 font-medium">Explore digital tools optimized to handle real-time medical scheduling, medical center lookups, and artificial intelligence help.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-green-600/20"><Building2 className="w-6 h-6" /></div>
              <div className="space-y-2"><h4 className="text-lg font-bold text-green-950">Advanced Hospital Directory</h4><p className="text-stone-600 text-sm leading-relaxed">Browse complete information sheets on medical center services, available beds, operation schedules, and contact methods across Cagayan de Oro.</p></div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-green-600/20"><Calendar className="w-6 h-6" /></div>
              <div className="space-y-2"><h4 className="text-lg font-bold text-green-950">Seamless Appointment Booking</h4><p className="text-stone-600 text-sm leading-relaxed">Book check-ups directly with partner diagnostic institutions. Schedule appointments online, receive tracking status tokens, and check history lists inside your profile.</p></div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-green-600/20"><BrainCircuit className="w-6 h-6" /></div>
              <div className="space-y-2"><h4 className="text-lg font-bold text-green-950">AI Medical Navigation Assistant</h4><p className="text-stone-600 text-sm leading-relaxed">Query our conversational AI module to match symptoms directly to specialized clinical departments, helping you find exactly where to go.</p></div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-green-600/20"><Smartphone className="w-6 h-6" /></div>
              <div className="space-y-2"><h4 className="text-lg font-bold text-green-950">Dedicated Institutional Dashboards</h4><p className="text-stone-600 text-sm leading-relaxed">Hospital operators unlock distinct portal frameworks to review incoming patient logs, manage consultation timetables, and control public record metrics.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PARTNER HOSPITALS */}
      <section id="partners" className="py-20 px-6 bg-green-50/50 border-t border-green-100 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">Partner Hospitals</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Direct Connections to CDO's Trusted Clinical Centers</h3>
            <p className="text-stone-600 font-medium">We work alongside the city's premier medical facilities to secure direct communication routing for standard scheduling.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerHospitals.map((hospital, idx) => (
              <Card key={idx} className="bg-white rounded-2xl overflow-hidden border-green-100 hover:border-green-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-stone-100 overflow-hidden relative">
                    <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className="absolute top-3 left-3 bg-green-950/80 backdrop-blur-xs text-green-300 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs tracking-wider uppercase">{hospital.tag}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="text-base text-green-950 font-bold line-clamp-2 leading-snug">{hospital.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="text-xs font-medium truncate">{hospital.location}</span>
                    </div>
                  </div>
                  <Button onClick={onLaunchApp} variant="outline" size="sm" className="w-full text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 text-xs font-bold h-9 rounded-xl cursor-pointer">
                    View Integration Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: USER TESTIMONIALS CAROUSEL */}
      <section id="testimonials" className="py-20 px-6 bg-white border-t border-green-100 scroll-mt-16 overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">Reviews</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Trusted by Local Residents & Medical Professionals</h3>
          </div>
          
          <div className="relative min-h-[220px] bg-stone-50 border border-green-100 rounded-3xl p-8 md:p-12 shadow-xs flex flex-col justify-between transition-all duration-500">
            <div className="absolute top-6 left-6 text-green-200 text-6xl font-serif select-none pointer-events-none">“</div>
            <p className="text-stone-700 text-base md:text-lg italic leading-relaxed relative z-10 font-medium text-center">
              {testimonials[currentTestimonial].quote}
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm font-black text-green-950 mt-1">{testimonials[currentTestimonial].author}</p>
              <p className="text-xs font-semibold text-stone-500">{testimonials[currentTestimonial].role} • <span className="text-green-600 font-bold">{testimonials[currentTestimonial].location}</span></p>
            </div>
          </div>

          {/* Carousel Manual Slider Buttons Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={handlePrevTestimonial} className="rounded-full border-green-200 text-green-700 hover:bg-green-50 shadow-xs h-9 w-9 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <div key={i} onClick={() => setCurrentTestimonial(i)} className={`h-2 rounded-full cursor-pointer transition-all ${currentTestimonial === i ? "w-6 bg-green-600" : "w-2 bg-stone-300"}`} />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextTestimonial} className="rounded-full border-green-200 text-green-700 hover:bg-green-50 shadow-xs h-9 w-9 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* NEW SECTION: FAQ ACCORDION BLOCK */}
      <section id="faq" className="py-20 px-6 bg-stone-50 border-t border-green-100 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white border border-green-100/70 rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
                  <button onClick={() => setActiveFaq(isOpen ? null : index)} className="w-full flex items-center justify-between p-5 text-left font-bold text-green-950 hover:bg-green-50/40 transition-colors cursor-pointer text-sm md:text-base gap-4">
                    <span className="flex items-center gap-2.5"><HelpCircle className="w-4 h-4 text-green-600 shrink-0" />{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-green-600 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? "max-h-40 border-t border-green-50" : "max-h-0"}`}>
                    <p className="p-5 text-stone-600 text-xs md:text-sm leading-relaxed bg-stone-50/30">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEW SECTION: DYNAMIC CONTACT FORM WITH VALIDATIONS */}
      <section id="contact" className="py-20 px-6 bg-white border-t border-green-100 scroll-mt-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-xs font-bold text-green-600 uppercase tracking-widest">Contact</h2>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Connect With Us</h3>
            <p className="text-stone-500 text-xs font-medium">Have questions or inquiries regarding corporate hospital board synchronization? Message our system managers.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 bg-stone-50 border border-green-100 p-6 md:p-8 rounded-3xl shadow-xs">
            {formStatus.type && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-xs md:text-sm font-semibold animate-in fade-in duration-200 ${formStatus.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-rose-100 text-rose-800 border border-rose-200"}`}>
                {formStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{formStatus.msg}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
              <input type="text" placeholder="Your name" value={formState.name} onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))} className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600 font-medium text-stone-900" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
              <input type="email" placeholder="name@example.com" value={formState.email} onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))} className="w-full h-10 px-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600 font-medium text-stone-900" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Message Body</label>
              <textarea rows={4} placeholder="Type your message details here..." value={formState.message} onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))} className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600 font-medium text-stone-900 resize-none" />
            </div>

            <Button type="submit" className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm shadow-md shadow-green-700/10 cursor-pointer pt-0.5">
              Dispatch Message
            </Button>
          </form>
        </div>
      </section>

      {/* FOOTER BLOCK */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 border-t border-stone-800 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-base">
              <img src="/icon.png" alt="" className="w-6 h-6 object-contain filter brightness-110" />
              CDO MedGuide
            </div>
            <p className="text-stone-500 text-xs max-w-xs">Navigating healthcare pathways across Cagayan de Oro City efficiently.</p>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <Phone className="w-4 h-4 text-green-500" />
            Emergency Hotline Routing Support Available 24/7
          </div>
          <p className="text-stone-600 text-xs">&copy; {new Date().getFullYear
()} CDO MedGuide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}