# 🏥 CDO MedGuide

**CDO MedGuide** is a modern, multi-tenant Software-as-a-Service (SaaS) web application designed to bridge the gap between patients and healthcare facilities in Cagayan de Oro City. It empowers patients with an intelligent AI Booking Agent and provides hospital administrators with a secure, centralized dashboard to manage appointments and view cross-hospital patient histories.

## ✨ Key Features

### For Patients
* **🤖 AI Booking Agent:** A state-of-the-art conversational assistant powered by Google's Gemini API that triages symptoms and autonomously books hospital appointments.
* **📍 Interactive Routing:** Embedded Google Maps integration to visualize travel routes and estimated times to local CDO hospitals.
* **📂 Profile Management:** Maintain a secure medical profile tracking blood type, allergies, and medical history.
* **🗂️ Appointment Tracking:** Separate views for Active Requests (Pending/Approved) and historical records (Completed/Declined).

### For Medical Facilities
* **🏥 Dedicated Hospital Dashboard:** A secure, role-based portal restricted to verified hospital personnel.
* **📋 Patient Case Files:** View comprehensive patient demographics, active triage notes, and their **entire appointment history across the CDO hospital network**.
* **✅ Queue Management:** Easily Approve, Decline, assign Doctors/Rooms, and mark patients as "Catered" to move them into the historical ledger.

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4, Shadcn UI (Radix Primitives), Lucide React (Icons)
* **Backend (BaaS):** Supabase (PostgreSQL Database, Authentication, Row Level Security)
* **AI Integration:** Google Generative AI (`gemini-2.5-flash`)
* **Routing:** React Router DOM (Client-side routing)
* **Deployment:** Vercel (Configured for SPA routing)

---

## 🚀 Setup & Installation

Follow these steps to run the application locally on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/Marcyuhhh/EC2_PIT_3B.git](https://github.com/Marcyuhhh/EC2_PIT_3B.git)
cd EC2_PIT_3B
```

### 2. Install dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project (next to `package.json`) and add your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Database Setup (Supabase)
To run this project, your Supabase PostgreSQL database requires the following tables:

`profiles` (id, role, full_name, phone, dob, blood_type, address, allergies, medical_history)

`appointments` (id, user_id, hospital, appointment_date, appointment_time, symptoms, assigned_doctor, assigned_room, status)

*Note: Ensure Row Level Security (RLS) is enabled and configured to allow cross-table joins so hospitals can view patient profiles.*

### 5. Start the Development Server
```bash
npm run dev
```
The application will start running on http://localhost:5173.