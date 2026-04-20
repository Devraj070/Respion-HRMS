"use client";
import { useEffect, useState } from "react";
import {
    Calendar,
    FileText,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight
} from "lucide-react";

export default function LeavePage({ user }) {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        type: "",
        fromDate: "",
        toDate: "",
        reason: ""
    });

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    const fetchLeaves = async () => {
        try {
            const res = await fetch(`/api/leave/${user._id}`, {
                headers: {
                    "x-api-key": API_KEY || "",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setLeaves(Array.isArray(data) ? data : data?.data || []);
        } catch (err) {
            console.error(err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/leave/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY || "",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                fetchLeaves();
                setForm({ type: "", fromDate: "", toDate: "", reason: "" });
                alert("Leave application submitted successfully!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen font-sans">

            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Leave Management</h1>
                <p className="text-gray-500 font-medium">Request time off and track your application status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. UPMARKET FORM (Left Side) */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm sticky top-8">
                        <div className="flex items-center gap-2 mb-6 text-indigo-600">
                            <FileText size={20} strokeWidth={2.5} />
                            <h2 className="font-bold text-lg text-gray-800">New Request</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Leave Type */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Leave Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                                    required
                                >
                                    <option value="">Choose category...</option>
                                    <option value="Sick">Sick Leave</option>
                                    <option value="Casual">Casual Leave</option>
                                    <option value="Paid">Earned / Paid Leave</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">From</label>
                                    <input
                                        type="date"
                                        value={form.fromDate}
                                        onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">To</label>
                                    <input
                                        type="date"
                                        value={form.toDate}
                                        onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Reason for Leave</label>
                                <textarea
                                    placeholder="Explain your request..."
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[100px]"
                                    required
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : <><Send size={18} /> Submit Application</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. LEAVE HISTORY (Right Side) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Clock size={18} className="text-gray-400" /> Recent History
                        </h2>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                            Total: {leaves.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-20 text-center animate-pulse text-gray-400 font-medium">Loading history...</div>
                    ) : (
                        <div className="space-y-4">
                            {leaves.length > 0 ? (
                                leaves.map((item) => (
                                    <div key={item._id} className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${getStatusColor(item.status).bg}`}>
                                                {getStatusIcon(item.status)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                                                    {item.type} Leave
                                                </h3>
                                                <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                    <Calendar size={12} /> {formatDate(item.fromDate)} — {formatDate(item.toDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusColor(item.status).text} ${getStatusColor(item.status).lightBg}`}>
                                                {item.status}
                                            </span>
                                            <p className="text-[11px] text-gray-400 italic font-medium max-w-[150px] truncate">
                                                {item.reason}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                                    <p className="text-gray-400 font-medium">No leave requests found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- HELPER COMPONENTS/FUNCTIONS ---

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function getStatusIcon(status) {
    const s = status?.toLowerCase();
    if (s === 'approved') return <CheckCircle size={20} className="text-green-600" />;
    if (s === 'rejected') return <XCircle size={20} className="text-red-600" />;
    return <AlertCircle size={20} className="text-amber-600" />;
}

function getStatusColor(status) {
    const s = status?.toLowerCase();
    if (s === 'approved') return { bg: 'bg-green-50', text: 'text-green-700', lightBg: 'bg-green-100' };
    if (s === 'rejected') return { bg: 'bg-red-50', text: 'text-red-700', lightBg: 'bg-red-100' };
    return { bg: 'bg-amber-50', text: 'text-amber-700', lightBg: 'bg-amber-100' };
}