import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";

const hospitals = [
  {
    id: 1,
    name: "Northern Mindanao Medical Center (NMMC)",
    address: "J.R. Borja St, Cagayan de Oro",
    phone: "(088) 857-5282",
    hours: "24/7 Emergency",
    specialties: ["Emergency Care", "Surgery", "Cardiology"],
  },
  {
    id: 2,
    name: "Maria Reyna Xavier University Hospital",
    address: "Corrales Ave, Cagayan de Oro",
    phone: "(088) 858-4641",
    hours: "24/7 Emergency",
    specialties: ["Pediatrics", "Internal Medicine", "OB-GYN"],
  },
  {
    id: 3,
    name: "CDO Medical Center",
    address: "Yacal-Gomez St, Cagayan de Oro",
    phone: "(088) 856-0912",
    hours: "24/7 Emergency",
    specialties: ["Orthopedics", "Radiology", "Laboratory"],
  },
  {
    id: 4,
    name: "Capitol University Medical City",
    address: "RN Pelaez Blvd, Cagayan de Oro",
    phone: "(088) 858-3280",
    hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    specialties: ["General Medicine", "Surgery", "Diagnostics"],
  },
  {
    id: 5,
    name: "Polymedic Medical Plaza",
    address: "Capistrano St, Cagayan de Oro",
    phone: "(088) 857-2912",
    hours: "Mon-Sun: 8:00 AM - 8:00 PM",
    specialties: ["Family Medicine", "Dental", "Physical Therapy"],
  },
  {
    id: 6,
    name: "J.R. Borja Memorial Hospital",
    address: "Tiano Bros St, Cagayan de Oro",
    phone: "(088) 856-1011",
    hours: "24/7 Emergency",
    specialties: ["Emergency Care", "ICU", "Surgery"],
  },
];

export function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-3">Welcome to CDO MedGuide</h1>
        <p className="text-blue-100 text-lg max-w-2xl">
          Your trusted medical navigation platform for Cagayan de Oro City. Find hospitals, manage appointments, and get AI-powered health assistance.
        </p>
      </div>

      {/* Hospitals Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hospitals & Clinics in CDO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-300">
              <CardHeader className="pb-4">
                <div className="w-full h-48 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🏥
                  </div>
                </div>
                <CardTitle className="text-lg text-blue-900">{hospital.name}</CardTitle>
                <CardDescription className="space-y-2 mt-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 shrink-0 text-blue-500" />
                    <span className="text-sm">{hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 shrink-0 text-blue-500" />
                    <span className="text-sm">{hospital.hours}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
