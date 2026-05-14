import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { User, Phone, Droplet, MapPin, Loader2, Save, AlertCircle } from "lucide-react";

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    full_name: "", phone: "", dob: "", blood_type: "", address: "", allergies: "", medical_history: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          dob: data.dob || "",
          blood_type: data.blood_type || "",
          address: data.address || "",
          allergies: data.allergies ? data.allergies.join(", ") : "",
          medical_history: data.medical_history ? data.medical_history.join(", ") : "",
        });
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const allergiesArray = formData.allergies.split(",").map(s => s.trim()).filter(Boolean);
      const historyArray = formData.medical_history.split(",").map(s => s.trim()).filter(Boolean);

      const { error } = await supabase.from("profiles").update({
        full_name: formData.full_name,
        phone: formData.phone,
        dob: formData.dob,
        blood_type: formData.blood_type,
        address: formData.address,
        allergies: allergiesArray,
        medical_history: historyArray,
      }).eq("id", user.id);

      if (error) throw error;
      setMessage("Profile successfully updated!");
    } catch (error) {
      console.error("Error saving profile", error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="pt-6">
          {message && (
            <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              <AlertCircle className="w-5 h-5" /> {message}
            </div>
          )}
          
          <form onSubmit={saveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4"/> Full Name</label>
              <Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="mt-1" /></div>
              
              <div><label className="text-sm font-medium flex items-center gap-2"><Phone className="w-4 h-4"/> Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1" /></div>
              
              <div><label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="mt-1" /></div>
              
              <div><label className="text-sm font-medium flex items-center gap-2"><Droplet className="w-4 h-4"/> Blood Type</label>
              <Input value={formData.blood_type} onChange={e => setFormData({...formData, blood_type: e.target.value})} placeholder="e.g. O+" className="mt-1" /></div>
              
              <div className="md:col-span-2"><label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4"/> Address</label>
              <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1" /></div>
              
              <div className="md:col-span-2"><label className="text-sm font-medium">Allergies (comma separated)</label>
              <Input value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="e.g. Peanuts, Penicillin" className="mt-1" /></div>
              
              <div className="md:col-span-2"><label className="text-sm font-medium">Medical History (comma separated)</label>
              <Input value={formData.medical_history} onChange={e => setFormData({...formData, medical_history: e.target.value})} placeholder="e.g. Asthma, Hypertension" className="mt-1" /></div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />} Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}