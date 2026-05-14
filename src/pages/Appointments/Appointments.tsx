import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Calendar, Clock, Plus, Loader2, Map } from "lucide-react";
import { MapEmbed } from "../../components/map/MapEmbed";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  hospital: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null); // Tracks which map is open

  // Form States
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("Northern Mindanao Medical Center");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("appointments").select("*").eq("user_id", user.id).order("appointment_date", { ascending: true });
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase.from("appointments").insert([{
          user_id: user.id, doctor: doctorName, specialty, hospital, appointment_date: date, appointment_time: time, status: "Upcoming",
      }]);
      if (error) throw error;

      fetchAppointments();
      setIsDialogOpen(false);
      setDoctorName(""); setSpecialty(""); setDate(""); setTime("");
    } catch (error) {
      console.error("Error saving appointment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("appointments").delete().eq("id", id);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600">Schedule and manage your healthcare visits in CDO.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" /> Book Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader><DialogTitle className="text-xl text-blue-900">Schedule New Appointment</DialogTitle></DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4 mt-4">
              <div><label className="text-sm font-medium text-gray-700">Doctor Name</label><Input required value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="mt-1" /></div>
              <div><label className="text-sm font-medium text-gray-700">Specialty</label><Input required value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1" /></div>
              <div>
                <label className="text-sm font-medium text-gray-700">Hospital</label>
                <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm mt-1" value={hospital} onChange={(e) => setHospital(e.target.value)}>
                  <option>Northern Mindanao Medical Center</option><option>J.R. Borja General Hospital</option><option>Capitol University Medical City</option><option>Maria Reyna Xavier University Hospital</option><option>Polymedic Medical Plaza</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Date</label><Input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Time</label><Input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" /></div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Confirm Appointment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">You have no upcoming appointments.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{apt.doctor}</h3>
                      <Badge className="bg-blue-100 text-blue-700">{apt.status}</Badge>
                    </div>
                    <p className="text-blue-600 font-medium text-sm">{apt.specialty}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{apt.appointment_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{apt.appointment_time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                      <Map className="w-4 h-4 mr-2" /> {expandedId === apt.id ? "Hide Route" : "View Route"}
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(apt.id)}>Cancel</Button>
                  </div>
                </div>
                {/* EXPANDABLE MAP SECTION */}
                {expandedId === apt.id && <MapEmbed hospital={apt.hospital} />}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}