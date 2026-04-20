"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, Calendar, Megaphone, Pencil, X, Send } from "lucide-react";

export default function Notices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: "", message: "" });

    // ✏️ EDIT STATE
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ id: "", title: "", message: "" });
    const [deleteId, setDeleteId] = useState(null);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/notice", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY
                },
            });

            const data = await res.json();
            if (data.success) setNotices(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // CREATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("/api/notice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.success) {
            setForm({ title: "", message: "" });
            fetchNotices();
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        // if (!confirm("Delete this notice?")) return;
        setDeleteId(null);
        const prev = notices;
        setNotices((curr) => curr.filter((n) => n._id !== id));

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/notice/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY
                },
            });
            const data = await res.json();
            if (!data.success) setNotices(prev);
        } catch {
            setNotices(prev);
        }
    };

    const openEdit = (n) => {
        setEditData({ id: n._id, title: n.title, message: n.message });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/notice/${editData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY
                },
                body: JSON.stringify({ title: editData.title, message: editData.message }),
            });
            const data = await res.json();
            if (data.success) {
                setEditOpen(false);
                fetchNotices();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-6 md:p-10 bg-white min-h-screen text-slate-900">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <span className="p-3 bg-black text-white rounded-2xl">
                            <Megaphone size={28} />
                        </span>
                        Notices
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and broadcast official company updates.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                    <Bell size={16} /> {notices.length} ACTIVE NOTICES
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-12">

                {/* CREATE SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-10 border border-slate-100 bg-slate-50/50 p-6 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-blue-600" /> Create New
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                                <input
                                    placeholder="Important Update..."
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Body</label>
                                <textarea
                                    placeholder="Type your notice here..."
                                    rows={5}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-black/5 outline-none transition-all resize-none placeholder:text-slate-300"
                                />
                            </div>
                            <button className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group">
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Publish Notice
                            </button>
                        </form>
                    </div>
                </div>

                {/* FEED */}
                <div className="lg:col-span-8 space-y-6">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-3xl" />)}
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                            <p className="text-slate-400 font-medium">No announcements yet. Start the conversation!</p>
                        </div>
                    ) : (
                        notices.map((n) => (
                            <div key={n._id} className="group relative bg-white border border-slate-100 p-8 rounded-[32px] hover:shadow-2xl hover:shadow-slate-100 transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-black transition-colors">{n.title}</h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(n)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => setDeleteId(n._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-slate-600 text-lg leading-relaxed mb-6">{n.message}</p>

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-50 pt-6">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Calendar size={14} className="text-slate-300" />
                                        {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="uppercase tracking-widest text-[10px]">Official Log</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ✏️ EDIT MODAL */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setEditOpen(false)} />
                    <div className="relative bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black tracking-tight">Modify Notice</h2>
                            <button onClick={() => setEditOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Update Title</label>
                                <input
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Update Content</label>
                                <textarea
                                    rows={5}
                                    value={editData.message}
                                    onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleUpdate} className="flex-1 bg-black text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]">
                                    Save Changes
                                </button>
                                <button onClick={() => setEditOpen(false)} className="px-6 border border-slate-200 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all">
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {deleteId && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
                >
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">

                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                            Delete Notice ?
                        </h2>

                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete this record? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDelete(deleteId);

                                }}
                                className="px-4 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                            >
                                Yes, Delete
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}