// "use client";

// import { useEffect, useState } from "react";
// import {
//     Plus,
//     Trash2,
//     Edit3,
//     LayoutGrid,
//     Info,
//     X,
//     AlertCircle,
//     Users
// } from "lucide-react";

// // --- COLOR CONFIGURATION ---
// const DEPT_COLORS = [
//     { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
//     { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
//     { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
//     { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
//     { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
//     { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" },
// ];

// const getDeptTheme = (str = "") => {
//     const index = str.length % DEPT_COLORS.length;
//     return DEPT_COLORS[index];
// };

// export default function DepartmentPage() {
//     const [departments, setDepartments] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [form, setForm] = useState({ name: "", description: "" });
//     const [editingId, setEditingId] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);

//     // Track which department is currently showing the delete warning
//     const [confirmDeleteId, setConfirmDeleteId] = useState(null);

//     const apiFetch = async (url, options = {}) => {
//         const res = await fetch(url, {
//             ...options,
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY
//             }
//         });
//         return res.json();
//     };

//     const fetchData = async () => {
//         try {
//             const [deptRes, empRes] = await Promise.all([
//                 apiFetch("/api/departments"),
//                 apiFetch("/api/employees")
//             ]);
//             if (deptRes.success) setDepartments(deptRes.data);
//             if (empRes.success) setEmployees(empRes.data);
//         } catch (error) { console.error(error); }
//     };

//     useEffect(() => { fetchData(); }, []);

//     const getMembers = (deptId) =>
//         employees.filter(e => e.department === deptId || e.department?._id === deptId);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const res = await apiFetch(
//             editingId ? `/api/departments/${editingId}` : "/api/departments",
//             { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) }
//         );
//         if (res.success) {
//             setForm({ name: "", description: "" });
//             setEditingId(null);
//             setShowModal(false);
//             fetchData();
//         }
//         setLoading(false);
//     };

//     const handleDelete = async (id) => {
//         const res = await apiFetch(`/api/departments/${id}`, { method: "DELETE" });
//         if (res.success) {
//             setConfirmDeleteId(null);
//             fetchData();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-900">
//             <div className="max-w-7xl mx-auto">
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight text-slate-800">Departments</h1>
//                         <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
//                             <Info size={14} /> Structure management and staff allocation.
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => { setForm({ name: "", description: "" }); setEditingId(null); setShowModal(true); }}
//                         className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
//                     >
//                         <Plus size={18} /> Add Department
//                     </button>
//                 </div>

//                 {/* DEPARTMENT GRID */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {departments.map(dep => {
//                         const members = getMembers(dep._id);
//                         const theme = getDeptTheme(dep.name);
//                         const isConfirming = confirmDeleteId === dep._id;

//                         return (
//                             <div key={dep._id} className="relative group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all overflow-hidden">

//                                 {/* DELETE WARNING OVERLAY */}
//                                 {isConfirming && (
//                                     <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
//                                         <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
//                                             <AlertCircle size={24} />
//                                         </div>
//                                         <h3 className="font-bold text-slate-800">Delete Department?</h3>
//                                         <p className="text-xs text-slate-500 mb-4">This will remove "{dep.name}" permanently.</p>
//                                         <div className="flex gap-2 w-full">
//                                             <button
//                                                 onClick={() => setConfirmDeleteId(null)}
//                                                 className="flex-1 py-2 text-xs font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(dep._id)}
//                                                 className="flex-1 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* NORMAL CARD CONTENT */}
//                                 <div className="flex justify-between items-start mb-5">
//                                     <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text}`}>
//                                         <LayoutGrid size={24} />
//                                     </div>
//                                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                         <button onClick={() => { setForm(dep); setEditingId(dep._id); setShowModal(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><Edit3 size={16} /></button>
//                                         <button onClick={() => setConfirmDeleteId(dep._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500"><Trash2 size={16} /></button>
//                                     </div>
//                                 </div>

//                                 <h2 className="text-xl font-bold text-slate-800">{dep.name}</h2>
//                                 <p className="text-slate-500 text-sm mt-1 h-10 line-clamp-2">{dep.description || "No description provided."}</p>

