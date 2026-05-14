import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, CheckCircle, XCircle, Clock, Calendar, FileText, UserPlus, MapPin, LogOut, CheckSquare, History, User, Phone, Droplet, AlertTriangle, Building } from "lucide-react";

export function HospitalDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "history">("pending");

  // Detailed Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [doctorName, setDoctorName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Patient History State
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      const hName = profile?.full_name || "Unknown Hospital";
      setHospitalName(hName);

      const { data: apps, error } = await supabase
        .from("appointments")
        .select(`*, profiles:user_id (full_name, phone, dob, blood_type, address, allergies, medical_history)`)
        .eq("hospital", hName)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(apps || []);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH ALL APPOINTMENTS FOR A SPECIFIC PATIENT (Across all hospitals)
  const openPatientDetails = async (app: any) => {
    setSelectedApp(app);
    setDoctorName(app.assigned_doctor || "");
    setRoomName(app.assigned_room || "");
    setLoadingHistory(true);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", app.user_id)
        .order("appointment_date", { ascending: false });
        
      if (error) throw error;
      
      // Filter out the current appointment so we only see PAST/OTHER history
      const historyOnly = (data || []).filter(h => h.id !== app.id);
      setPatientHistory(historyOnly);
    } catch (error) {
      console.error("Error fetching patient history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const { error } = await supabase.from("appointments").update({
        status: "Approved", assigned_doctor: doctorName, assigned_room: roomName
      }).eq("id", selectedApp.id);
      if (error) throw error;
      setSelectedApp(null);
      fetchHospitalData(); 
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async (id: number) => {
    if (!window.confirm("Are you sure you want to decline this appointment?")) return;
    try {
      await supabase.from("appointments").update({ status: "Declined" }).eq("id", id);
      setSelectedApp(null);
      fetchHospitalData();
    } catch (error) {
      console.error("Error declining:", error);
    }
  };

  const handleComplete = async (id: number) => {
    if (!window.confirm("Confirm that this patient has been catered to?")) return;
    try {
      await supabase.from("appointments").update({ status: "Completed" }).eq("id", id);
      setSelectedApp(null);
      fetchHospitalData();
    } catch (error) {
      console.error("Error completing:", error);
    }
  };

  const pendingApps = appointments.filter(a => a.status === "Pending");
  const approvedApps = appointments.filter(a => a.status === "Approved");
  const historyApps = appointments.filter(a => a.status === "Completed" || a.status === "Declined");
  const currentList = activeTab === "pending" ? pendingApps : activeTab === "approved" ? approvedApps : historyApps;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-green-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{hospitalName}</h1>
              <p className="text-sm text-green-700 font-medium">Facility Management Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()} className="text-gray-600">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* TABS */}
        <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200 pb-px">
          <button onClick={() => setActiveTab("pending")} className={`pb-3 px-2 text-lg font-bold transition-colors border-b-4 ${activeTab === "pending" ? "border-green-600 text-green-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            Pending Requests <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-sm">{pendingApps.length}</span>
          </button>
          <button onClick={() => setActiveTab("approved")} className={`pb-3 px-2 text-lg font-bold transition-colors border-b-4 ${activeTab === "approved" ? "border-green-600 text-green-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            Approved <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-sm">{approvedApps.length}</span>
          </button>
          <button onClick={() => setActiveTab("history")} className={`pb-3 px-2 text-lg font-bold transition-colors border-b-4 flex items-center gap-2 ${activeTab === "history" ? "border-blue-600 text-blue-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <History className="w-5 h-5" /> History <span className="bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full text-sm">{historyApps.length}</span>
          </button>
        </div>

        {/* SMALLER, COMPACT APPOINTMENT BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentList.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">No {activeTab} records found.</div>
          ) : (
            currentList.map((app) => (
              <Card 
                key={app.id} 
                onClick={() => openPatientDetails(app)}
                className={`overflow-hidden border-gray-200 shadow-sm flex flex-col cursor-pointer hover:border-green-400 hover:shadow-md transition-all ${app.status === 'Completed' || app.status === 'Declined' ? 'opacity-70 bg-gray-50' : 'bg-white'}`}
              >
                <div className={`h-1.5 shrink-0 ${app.status === 'Approved' ? 'bg-green-500' : app.status === 'Pending' ? 'bg-yellow-400' : app.status === 'Declined' ? 'bg-red-500' : 'bg-blue-400'}`} />
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{app.profiles?.full_name || "Unknown"}</h3>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3 mr-1" /> {app.appointment_date}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 mr-1" /> {app.appointment_time}
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-xs text-gray-700 line-clamp-2 italic border border-blue-100/50 mt-auto">
                    "{app.symptoms?.split(" | ")[0].replace("Feels: ", "")}"
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* BIGGER PANEL: PATIENT CASE FILE MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Patient Case File</h2>
                  <p className="text-sm text-gray-500">Req ID: #{selectedApp.id} • Status: <span className="font-semibold text-gray-700">{selectedApp.status}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">×</button>
            </div>
            
            {/* Modal Body (Scrollable Grid) */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* LEFT COLUMN: Patient Info & Triage */}
                <div className="space-y-6">
                  {/* Demographics Card */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Patient Demographics</h3>
                    <div className="space-y-3">
                      <p className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> <span className="font-medium">Name:</span> {selectedApp.profiles?.full_name}</p>
                      <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> <span className="font-medium">Phone:</span> {selectedApp.profiles?.phone || "N/A"}</p>
                      <p className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> <span className="font-medium">DOB:</span> {selectedApp.profiles?.dob || "N/A"}</p>
                      <p className="text-sm flex items-center gap-2"><Droplet className="w-4 h-4 text-gray-400"/> <span className="font-medium">Blood Type:</span> {selectedApp.profiles?.blood_type || "N/A"}</p>
                      <p className="text-sm flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 shrink-0"/> <span className="font-medium">Address:</span> {selectedApp.profiles?.address || "N/A"}</p>
                    </div>
                  </div>

                  {/* Medical History Card */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Medical Context</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Known Allergies</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedApp.profiles?.allergies?.length ? selectedApp.profiles.allergies.map((a: string) => <span key={a} className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium border border-red-100">{a}</span>) : <span className="text-sm text-gray-500">None reported</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medical History</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedApp.profiles?.medical_history?.length ? selectedApp.profiles.medical_history.map((m: string) => <span key={m} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">{m}</span>) : <span className="text-sm text-gray-500">None reported</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Triage Notes */}
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Current Triage Notes</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedApp.symptoms?.replace(" | ", "\n")}</p>
                  </div>
                </div>

                {/* RIGHT COLUMN: Actions & History */}
                <div className="space-y-6 flex flex-col h-full">
                  
                  {/* Management Actions */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Request Management</h3>
                    
                    {selectedApp.status === "Pending" && (
                      <form onSubmit={handleApprove} className="space-y-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><UserPlus className="w-4 h-4" /> Assign Doctor</label>
                          <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Juan Dela Cruz" required />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"><MapPin className="w-4 h-4" /> Assign Room</label>
                          <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="e.g. Room 302, ER" required />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button type="button" variant="outline" className="flex-1 text-red-600" onClick={() => handleDecline(selectedApp.id)}><XCircle className="w-4 h-4 mr-2" /> Decline</Button>
                          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={processing}>{processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Approve</>}</Button>
                        </div>
                      </form>
                    )}

                    {selectedApp.status === "Approved" && (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                          <p className="text-gray-800"><span className="font-bold">Doctor:</span> {selectedApp.assigned_doctor}</p>
                          <p className="text-gray-800"><span className="font-bold">Room:</span> {selectedApp.assigned_room}</p>
                        </div>
                        <Button onClick={() => handleComplete(selectedApp.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white"><CheckSquare className="w-4 h-4 mr-2" /> Mark as Catered</Button>
                      </div>
                    )}

                    {(selectedApp.status === "Completed" || selectedApp.status === "Declined") && (
                      <div className="text-center py-4 text-gray-500 font-medium">
                        This request is closed ({selectedApp.status}).
                      </div>
                    )}
                  </div>

                  {/* Past Appointments List */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-75">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><History className="w-4 h-4 text-gray-500" /> Patient Cross-Hospital History</h3>
                    
                    {loadingHistory ? (
                      <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
                    ) : patientHistory.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 text-center">No other appointments found in network.</div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {patientHistory.map((hist) => (
                          <div key={hist.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-bold text-gray-800 leading-tight">{hist.hospital}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hist.status === 'Completed' ? 'bg-blue-100 text-blue-700' : hist.status === 'Approved' ? 'bg-green-100 text-green-700' : hist.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {hist.status}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{hist.appointment_date} @ {hist.appointment_time}</span>
                            <span className="text-xs text-gray-600 line-clamp-1 italic mt-1">"{hist.symptoms?.split(" | ")[0].replace("Feels: ", "")}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}