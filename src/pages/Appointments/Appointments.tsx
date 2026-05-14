import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Calendar, Clock, MapPin, Plus, Loader2, FileText, AlertCircle, Trash2, Edit2, CheckCircle2, Map } from "lucide-react";

const CDO_HOSPITALS = [
  "Northern Mindanao Medical Center (NMMC)",
  "J.R. Borja General Hospital",
  "Polymedic Medical Plaza",
  "Capitol University Medical Center",
  "Maria Reyna Xavier University Hospital"
];

// Helper function to generate Google Maps embed URL based on hospital name
const getMapUrl = (hospitalName: string) => {
  const query = encodeURIComponent(`${hospitalName} Cagayan de Oro City`);
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

export function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Map Panel State
  const [expandedMapId, setExpandedMapId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form State
  const [hospital, setHospital] = useState(CDO_HOSPITALS[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [primarySymptom, setPrimarySymptom] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNewAppointment = () => {
    setEditId(null);
    setHospital(CDO_HOSPITALS[0]);
    setDate("");
    setTime("");
    setPrimarySymptom("");
    setSymptomDuration("");
    setIsModalOpen(true);
  };

  const openEditAppointment = (app: any) => {
    setEditId(app.id);
    setHospital(app.hospital);
    setDate(app.appointment_date);
    setTime(app.appointment_time);
    
    const parts = app.symptoms?.split(" | Duration: ") || ["", ""];
    setPrimarySymptom(parts[0].replace("Feels: ", ""));
    setSymptomDuration(parts[1] || "");
    
    setIsModalOpen(true);
  };

  const deleteAppointment = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel and delete this appointment request?")) return;
    
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
      loadAppointments(); 
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const saveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const combinedSymptoms = `Feels: ${primarySymptom} | Duration: ${symptomDuration}`;

      const appointmentData = {
        user_id: user.id,
        hospital: hospital,
        appointment_date: date,
        appointment_time: time,
        symptoms: combinedSymptoms,
        status: "Pending" // Explicitly set to Pending for new/edited
      };

      if (editId) {
        const { error } = await supabase.from("appointments").update(appointmentData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("appointments").insert([appointmentData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      loadAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Book and manage your hospital visits</p>
        </div>
        <Button onClick={openNewAppointment} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
          <Plus className="w-5 h-5 mr-2" /> Book Visit
        </Button>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No appointments yet</h3>
          <p className="text-gray-500 mt-1">Click the button above to request a hospital visit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow border-gray-200 flex flex-col">
              <div className={`h-2 w-full ${app.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-400'}`} />
              <CardContent className="p-5 flex-1 flex flex-col">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <h3 className="font-bold text-gray-900 leading-tight">{app.hospital}</h3>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {app.status || "Pending"}
                  </span>
                </div>

                <div className="space-y-3 mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-green-600" /> {app.appointment_date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-green-600" /> {app.appointment_time}
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-3 text-green-600 mt-0.5 shrink-0" /> 
                    <span className="line-clamp-2 italic">"{app.symptoms}"</span>
                  </div>
                </div>

                {app.status === 'Approved' && (
                  <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg text-sm">
                    <p><span className="font-semibold text-green-800">Assigned Doctor:</span> {app.assigned_doctor || "TBD"}</p>
                    <p><span className="font-semibold text-green-800">Room / Dept:</span> {app.assigned_room || "TBD"}</p>
                  </div>
                )}

                {/* Card Actions (Bottom Area) */}
                <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                  
                  {/* EXPAND MAP BUTTON */}
                  <Button 
                    variant="secondary" 
                    className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => setExpandedMapId(expandedMapId === app.id ? null : app.id)}
                  >
                    <Map className="w-4 h-4 mr-2" /> {expandedMapId === app.id ? "Hide Route & Map" : "View Route & Details"}
                  </Button>

                  {/* Edit & Delete Actions (Only if pending) */}
                  {app.status !== 'Approved' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-gray-600" onClick={() => openEditAppointment(app)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteAppointment(app.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* THE EXPANDABLE MAP PANEL */}
                {expandedMapId === app.id && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 animate-in slide-in-from-top-2">
                    <iframe 
                      src={getMapUrl(app.hospital)}
                      width="100%" 
                      height="250" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${app.hospital} Map`}
                    />
                    <div className="p-3 bg-gray-50 text-xs text-gray-600 text-center">
                      Interactive map provided by Google Maps
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* THE BOOKING / Q&A MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editId ? "Edit Request" : "Setup Appointment"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={saveAppointment} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select CDO Hospital / Clinic</label>
                <select 
                  value={hospital} 
                  onChange={(e) => setHospital(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {CDO_HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="h-12" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="h-12" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
                <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Medical Triage Q&A
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">1. What symptoms are you feeling today?</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Severe headache, fever, stomach pain..." 
                    value={primarySymptom} 
                    onChange={(e) => setPrimarySymptom(e.target.value)} 
                    required 
                    className="bg-white h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">2. How long have you felt this way?</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Since yesterday, for 3 days..." 
                    value={symptomDuration} 
                    onChange={(e) => setSymptomDuration(e.target.value)} 
                    required 
                    className="bg-white h-12"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={saving}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {editId ? "Update Request" : "Submit to Hospital"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}