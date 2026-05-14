import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, CheckCircle, XCircle, Clock, Calendar, FileText, UserPlus, MapPin, LogOut } from "lucide-react";

export function HospitalDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  // Approval Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [doctorName, setDoctorName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get the hospital's name from their profile
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      const hName = profile?.full_name || "Unknown Hospital";
      setHospitalName(hName);

      // 2. Fetch only the appointments for THIS hospital
      const { data: apps, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles:user_id (full_name, phone, dob, allergies, medical_history)
        `)
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

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "Approved",
          assigned_doctor: doctorName,
          assigned_room: roomName
        })
        .eq("id", selectedApp.id);

      if (error) throw error;

      setSelectedApp(null);
      fetchHospitalData(); // Refresh list
    } catch (error) {
      console.error("Error approving:", error);
      alert("Failed to approve appointment.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async (id: number) => {
    if (!window.confirm("Are you sure you want to decline this appointment?")) return;
    
    try {
      const { error } = await supabase.from("appointments").update({ status: "Declined" }).eq("id", id);
      if (error) throw error;
      fetchHospitalData();
    } catch (error) {
      console.error("Error declining:", error);
    }
  };

  const pendingApps = appointments.filter(a => a.status === "Pending");
  const approvedApps = appointments.filter(a => a.status === "Approved");

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-green-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hospital Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <MapPin className="w-6 h-6 text-white" />
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`pb-3 px-2 text-lg font-bold transition-colors border-b-4 ${activeTab === "pending" ? "border-green-600 text-green-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            Pending Requests <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-sm">{pendingApps.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("approved")}
            className={`pb-3 px-2 text-lg font-bold transition-colors border-b-4 ${activeTab === "approved" ? "border-green-600 text-green-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            Approved Appointments <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-sm">{approvedApps.length}</span>
          </button>
        </div>

        {/* Display List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "pending" ? pendingApps : approvedApps).length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500 text-lg">
              No {activeTab} appointments found.
            </div>
          ) : (
            (activeTab === "pending" ? pendingApps : approvedApps).map((app) => (
              <Card key={app.id} className="overflow-hidden border-gray-200 shadow-sm flex flex-col">
                <div className={`h-2 shrink-0 ${app.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-400'}`} />
                <CardContent className="p-6 flex-1 flex flex-col">
                  
                  {/* Patient Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{app.profiles?.full_name || "Unknown Patient"}</h3>
                    <p className="text-sm text-gray-500">Contact: {app.profiles?.phone || "N/A"}</p>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" /> {app.appointment_date}
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-green-600" /> {app.appointment_time}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-6 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center mb-2">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" /> Patient Triage Notes
                    </h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100 whitespace-pre-line leading-relaxed">
                      {app.symptoms?.replace(" | ", "\n")}
                    </p>
                  </div>

                  {/* Actions / Approved State */}
                  {app.status === "Pending" ? (
                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                      <Button onClick={() => { setSelectedApp(app); setDoctorName(""); setRoomName(""); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button onClick={() => handleDecline(app.id)} variant="outline" className="text-red-600 hover:bg-red-50">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <p className="text-sm text-gray-800"><span className="font-bold">Doctor:</span> {app.assigned_doctor}</p>
                        <p className="text-sm text-gray-800"><span className="font-bold">Room:</span> {app.assigned_room}</p>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* APPROVAL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Assign & Approve</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleApprove} className="p-6 space-y-5">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <p className="text-sm font-semibold text-blue-900">Approving for: {selectedApp.profiles?.full_name}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
  <UserPlus className="w-4 h-4" /> Assign Doctor
</label>
                <Input 
                  value={doctorName} 
                  onChange={(e) => setDoctorName(e.target.value)} 
                  placeholder="e.g. Dr. Juan Dela Cruz" 
                  className="h-12 text-base"
                  required 
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
  <MapPin className="w-4 h-4" /> Assign Room / Department
</label>
                <Input 
                  value={roomName} 
                  onChange={(e) => setRoomName(e.target.value)} 
                  placeholder="e.g. Room 302, ER, Cardiology" 
                  className="h-12 text-base"
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6" disabled={processing}>
                  {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Confirm Approval"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}