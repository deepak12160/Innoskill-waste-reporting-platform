import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('../components/MapContainer'), { ssr: false });

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // 1. Initial Load
    axios.get(`${API_URL}/api/reports`).then(res => setReports(res.data));

    // 2. Real-time Connection
    const socket = io(API_URL);
    socket.on('new-report', (newPin) => {
      setReports(prev => [newPin, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="h-screen bg-slate-100 flex flex-col p-4">
      <header className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-black text-green-700 uppercase tracking-tighter">WasteWatch Dashboard</h1>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="font-bold text-sm text-gray-500">LIVE SENSORS ACTIVE</span>
        </div>
      </header>
      
      <div className="flex-1 relative">
        <MapContainer reports={reports} />
      </div>
    </div>
  );
}