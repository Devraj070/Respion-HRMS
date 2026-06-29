// "use client";

// import { useEffect, useState, useMemo } from "react";
// import {
//     Clock, CheckCircle2, XCircle, CreditCard,
//     Calendar, AlertCircle, Banknote
// } from "lucide-react";

// export default function Advances({user}) {
//     const [advances, setAdvances] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchAdvances = async () => {
//             try {
//                 setLoading(true);
//                 const token = localStorage.getItem("token");
//                 const res = await fetch("/api/advance/my", {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                     },
//                 });

//                 const data = await res.json();
//                 if (!data.success) throw new Error(data.message || "Failed to fetch");
//                 setAdvances(data.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAdvances();
//     }, []);

//     // --- GROUPING LOGIC ---
//     const groupedAdvances = useMemo(() => {
//         const groups = {};

//         advances.forEach((adv) => {
//             const date = new Date(adv.createdAt);
//             const now = new Date();
//             let label = "";

//             if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
//                 label = "This Month";
//             } else if (
//                 (date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()) ||
//                 (now.getMonth() === 0 && date.getMonth() === 11 && date.getFullYear() === now.getFullYear() - 1)
//             ) {
//                 label = "Last Month";
//             } else {
//                 label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
//             }

//             if (!groups[label]) groups[label] = [];
//             groups[label].push(adv);
//         });

//         return groups;
//     }, [advances]);

//     const getStatusDetails = (status) => {
//         switch (status) {
//             case "APPROVED":
//                 return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
//             case "REJECTED":
//                 return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle size={14} /> };
//             case "SETTLED":
//                 return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <CreditCard size={14} /> };
//             default:
//                 return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
//         }
//     };

//     if (loading) return (
//         <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
//             <p className="text-gray-400 animate-pulse">Fetching history...</p>
//         </div>
//     );

//     if (error) return (
//         <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
//             <AlertCircle size={20} />
//             <p>{error}</p>
//         </div>
//     );

//     return (
//         <div className="max-w-4xl mx-auto p-6 md:p-10">
//             <header className="mb-10">
//                 <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Advances</h1>

//             </header>

//             {advances.length === 0 ? (
//                 <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//                     <p className="text-gray-400">No advance history found.</p>
//                 </div>
//             ) : (
//                 <div className="space-y-10">
//                     {Object.keys(groupedAdvances).map((groupLabel) => (
//                         <section key={groupLabel}>
//                             <div className="flex items-center gap-4 mb-4">
//                                 <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 whitespace-nowrap">
//                                     {groupLabel}
//                                 </h2>
//                                 <div className="h-px w-full bg-gray-100"></div>
//                             </div>

//                             <div className="grid gap-4">
//                                 {groupedAdvances[groupLabel].map((adv) => {
//                                     const { color, icon } = getStatusDetails(adv.status);
//                                     return (
//                                         <div
//                                             key={adv._id}
//                                             className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
//                                         >
//                                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                                 <div className="flex items-start gap-4">
//                                                     <div className={`p-3 rounded-xl ${color.split(' ')[0]}`}>
//                                                         <Banknote className={color.split(' ')[1]} size={20} />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">
//                                                             ₹{adv.amount.toLocaleString('en-IN')}
//                                                         </h3>
//                                                         <p className="text-gray-600 text-sm font-medium">{adv.purpose}</p>
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
//                                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${color}`}>
//                                                         {icon} {adv.status}
//                                                     </span>
//                                                     <div className="flex items-center gap-1.5 text-gray-400 text-xs">
//                                                         <Calendar size={12} />
//                                                         <span>{new Date(adv.createdAt).toLocaleDateString()}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {adv.description && (
//                                                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                                                     <p className="text-xs text-gray-500 leading-relaxed italic">
//                                                         &ldquo;{adv.description}&rdquo;
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </section>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }




"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Clock, CheckCircle2, XCircle, CreditCard,
    Calendar, AlertCircle, Banknote, Send
} from "lucide-react";

export default function Advances({ user }) {
    const [advances, setAdvances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        amount: "",
        purpose: "TRAVEL",
        paymentSource: "CASH",
        description: "",
    });

    const fetchAdvances = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/advance/my", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                },
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to fetch");
            setAdvances(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.amount || Number(form.amount) <= 0) {
            setFormError("Please enter a valid amount.");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/advance", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    employeeId: user._id,
                    ...form,
                    amount: Number(form.amount),
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to submit request");

            setForm({ amount: "", purpose: "TRAVEL", paymentSource: "CASH", description: "" });
            await fetchAdvances();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // --- GROUPING LOGIC ---
    const groupedAdvances = useMemo(() => {
        const groups = {};

        advances.forEach((adv) => {
            const date = new Date(adv.createdAt);
            const now = new Date();
            let label = "";

            if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                label = "This Month";
            } else if (
                (date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()) ||
                (now.getMonth() === 0 && date.getMonth() === 11 && date.getFullYear() === now.getFullYear() - 1)
            ) {
                label = "Last Month";
            } else {
                label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }

            if (!groups[label]) groups[label] = [];
            groups[label].push(adv);
        });

        return groups;
    }, [advances]);

    const getStatusDetails = (status) => {
        switch (status) {
            case "APPROVED":
                return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
            case "REJECTED":
                return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle size={14} /> };
            case "SETTLED":
                return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <CreditCard size={14} /> };
            default:
                return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10">
            <header className="mb-10">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Advances</h1>
            </header>

            {/* --- POST ADVANCE FORM --- */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-10 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-5">
                    Request New Advance
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            disabled={submitting}
                            type="number"
                            placeholder="Amount (₹)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold disabled:opacity-60"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        />
                        <select
                            disabled={submitting}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60"
                            value={form.paymentSource}
                            onChange={(e) => setForm({ ...form, paymentSource: e.target.value })}
                        >
                            <option value="CASH">Cash</option>
                            <option value="BANK">Bank</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                    <select
                        disabled={submitting}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60"
                        value={form.purpose}
                        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    >
                        <option value="TRAVEL">Travel</option>
                        <option value="FOOD">Food</option>
                        <option value="OFFICE_PURCHASE">Office Purchase</option>
                        <option value="COURIER">Courier</option>
                        <option value="LOGISTICS">Logistics</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <textarea
                        disabled={submitting}
                        placeholder="Brief description..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm disabled:opacity-60"
                        rows="2"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    {formError && (
                        <p className="text-rose-600 text-sm font-medium">{formError}</p>
                    )}

                    <button
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                <span>Submit Request</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* --- HISTORY --- */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-400 animate-pulse">Fetching history...</p>
                </div>
            ) : error ? (
                <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            ) : advances.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No advance history found.</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.keys(groupedAdvances).map((groupLabel) => (
                        <section key={groupLabel}>
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 whitespace-nowrap">
                                    {groupLabel}
                                </h2>
                                <div className="h-px w-full bg-gray-100"></div>
                            </div>

                            <div className="grid gap-4">
                                {groupedAdvances[groupLabel].map((adv) => {
                                    const { color, icon } = getStatusDetails(adv.status);
                                    return (
                                        <div
                                            key={adv._id}
                                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl ${color.split(' ')[0]}`}>
                                                        <Banknote className={color.split(' ')[1]} size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">
                                                            ₹{adv.amount.toLocaleString('en-IN')}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm font-medium">{adv.purpose}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${color}`}>
                                                        {icon} {adv.status}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                        <Calendar size={12} />
                                                        <span>{new Date(adv.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {adv.description && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-gray-500 leading-relaxed italic">
                                                        &ldquo;{adv.description}&rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}