"use client";
import { useEffect, useState } from "react";
import {
    Users,
    CalendarDays,
    BadgeDollarSign,
    TrendingUp,
    TrendingDown,
    FileText,
    Pencil,
    Trash2,
    Plus,
    X,
    CheckCircle2,
    Clock,
    ChevronDown,
    Wallet,
    LayoutDashboard,
} from "lucide-react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function StatCard({ icon: Icon, label, value, iconClass, bgClass }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass}`}>
                <Icon size={20} className={iconClass} />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

export default function PayrollDashboard() {
    const [payrolls, setPayrolls] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        user: "", month: "", year: "",
        basicSalary: "", allowances: "", deductions: "",
        netSalary: "", notes: "",
    });

    const fetchPayroll = async () => {
        try {
            const res = await fetch("/api/payroll", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            const data = await res.json();
            setPayrolls(Array.isArray(data) ? data : data?.data || []);
        } catch { setPayrolls([]); }
        finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/employees", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : data?.data || []);
        } catch { setUsers([]); }
    };

    useEffect(() => { fetchPayroll(); fetchUsers(); }, []);

    useEffect(() => {
        const basic = Number(form.basicSalary) || 0;
        const allow = Number(form.allowances) || 0;
        const deduct = Number(form.deductions) || 0;
        setForm((p) => ({ ...p, netSalary: basic + allow - deduct }));
    }, [form.basicSalary, form.allowances, form.deductions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `/api/payroll/${editingId}` : "/api/payroll";
        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
            body: JSON.stringify({
                ...form,
                basicSalary: Number(form.basicSalary),
                allowances: Number(form.allowances),
                deductions: Number(form.deductions),
                netSalary: Number(form.netSalary),
            }),
        });
        resetForm();
        fetchPayroll();
    };

    const handleEdit = (item) => {
        setForm({
            user: item.user?._id || "",
            month: item.month,
            year: item.year,
            basicSalary: item.basicSalary,
            allowances: item.allowances,
            deductions: item.deductions,
            netSalary: item.netSalary,
            notes: item.notes || "",
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        await fetch(`/api/payroll/${id}`, {
            method: "DELETE",
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });
        fetchPayroll();
    };

    const resetForm = () => {
        setForm({ user: "", month: "", year: "", basicSalary: "", allowances: "", deductions: "", netSalary: "", notes: "" });
        setEditingId(null);
        setShowForm(false);
    };

    const totalNet = payrolls.reduce((s, p) => s + (p.netSalary || 0), 0);
    const paidCount = payrolls.filter((p) => p.isPaid).length;
    const pendingCount = payrolls.length - paidCount;

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 leading-tight">Payroll</h1>
                        <p className="text-xs text-slate-400">Manage employee compensation</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-colors"
                >
                    <Plus size={16} />
                    New Payroll
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Records"
                    value={payrolls.length}
                    bgClass="bg-indigo-50"
                    iconClass="text-indigo-500"
                />
                <StatCard
                    icon={Wallet}
                    label="Total Payout"
                    value={`₹${totalNet.toLocaleString()}`}
                    bgClass="bg-emerald-50"
                    iconClass="text-emerald-500"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Paid"
                    value={paidCount}
                    bgClass="bg-green-50"
                    iconClass="text-green-500"
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={pendingCount}
                    bgClass="bg-amber-50"
                    iconClass="text-amber-500"
                />
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <BadgeDollarSign size={18} className="text-indigo-500" />
                        <h2 className="text-base font-semibold text-slate-800">Payroll Records</h2>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-3 py-1">
                        {payrolls.length} entries
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Employee</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Period</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Basic</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Net Salary</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                                        Loading payroll data…
                                    </td>
                                </tr>
                            ) : payrolls.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex flex-col items-center gap-3 py-16 text-slate-300">
                                            <FileText size={40} />
                                            <p className="text-sm text-slate-400">No payroll records yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payrolls.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                        {/* Employee */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-indigo-600 text-xs font-bold">
                                                        {item.user?.name?.charAt(0) || "?"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">{item.user?.name || "—"}</p>
                                                    <p className="text-xs text-slate-400">{item.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Period */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg px-2.5 py-1">
                                                <CalendarDays size={12} />
                                                {MONTHS[(item.month || 1) - 1]} {item.year}
                                            </span>
                                        </td>

                                        {/* Basic Salary */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            ₹{Number(item.basicSalary).toLocaleString()}
                                        </td>

                                        {/* Net Salary */}
                                        <td className="px-6 py-4">
                                            <span className="text-base font-bold text-slate-800">
                                                ₹{Number(item.netSalary).toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-1">/mo</span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {item.isPaid ? (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-medium rounded-full px-3 py-1">
                                                    <CheckCircle2 size={12} /> Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-medium rounded-full px-3 py-1">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg px-3 py-1.5 transition-colors"
                                                >
                                                    <Pencil size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg px-3 py-1.5 transition-colors"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showForm && (
                <div
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && resetForm()}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <BadgeDollarSign size={16} className="text-white" />
                                </div>
                                <h2 className="text-base font-semibold text-slate-800">
                                    {editingId ? "Edit Payroll Record" : "New Payroll Record"}
                                </h2>
                            </div>
                            <button
                                onClick={resetForm}
                                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg p-1.5 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                            {/* Employee */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                    Employee
                                </label>
                                <div className="relative">
                                    <select
                                        value={form.user}
                                        onChange={(e) => setForm({ ...form, user: e.target.value })}
                                        required
                                        className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select employee…</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Month + Year */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Month</label>
                                    <div className="relative">
                                        <select
                                            value={form.month}
                                            onChange={(e) => setForm({ ...form, month: e.target.value })}
                                            required
                                            className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        >
                                            <option value="">Month…</option>
                                            {MONTHS.map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2025"
                                        value={form.year}
                                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                                        required
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Salary Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                        <span className="flex items-center gap-1"><TrendingUp size={11} className="text-emerald-500" /> Basic Salary</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={form.basicSalary}
                                            onChange={(e) => setForm({ ...form, basicSalary: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                        <span className="flex items-center gap-1"><TrendingUp size={11} className="text-emerald-500" /> Allowances</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={form.allowances}
                                            onChange={(e) => setForm({ ...form, allowances: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                        <span className="flex items-center gap-1"><TrendingDown size={11} className="text-rose-400" /> Deductions</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={form.deductions}
                                            onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Net Salary (auto)</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-semibold">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={form.netSalary}
                                            onChange={(e) => setForm({ ...form, netSalary: e.target.value })}
                                            className="w-full border border-indigo-200 bg-indigo-50 rounded-xl pl-7 pr-3.5 py-2.5 text-sm font-semibold text-indigo-600 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notes</label>
                                <input
                                    type="text"
                                    placeholder="Optional remarks…"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-colors"
                                >
                                    {editingId ? "Update Record" : "Create Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}