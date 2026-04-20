// "use client";

// import { useEffect, useState } from "react";

// export default function AdminLeave() {
//     const [leaves, setLeaves] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchLeaves = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const res = await fetch("/api/leave", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                 }
//             });

//             const data = await res.json();

//             if (data.success) {
//                 setLeaves(data.data);
//             }
//         } catch (err) {
//             console.log(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchLeaves();
//     }, []);

//     const updateStatus = async (id, status) => {
//         try {
//             const token = localStorage.getItem("token");

//             const res = await fetch(`/api/leave/update-status/${id}`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                 },
//                 body: JSON.stringify({ status })
//             });

//             const data = await res.json();

//             if (data.success) {
//                 fetchLeaves();
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     if (loading) return <p className="p-6">Loading...</p>;

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold mb-4">
//                 🧑‍💼 Leave Management
//             </h1>

//             <div className="bg-white rounded-xl shadow overflow-x-auto">
//                 <table className="w-full text-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="p-3 text-left">Employee</th>
//                             <th>Type</th>
//                             <th>Dates</th>
//                             <th>Reason</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {leaves.map((leave) => (
//                             <tr key={leave._id} className="border-t hover:bg-gray-50">
//                                 {/* USER */}
//                                 <td className="p-3">
//                                     <div className="font-medium">
//                                         {leave.user?.name}
//                                     </div>
//                                     <div className="text-xs text-gray-400">
//                                         {leave.user?.employeeId}
//                                     </div>
//                                 </td>

//                                 {/* TYPE */}
//                                 <td className="capitalize">
//                                     {leave.type}
//                                 </td>

//                                 {/* DATES */}
//                                 <td>
//                                     {new Date(leave.fromDate).toLocaleDateString()} →
//                                     {new Date(leave.toDate).toLocaleDateString()}
//                                 </td>

//                                 {/* REASON */}
//                                 <td className="text-gray-500 text-xs max-w-[200px]">
//                                     {leave.reason || "—"}
//                                 </td>

//                                 {/* STATUS */}
//                                 <td>
//                                     <span className={`px-2 py-1 rounded text-xs ${leave.status === "approved"
//                                         ? "bg-green-100 text-green-700"
//                                         : leave.status === "rejected"
//                                             ? "bg-red-100 text-red-700"
//                                             : "bg-yellow-100 text-yellow-700"
//                                         }`}>
//                                         {leave.status}
//                                     </span>
//                                 </td>

//                                 {/* ACTIONS */}
//                                 <td className="flex gap-2 p-2">
//                                     <button
//                                         onClick={() => updateStatus(leave._id, "approved")}
//                                         className="bg-green-500 text-white px-2 py-1 rounded text-xs"
//                                     >
//                                         Approve
//                                     </button>

//                                     <button
//                                         onClick={() => updateStatus(leave._id, "rejected")}
//                                         className="bg-red-500 text-white px-2 py-1 rounded text-xs"
//                                     >
//                                         Reject
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState, useMemo } from "react";
import {
    CheckCircle,
    XCircle,
    Calendar as CalendarIcon,
    Search,
    Loader2,
    Inbox,
    FilterX,
    Briefcase,
    Clock
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLeave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/leave", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            });
            const data = await res.json();
            if (data.success) setLeaves(data.data);
        } catch (err) {
            toast.error("Failed to load leave requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    // Date grouping helper
    const getGroupLabel = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const groupedLeaves = useMemo(() => {
        const filtered = leaves.filter(leave => {
            const createdDate = new Date(leave.createdAt).toISOString().split('T')[0];
            const matchesDate = selectedDate ? createdDate === selectedDate : true;
            const matchesSearch =
                leave.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                leave.type?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDate && matchesSearch;
        });

        const groups = {};
        filtered.forEach(leave => {
            const label = getGroupLabel(leave.createdAt);
            if (!groups[label]) groups[label] = [];
            groups[label].push(leave);
        });
        return groups;
    }, [leaves, searchQuery, selectedDate]);

    const updateStatus = async (id, status) => {
        const loadingToast = toast.loading(`Updating status...`);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/leave/update-status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Leave ${status}`, { id: loadingToast });
                fetchLeaves();
            }
        } catch (err) {
            toast.error("Update failed", { id: loadingToast });
        }
    };

    if (loading && leaves.length === 0) {
        return <div className="flex h-screen items-center justify-center bg-[#FBFBFE]"><Loader2 className="animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="p-4 md:p-8 bg-[#FBFBFE] min-h-screen text-slate-600">
            <Toaster />

            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                            <Briefcase size={20} />
                        </div>
                        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                            Leave <span className="font-bold">Requests</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm ml-12">Manage employee time-off and attendance.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm min-w-max">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 outline-none font-bold cursor-pointer"
                        />
                        {selectedDate && (
                            <button onClick={() => setSelectedDate("")} className="text-red-500 hover:text-rose-500">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {Object.keys(groupedLeaves).length > 0 ? (
                        Object.entries(groupedLeaves).map(([dateLabel, items]) => (
                            <div key={dateLabel} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest whitespace-nowrap">
                                        {dateLabel}
                                    </h2>
                                    <div className="h-[1px] w-full bg-slate-200/50"></div>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block bg-white rounded-t-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-blue-950 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Employee</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Leave Type</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Reason</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Duration</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {items.map((leave) => (
                                                <tr key={leave._id} className="group hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <p className="text-slate-900 font-bold">{leave.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium uppercase">{leave.user?.employeeId}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md capitalize">
                                                            {leave.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-slate-500 text-xs italic max-w-[250px]">
                                                        "{leave.reason || "No reason provided"}"
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                                                            <Clock size={14} className="text-slate-300" />
                                                            {new Date(leave.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                            <span className="text-slate-300 mx-1">→</span>
                                                            {new Date(leave.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <StatusBadge status={leave.status} />
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <ActionButton icon={<CheckCircle size={18} />} color="text-emerald-500" onClick={() => updateStatus(leave._id, "approved")} />
                                                            <ActionButton icon={<XCircle size={18} />} color="text-rose-500" onClick={() => updateStatus(leave._id, "rejected")} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="grid grid-cols-1 gap-4 md:hidden">
                                    {items.map((leave) => (
                                        <div key={leave._id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                        {leave.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-900 font-bold leading-none">{leave.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-bold">{leave.user?.employeeId}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={leave.status} />
                                            </div>

                                            <div className="bg-slate-50/80 p-4 rounded-2xl space-y-3 border border-slate-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Leave Type</span>
                                                    <span className="text-xs font-bold text-slate-800 capitalize">{leave.type}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Duration</span>
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="pt-2 border-t border-slate-200/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reason</p>
                                                    <p className="text-xs text-slate-600 italic">"{leave.reason || "No reason provided"}"</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={() => updateStatus(leave._id, "approved")}
                                                    className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(leave._id, "rejected")}
                                                    className="flex-1 bg-rose-500 text-white py-3 rounded-2xl font-bold text-xs shadow-lg shadow-rose-100 active:scale-95 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                            <Inbox className="mx-auto text-slate-200 mb-4" size={50} />
                            <p className="text-slate-400 font-medium">No leave requests found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable Components
function StatusBadge({ status }) {
    const styles = {
        approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rejected: "bg-rose-50 text-rose-600 border-rose-100",
        pending: "bg-amber-50 text-amber-600 border-amber-100"
    };
    return (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest border font-bold ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

function ActionButton({ icon, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`p-3 ${color} hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 rounded-2xl transition-all active:scale-90`}
        >
            {icon}
        </button>
    );
}