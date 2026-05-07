"use client";

import { useEffect, useState } from "react";
import {
    Building2,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Pencil,
    MapPin,
    Navigation2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatTime(timeStr) {
    if (!timeStr || timeStr === "—") return "—";
    try {
        const date = new Date(timeStr); // handles ISO strings AND "HH:mm" fallback

        // Check if it parsed as a valid date
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'   // ✅ IST conversion
            });
        }

        // Fallback: plain "HH:mm" string (no timezone info)
        const [hours, minutes] = timeStr.split(':');
        const d = new Date();
        d.setHours(parseInt(hours), parseInt(minutes));
        return d.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    } catch (e) { return timeStr; }
}

function initials(name = "") {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const STATUS_STYLE = {
    present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    absent: "bg-rose-50 text-rose-700 border-rose-200",
    "half-day": "bg-amber-50 text-amber-700 border-amber-200",
};

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────

function StatusPill({ status }) {
    const style = STATUS_STYLE[status?.toLowerCase()] ?? "bg-slate-50 text-slate-600 border-slate-200";
    const label = status === "half-day" ? "Half Day" : status?.charAt(0).toUpperCase() + status?.slice(1);

    return (
        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${style}`}>
            {label}
        </span>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("/api/dashboard", {
                    headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                });
                const result = await res.json();
                setData(result);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    const company = data?.company;
    const attendance = data?.attendance || data?.todayAttendance || [];
    const summary = data?.summary || {};

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-12">

            {/* STICKY HEADER */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 md:px-8">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src={company?.logo || "/logo.png"}
                            alt="Company Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 bg-slate-50 border border-slate-100 shadow-sm object-cover"
                        />
                        <div>
                            <h1 className="text-lg font-black text-slate-900 leading-none truncate max-w-[150px] md:max-w-none">
                                {company?.name || "Dashboard"}
                            </h1>
                            <p className="text-[10px]  text-indigo-600 tracking-tight">{company?.description || "HRMS Live"}</p>
                        </div>
                    </div>

                    <Link href="/?tab=settings" className="flex items-center gap-2 text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
                        <Pencil size={14} className="text-slate-400" />
                        <span className="hidden sm:inline">Edit Company</span>
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 md:px-8 mt-6">

                {/* RESPONSIVE STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                    <StatCard label="Total" value={summary.total} icon={<Users size={18} />} color="indigo" />
                    <StatCard label="Present" value={summary.present} icon={<CheckCircle2 size={18} />} color="emerald" />
                    <StatCard label="Absent" value={summary.absent} icon={<XCircle size={18} />} color="rose" />
                    <StatCard label="Half Day" value={summary.halfDay} icon={<Clock size={18} />} color="amber" />
                </div>

                {/* LOGS CONTAINER */}
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Attendance Records</h3>
                        <Navigation2 size={14} className="text-slate-300" />
                    </div>

                    {/* DESKTOP TABLE (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">In Details</th>
                                    <th className="px-6 py-4">Out Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendance.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px] border border-white shadow-sm">
                                                    {initials(item.user?.name)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{item.user?.name || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={item.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-bold text-slate-700">{formatTime(item.checkIn)}</div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={10} />{item.checkInLocation || "—"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-bold text-slate-700">{formatTime(item.checkOut)}</div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={10} />{item.checkOutLocation || "—"}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD LIST (Hidden on Desktop) */}
                    <div className="md:hidden divide-y divide-slate-50">
                        {attendance.map((item) => (
                            <div key={item._id} className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-100">
                                            {initials(item.user?.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.user?.name || "Unknown"}</p>
                                            <StatusPill status={item.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-slate-50/50 p-2.5 rounded-xl">
                                        <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Check In</p>
                                        <p className="text-xs font-bold text-slate-700">{formatTime(item.checkIn)}</p>
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.checkInLocation || "No Location"}</p>
                                    </div>
                                    <div className="bg-slate-50/50 p-2.5 rounded-xl">
                                        <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Check Out</p>
                                        <p className="text-xs font-bold text-slate-700">{formatTime(item.checkOut)}</p>
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.checkOutLocation || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50",
        emerald: "text-emerald-600 bg-emerald-50",
        rose: "text-rose-600 bg-rose-50",
        amber: "text-amber-600 bg-amber-50"
    };

    return (
        <div className="bg-white border border-slate-100 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className={`p-2 rounded-lg md:rounded-xl ${colors[color]}`}>{icon}</div>
                <span className="text-xl md:text-2xl font-black text-slate-900">{value || 0}</span>
            </div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        </div>
    );
}