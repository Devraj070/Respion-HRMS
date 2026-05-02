"use client";

import { useEffect, useState, useMemo } from "react";
import {
    CheckCircle,
    XCircle,
    CreditCard,
    Search,
    Calendar as CalendarIcon,
    Loader2,
    Inbox,
    FilterX,
    LayoutDashboard
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ExpenseManagement() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/expenses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ""
                }
            });
            const data = await res.json();
            if (data.success) setExpenses(data.data);
        } catch (err) {
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const getGroupLabel = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const groupedExpenses = useMemo(() => {
        const filtered = expenses.filter(exp => {
            const expDate = new Date(exp.createdAt).toISOString().split('T')[0];
            const matchesDate = selectedDate ? expDate === selectedDate : true;
            const matchesSearch = exp.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exp.category?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDate && matchesSearch;
        });

        const groups = {};
        filtered.forEach(exp => {
            const label = getGroupLabel(exp.createdAt);
            if (!groups[label]) groups[label] = [];
            groups[label].push(exp);
        });
        return groups;
    }, [expenses, searchQuery, selectedDate]);

    const updateStatus = async (id, status) => {
        const loadingToast = toast.loading(`Updating...`);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/expenses/status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Expense ${status}`, { id: loadingToast });
                fetchExpenses();
            }
        } catch (err) {
            toast.error("Update failed", { id: loadingToast });
        }
    };

    if (loading && expenses.length === 0) {
        return <div className="flex h-screen items-center justify-center bg-[#FBFBFE]"><Loader2 className="animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="p-4 md:p-8 bg-[#FBFBFE] min-h-screen text-slate-600">
            <Toaster />

            <div className="max-w-9xl mx-auto">
                {/* Main Page Heading */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                            Expense <span className="font-bold">Claims</span>
                        </h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <div className="relative flex-grow">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none shadow-sm"
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
                    {Object.keys(groupedExpenses).length > 0 ? (
                        Object.entries(groupedExpenses).map(([dateLabel, items]) => (
                            <div key={dateLabel} className="space-y-4">
                                {/* Date Group Label */}
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest whitespace-nowrap">
                                        {dateLabel}
                                    </h2>
                                    <div className="h-[1px] w-full bg-slate-200/50"></div>
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden md:block bg-white rounded-t-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-blue-950 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Name</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Category</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Amount</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-white uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 bg-blue-50">
                                            {items.map((exp) => (
                                                <tr key={exp._id} className="group hover:bg-slate-50/30">
                                                    <td className="px-6 py-5">
                                                        <p className="text-slate-900 font-bold">{exp.user?.name}</p>
                                                        <p className="text-sm text-slate-400 font-medium">{exp.user?.employeeId}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-slate-800 font-medium">{exp.category}</p>
                                                        <p className="text-sm text-slate-400 ">{exp.description}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-slate-900 font-bold">₹{exp.amount.toLocaleString()}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <StatusBadge status={exp.status} />
                                                    </td>
                                                    <td className="px-6 py-5 ">
                                                        <div className="flex justify-end gap-1">
                                                            <ActionButton title="Approve" icon={<CheckCircle size={16} />} color="text-emerald-500" onClick={() => updateStatus(exp._id, "approved")} />
                                                            <ActionButton title="Reject" icon={<XCircle size={16} />} color="text-rose-500" onClick={() => updateStatus(exp._id, "rejected")} />
                                                            <ActionButton title="Mark as Paid" icon={<CreditCard size={16} />} color="text-blue-500" onClick={() => updateStatus(exp._id, "paid")} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View (Cards) */}
                                <div className="grid grid-cols-1 gap-4 md:hidden">
                                    {items.map((exp) => (
                                        <div key={exp._id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Name</label>
                                                    <p className="text-slate-900 font-bold">{exp.user?.name}</p>
                                                </div>
                                                <StatusBadge status={exp.status} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <div>
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Category</label>
                                                    <p className="text-xs font-bold text-slate-800">{exp.category}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Amount</label>
                                                    <p className="text-sm font-bold text-slate-900">₹{exp.amount.toLocaleString()}</p>
                                                </div>
                                                <p className="text-sm text-slate-400  ">{exp.description}</p>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-1">
                                                <ActionButton title="Approve" icon={<CheckCircle size={18} />} color="text-emerald-500" onClick={() => updateStatus(exp._id, "approved")} />
                                                <ActionButton title="Reject" icon={<XCircle size={18} />} color="text-rose-500" onClick={() => updateStatus(exp._id, "rejected")} />
                                                <ActionButton title=" Paid" icon={<CreditCard size={18} />} color="text-blue-500" onClick={() => updateStatus(exp._id, "paid")} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Inbox className="mx-auto text-slate-200 mb-2" size={40} />
                            <p className="text-sm text-slate-400">No requests found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rejected: "bg-rose-50 text-rose-600 border-rose-100",
        paid: "bg-blue-50 text-blue-600 border-blue-100",
        pending: "bg-amber-50 text-amber-600 border-amber-100"
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs uppercase tracking-widest border font-bold ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

function ActionButton({ icon, color, onClick, title }) {
    return (
        <button
            onClick={onClick}
            className={`p-2.5 ${color} hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
            title={title}
        >
            {icon} {title}
        </button>
    );
}