import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";

const appointments = [
  {
    id: 1,
    date: "May 15, 2026",
    time: "10:00 AM",
    doctor: "Dr. Maria Santos",
    specialty: "Cardiologist",
    hospital: "Northern Mindanao Medical Center (NMMC)",
    address: "J.R. Borja St, Cagayan de Oro",
    status: "Upcoming",
    location: { lat: 8.4542, lng: 124.6319 },
  },
  {
    id: 2,
    date: "May 20, 2026",
    time: "2:30 PM",
    doctor: "Dr. Roberto Cruz",
    specialty: "General Practitioner",
    hospital: "Maria Reyna Xavier University Hospital",
    address: "Corrales Ave, Cagayan de Oro",
    status: "Upcoming",
    location: { lat: 8.4833, lng: 124.6472 },
  },
  {
    id: 3,
    date: "May 28, 2026",
    time: "9:00 AM",
    doctor: "Dr. Linda Reyes",
    specialty: "Dermatologist",
    hospital: "CDO Medical Center",
    address: "Yacal-Gomez St, Cagayan de Oro",
    status: "Upcoming",
    location: { lat: 8.4822, lng: 124.6511 },
  },
];

export function MyAppointments() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleAppointment = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage and view your upcoming medical appointments</p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div key={appointment.id} className="relative">
            {/* Timeline Line */}
            {index !== appointments.length - 1 && (
              <div className="absolute left-6 top-20 w-0.5 h-full bg-blue-200 z-0" />
            )}

            <Card className="border-blue-100 shadow-md hover:shadow-lg transition-all relative z-10">
              {/* Clickable Header */}
              <CardHeader
                className="pb-4 cursor-pointer hover:bg-blue-50/50 transition-colors"
                onClick={() => toggleAppointment(appointment.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-blue-900">{appointment.hospital}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          {appointment.status}
                        </Badge>
                        {expandedId === appointment.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{appointment.date}</span>
                        <Clock className="w-4 h-4 ml-4 text-blue-500" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>
                          {appointment.doctor} - {appointment.specialty}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Expandable Content */}
              {expandedId === appointment.id && (
                <CardContent className="pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="ml-16 space-y-4">
                    {/* Full Address */}
                    <div className="flex items-start gap-2 text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Location</p>
                        <p className="text-sm">{appointment.address}</p>
                      </div>
                    </div>

                    {/* Google Maps Placeholder */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Location Map</h3>
                      <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-blue-200 relative overflow-hidden">
                        {/* Map Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <MapPin className="w-12 h-12 text-blue-500 mx-auto" />
                            <p className="text-gray-600 font-medium">Google Maps Integration</p>
                            <p className="text-sm text-gray-500">{appointment.hospital}</p>
                            <p className="text-xs text-gray-400">
                              Lat: {appointment.location.lat}, Lng: {appointment.location.lng}
                            </p>
                          </div>
                        </div>
                        {/* Decorative map-like pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="grid grid-cols-8 h-full">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div key={i} className="border border-gray-300" />
                            ))}
                          </div>
                        </div>
                        {/* Pin marker */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                          <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg" />
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500 -mt-1 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              You don't have any upcoming appointments. Use the AI Help to schedule your first appointment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
