import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { User, Phone, Droplet, Calendar, MapPin, Edit, LogOut } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { supabase } from "../../lib/supabase"; // Supabase connection

export function PatientProfile() {
  const patientData = {
    fullName: "Juan Dela Cruz",
    age: 35,
    dateOfBirth: "January 15, 1991",
    bloodType: "O+",
    contactNumber: "+63 912 345 6789",
    email: "juan.delacruz@email.com",
    address: "123 Corrales Avenue, Cagayan de Oro City",
    allergies: ["Penicillin", "Peanuts", "Shellfish"],
    medicalHistory: [
      "Hypertension (controlled)",
      "Seasonal Allergies",
      "Appendectomy (2015)",
    ],
    emergencyContact: {
      name: "Maria Dela Cruz",
      relationship: "Spouse",
      phone: "+63 912 345 6780",
    },
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6 py-6">
      {/* Profile Header */}
      <div className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-blue-200">
          <AvatarImage src="" alt={patientData.fullName} />
          <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white text-2xl">
            JD
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-gray-800">{patientData.fullName}</h2>
        <p className="text-gray-600 mt-1">Patient ID: #CDO-2024-1234</p>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Separator />

      {/* Basic Information */}
      <Card className="border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Age</span>
            <span className="font-medium text-gray-800">{patientData.age} years old</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date of Birth</span>
            <span className="font-medium text-gray-800">{patientData.dateOfBirth}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Blood Type</span>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              <Droplet className="w-3 h-3 mr-1" />
              {patientData.bloodType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <span className="text-gray-600 text-sm">Phone Number</span>
            <p className="font-medium text-gray-800">{patientData.contactNumber}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600 text-sm">Email Address</span>
            <p className="font-medium text-gray-800">{patientData.email}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Address
            </span>
            <p className="font-medium text-gray-800">{patientData.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <Droplet className="w-5 h-5 text-orange-600" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {patientData.allergies.map((allergy) => (
              <Badge
                key={allergy}
                className="bg-orange-200 text-orange-800 hover:bg-orange-200"
              >
                {allergy}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card className="border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {patientData.medicalHistory.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-red-800">
            <Phone className="w-5 h-5 text-red-600" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-gray-600 text-sm">Name</span>
            <p className="font-medium text-gray-800">{patientData.emergencyContact.name}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Relationship</span>
            <p className="font-medium text-gray-800">{patientData.emergencyContact.relationship}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Phone</span>
            <p className="font-medium text-gray-800">{patientData.emergencyContact.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button 
        onClick={handleLogout} 
        variant="destructive" 
        className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white shadow-md"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}