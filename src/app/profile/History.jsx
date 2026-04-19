"use client";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    Timer,
    MapPin,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react";

export default function AttendanceUI() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            const res = await fetch("/api/attendance/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "" // Optional: if you want to use an API key
                }
            });
            const result = await res.json();
            setData(result.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // 📊 Aggregations
    const present = data.filter(d => d.status === "present").length;
    const lates = data.filter(d => d.isLate).length;
    const totalOvertime = data.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-100 border-b-indigo-600 rounded-full"></div>
                <p className="text-slate-400 text-sm font-medium">Loading records...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Time & Attendance</h2>
                    <p className="text-slate-500 text-sm font-medium">Review your work hours and GPS-verified logs.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-600">Active Session</span>
                    </div>
                </div>
            </div>

            {/* 📈 Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Days"
                    value={data.length}
                    icon={<CalendarDays size={20} className="text-indigo-600" />}
                    color="bg-indigo-50"
                />
                <StatCard
                    title="Days Present"
                    value={present}
                    icon={<CheckCircle2 size={20} className="text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <StatCard
                    title="Late Arrivals"
                    value={lates}
                    icon={<AlertTriangle size={20} className="text-amber-600" />}
                    color="bg-amber-50"
                />
                <StatCard
                    title="Overtime Hrs"
                    value={`${totalOvertime.toFixed(1)}h`}
                    icon={<Zap size={20} className="text-purple-600" />}
                    color="bg-purple-50"
                />
            </div>

            {/* 📅 Detailed History Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Timer size={18} className="text-slate-400" /> Recent Logs
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50">
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold">Punch In/Out</th>
                                <th className="px-6 py-4 font-bold">Working Hours</th>
                                <th className="px-6 py-4 font-bold">GPS Location</th>
                                <th className="px-6 py-4 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.length > 0 ? data.map((item, i) => (
                                <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                                    {/* Date */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">
                                                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </span>
                                            {item.isLate && (
                                                <span className="text-[9px] font-black text-amber-600 uppercase">Late Entry</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Timing */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                                {item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                            </span>
                                            <span className="text-slate-300">→</span>
                                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                                {item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Hours */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-700">{item.workingHours?.toFixed(1) || "0.0"}h</span>
                                            {item.overtimeHours > 0 && (
                                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                                    +{item.overtimeHours} OT
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <MapPin size={14} />
                                            <span className="text-[11px] font-medium max-w-[150px] truncate">
                                                {item.checkInLocation || "N/A"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-right">
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <CalendarDays size={40} className="mb-2" />
                                            <p className="text-sm font-medium">No records found for this period</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-800">{value}</p>
            </div>
            <div className={`p-3 ${color} rounded-2xl`}>
                {icon}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        present: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Present" },
        absent: { bg: "bg-rose-50", text: "text-rose-700", label: "Absent" },
        "half-day": { bg: "bg-amber-50", text: "text-amber-700", label: "Half Day" }
    };

    const config = configs[status] || { bg: "bg-slate-50", text: "text-slate-600", label: status };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}