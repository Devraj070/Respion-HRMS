"use client";

import { useState } from "react";
// Note: If you have Lucide icons installed, you can uncomment these. 
// Otherwise, I've used emojis as fallback.
// import { MapPin, LogIn, LogOut, Clock } from "lucide-react";

export default function MyAttendance() {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState("");
    const [log, setLog] = useState([]);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        const res = await fetch(`/api/get-location?lat=${lat}&lng=${lng}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
                            },
                        });
                        const data = await res.json();
                        const address = data?.address || "Unknown location";
                        setLocation(address);
                        resolve(address);
                    } catch {
                        reject("Location fetch failed");
                    }
                },
                () => reject("Permission denied")
            );
        });
    };

    const handleAction = async (type) => {
        setLoading(true);
        try {
            const address = await getLocation();
            const endpoint = type === "Punch In" ? "/api/attendance/punch-in" : "/api/attendance/punch-out";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                },
                body: JSON.stringify({ location: address }),
            });

            const data = await res.json();

            if (data.success) {
                setLog((prev) => [
                    {
                        type,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        address,
                    },
                    ...prev,
                ]);
            } else {
                alert(data.message || "Action failed");
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <div className="text-4xl mb-2">🕒</div>
                    <h1 className="text-2xl font-bold tracking-tight">Staff Attendance</h1>
                    <p className="text-indigo-100 text-xs opacity-80 uppercase tracking-widest mt-1">GPS Verified</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Location Status */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase mb-1">
                            <span>📍 Current Location</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium italic">
                            {location || "Waiting for GPS signal..."}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => handleAction("Punch In")}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-emerald-100"
                        >
                            {loading ? "..." : "Punch In"}
                        </button>

                        <button
                            onClick={() => handleAction("Punch Out")}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-rose-100"
                        >
                            {loading ? "..." : "Punch Out"}
                        </button>
                    </div>

                    {/* Logs */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Recent Activity</h3>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {log.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div>
                                        <p className={`text-xs font-bold ${item.type === 'Punch In' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {item.type}
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.address}</p>
                                    </div>
                                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                            {log.length === 0 && (
                                <p className="text-center text-slate-300 text-xs py-4 italic">No activity yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}