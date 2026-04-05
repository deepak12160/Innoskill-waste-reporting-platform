import { useState } from 'react';
import axios from 'axios';

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const submitReport = () => {
    if (!title) return alert("Describe the waste issue!");
    setStatus("Locating via GPS...");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        title: title,
        location: JSON.stringify({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "Automatic GPS Detection"
        })
      };

      try {
        await axios.post(`${API_URL}/api/reports`, payload);
        setStatus("✅ Report Submitted! Look at the Map.");
        setTitle("");
      } catch (err) {
        setStatus("❌ Error. Is the backend running?");
      }
    }, () => setStatus("❌ Please enable GPS."));
  };

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Report Trash 🗑️</h2>
        <p className="text-gray-400 mb-8">Snap a change in your community.</p>
        
        <input 
          className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl mb-4 focus:border-green-500 outline-none transition-all"
          placeholder="e.g., Plastic heap near the gate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <button 
          onClick={submitReport}
          className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform shadow-xl shadow-green-200"
        >
          SEND REPORT
        </button>
        {status && <p className="mt-6 text-center font-medium text-green-800 bg-green-50 py-2 rounded-lg">{status}</p>}
      </div>
    </div>
  );
}