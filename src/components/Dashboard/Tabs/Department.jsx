"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    LayoutGrid,
    Info,
    X,
    AlertCircle,
    Users
} from "lucide-react";

// --- COLOR CONFIGURATION ---
const DEPT_COLORS = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
    { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" },
];

const getDeptTheme = (str = "") => {
    const index = str.length % DEPT_COLORS.length;
    return DEPT_COLORS[index];
};

export default function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Track which department is currently showing the delete warning
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const apiFetch = async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY
            }
        });
        return res.json();
    };

    const fetchData = async () => {
        try {
            const [deptRes, empRes] = await Promise.all([
                apiFetch("/api/departments"),
                apiFetch("/api/employees")
            ]);
            if (deptRes.success) setDepartments(deptRes.data);
            if (empRes.success) setEmployees(empRes.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchData(); }, []);

    const getMembers = (deptId) =>
        employees.filter(e => e.department === deptId || e.department?._id === deptId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await apiFetch(
            editingId ? `/api/departments/${editingId}` : "/api/departments",
            { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) }
        );
        if (res.success) {
            setForm({ name: "", description: "" });
            setEditingId(null);
            setShowModal(false);
            fetchData();
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const res = await apiFetch(`/api/departments/${id}`, { method: "DELETE" });
        if (res.success) {
            setConfirmDeleteId(null);
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-900">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Departments</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                            <Info size={14} /> Structure management and staff allocation.
                        </p>
                    </div>
                    <button
                        onClick={() => { setForm({ name: "", description: "" }); setEditingId(null); setShowModal(true); }}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
                    >
                        <Plus size={18} /> Add Department
                    </button>
                </div>

                {/* DEPARTMENT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map(dep => {
                        const members = getMembers(dep._id);
                        const theme = getDeptTheme(dep.name);
                        const isConfirming = confirmDeleteId === dep._id;

                        return (
                            <div key={dep._id} className="relative group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all overflow-hidden">

                                {/* DELETE WARNING OVERLAY */}
                                {isConfirming && (
                                    <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
                                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
                                            <AlertCircle size={24} />
                                        </div>
                                        <h3 className="font-bold text-slate-800">Delete Department?</h3>
                                        <p className="text-xs text-slate-500 mb-4">This will remove "{dep.name}" permanently.</p>
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="flex-1 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dep._id)}
                                                className="flex-1 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* NORMAL CARD CONTENT */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text}`}>
                                        <LayoutGrid size={24} />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setForm(dep); setEditingId(dep._id); setShowModal(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><Edit3 size={16} /></button>
                                        <button onClick={() => setConfirmDeleteId(dep._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-800">{dep.name}</h2>
                                <p className="text-slate-500 text-sm mt-1 h-10 line-clamp-2">{dep.description || "No description provided."}</p>

                                <div className="mt-6 pt-5 border-t border-slate-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}>Team Members</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>{members.length}</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {members.slice(0, 5).map((emp) => (
                                            <div key={emp._id} className="w-9 h-9 rounded-full bg-white border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 uppercase">
                                                {emp.name?.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MODAL (unchanged) */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
                                <h2 className="font-bold text-xl">{editingId ? "Edit Department" : "New Department"}</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Department Name</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                    {loading ? "Saving..." : editingId ? "Update Changes" : "Create Department"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">{icon}</div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                <h2 className="text-2xl font-bold text-slate-800 leading-none mt-1">{value}</h2>
            </div>
        </div>
    );
}