//                                 <div className="mt-6 pt-5 border-t border-slate-50">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}>Team Members</span>
//                                         <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>{members.length}</span>
//                                     </div>
//                                     <div className="flex -space-x-2">
//                                         {members.slice(0, 5).map((emp) => (
//                                             <div key={emp._id} className="w-9 h-9 rounded-full bg-white border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 uppercase">
//                                                 {emp.name?.charAt(0)}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* MODAL (unchanged) */}
//                 {showModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
//                         <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
//                             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
//                                 <h2 className="font-bold text-xl">{editingId ? "Edit Department" : "New Department"}</h2>
//                                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
//                             </div>
//                             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-bold text-slate-700 mb-2">Department Name</label>
//                                     <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
//                                     <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
//                                 </div>
//                                 <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
//                                     {loading ? "Saving..." : editingId ? "Update Changes" : "Create Department"}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// function StatCard({ title, value, icon }) {
//     return (
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
//             <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">{icon}</div>
//             <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
//                 <h2 className="text-2xl font-bold text-slate-800 leading-none mt-1">{value}</h2>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    LayoutGrid,
    Info,
    X,
    AlertCircle,
    Users,
    Search,
    Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- ENHANCED THEME ENGINE ---
const DEPT_COLORS = [
    { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", light: "bg-indigo-500/10" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", light: "bg-emerald-500/10" },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", light: "bg-amber-500/10" },
    { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", light: "bg-rose-500/10" },
    { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100", light: "bg-cyan-500/10" },
    { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", light: "bg-purple-500/10" },
];

const getDeptTheme = (str = "") => {
    const index = str.length % DEPT_COLORS.length;
    return DEPT_COLORS[index];
};

export default function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const apiFetch = async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ""
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
        } catch (error) { toast.error("Connection failed"); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredDepts = useMemo(() => {
        return departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [departments, searchQuery]);

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
            toast.success(editingId ? "Department updated" : "Department created");
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
            toast.success("Department removed");
            setConfirmDeleteId(null);
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFE] p-4 md:p-8 text-slate-900">
            <Toaster />
            <div className="max-w-9xl mx-auto">

                {/* --- HEADER & STATS --- */}
                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                                    <LayoutGrid size={20} />
                                </div>
                                <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                                    Company <span className="font-bold">Structure</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-sm ml-12 italic">Organization hierarchy and resource allocation.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Find department..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none w-64 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => { setForm({ name: "", description: "" }); setEditingId(null); setShowModal(true); }}
                                className="bg-slate-900 hover:bg-black text-white p-2.5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
                            >
                                <Plus size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Total Units" value={departments.length} icon={<LayoutGrid size={18} />} color="text-indigo-500" />
                        <StatCard title="Active Staff" value={employees.length} icon={<Users size={18} />} color="text-emerald-500" />
                        <StatCard title="Avg Team Size" value={(employees.length / (departments.length || 1)).toFixed(1)} icon={<Info size={18} />} color="text-amber-500" />
                        <StatCard title="Architecture" value="Flat" icon={<AlertCircle size={18} />} color="text-rose-500" />
                    </div>
                </div>

                {/* --- DEPARTMENT GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDepts.map(dep => {
                        const members = getMembers(dep._id);
                        const theme = getDeptTheme(dep.name);
                        const isConfirming = confirmDeleteId === dep._id;

                        return (
                            <div key={dep._id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">

                                {isConfirming && (
                                    <div className="absolute inset-0 z-20 bg-rose-600 text-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <AlertCircle size={40} className="mb-4 opacity-50" />
                                        <h3 className="text-xl font-bold mb-1">Confirm Delete?</h3>
                                        <p className="text-rose-100 text-xs mb-6">Staff in this department will need reassignment.</p>
                                        <div className="flex gap-2 w-full">
                                            <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-colors">Cancel</button>
                                            <button onClick={() => handleDelete(dep._id)} className="flex-1 py-3 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl text-xs font-bold transition-colors">Delete Now</button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 duration-500`}>
                                        <LayoutGrid size={28} />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setForm(dep); setEditingId(dep._id); setShowModal(true); }} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-500 transition-all"><Edit3 size={18} /></button>
                                        <button onClick={() => setConfirmDeleteId(dep._id)} className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-800 mb-2">{dep.name}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">{dep.description || "Organizing functional objectives and team synergy."}</p>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {members.slice(0, 4).map((emp) => (
                                            <div key={emp._id} className="w-10 h-10 rounded-xl bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-md ring-1 ring-slate-100 uppercase">
                                                {emp.name?.charAt(0)}
                                            </div>
                                        ))}
                                        {members.length > 4 && (
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                                                +{members.length - 4}
                                            </div>
                                        )}
                                        {members.length === 0 && (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No members</span>
                                        )}
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${theme.bg} ${theme.text}`}>
                                        Team: {members.length}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- MODAL --- */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                        <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-2xl text-slate-900">{editingId ? "Update Unit" : "Create Unit"}</h2>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Department Configuration</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Official Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Engineering"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Strategic Mission</label>
                                    <textarea
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Brief description of responsibilities..."
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white font-bold rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : editingId ? "Save Changes" : "Deploy Department"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">{title}</p>
                <h2 className="text-xl font-bold text-slate-800 leading-none">{value}</h2>
            </div>
        </div>
    );
}