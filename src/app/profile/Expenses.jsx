// "use client";
// import { useEffect, useState } from "react";
// import {
//     ReceiptText,
//     Plus,
//     DollarSign,
//     Utensils,
//     Car,
//     Briefcase,
//     MoreHorizontal,
//     TrendingUp,
//     Clock
// } from "lucide-react";

// export default function Expenses() {
//     const [expenses, setExpenses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [form, setForm] = useState({ amount: "", category: "other", description: "", date: "" });

//     const fetchExpenses = async () => {
//         try {
//             const res = await fetch("/api/expenses", {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "" }
//             });
//             const result = await res.json();
//             setExpenses(result.data || []);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchExpenses(); }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             const res = await fetch("/api/expenses", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "" // Optional: if you want to use an API key
//                 },
//                 body: JSON.stringify(form)
//             });
//             if (res.ok) {
//                 fetchExpenses();
//                 setForm({ amount: "", category: "other", description: "", date: "" });
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const totalPending = expenses
//         .filter(e => e.status === "pending")
//         .reduce((sum, e) => sum + e.amount, 0);

//     return (
//         <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-gray-50">
//             {/* Header & Stats */}
//             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-gray-900 tracking-tight">Expenses</h1>
//                     <p className="text-gray-500 font-medium text-sm">Submit receipts and track reimbursement status.</p>
//                 </div>
//                 <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-200 min-w-[240px]">
//                     <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Pending Reimbursement</p>
//                     <div className="flex items-center gap-2 mt-1">
//                         <TrendingUp size={20} />
//                         <span className="text-3xl font-bold">${totalPending.toFixed(2)}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                 {/* Submit Form */}
//                 <div className="lg:col-span-4">
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 sticky top-8">
//                         <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//                             <Plus size={18} className="text-indigo-600" /> New Claim
//                         </h2>

//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Amount ($)</label>
//                             <input
//                                 type="number"
//                                 required
//                                 value={form.amount}
//                                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                                 className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 placeholder="0.00"
//                             />
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Category</label>
//                             <select
//                                 value={form.category}
//                                 onChange={(e) => setForm({ ...form, category: e.target.value })}
//                                 className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
//                             >
//                                 <option value="travel">Travel</option>
//                                 <option value="food">Food & Dining</option>
//                                 <option value="office">Office Supplies</option>
//                                 <option value="client">Client Meeting</option>
//                                 <option value="other">Other</option>
//                             </select>
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Date</label>
//                             <input
//                                 type="date"
//                                 required
//                                 value={form.date}
//                                 onChange={(e) => setForm({ ...form, date: e.target.value })}
//                                 className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
//                             />
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
//                             <textarea
//                                 value={form.description}
//                                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                                 className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
//                                 placeholder="What was this for?"
//                             />
//                         </div>

//                         <button
//                             disabled={isSubmitting}
//                             className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
//                         >
//                             {isSubmitting ? "Uploading..." : "Submit Expense"}
//                         </button>
//                     </form>
//                 </div>

//                 {/* History List */}
//                 <div className="lg:col-span-8 space-y-4">
//                     <div className="flex items-center gap-2 px-2">
//                         <Clock size={18} className="text-gray-400" />
//                         <h2 className="font-bold text-gray-800">Recent Claims</h2>
//                     </div>

//                     {loading ? (
//                         <div className="p-20 text-center animate-pulse text-gray-400">Loading expenses...</div>
//                     ) : (
//                         <div className="space-y-3">
//                             {expenses.map((exp) => (
//                                 <div key={exp._id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
//                                     <div className="flex items-center gap-4">
//                                         <div className={`p-4 rounded-2xl ${getCategoryStyle(exp.category).bg}`}>
//                                             {getCategoryStyle(exp.category).icon}
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-gray-800 text-base">${exp.amount.toFixed(2)}</p>
//                                             <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
//                                                 {exp.description} • {new Date(exp.date).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col items-end gap-2">
//                                         <StatusBadge status={exp.status} />
//                                         <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{exp.category}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // --- Helpers ---

// function getCategoryStyle(cat) {
//     switch (cat) {
//         case "travel": return { icon: <Car size={20} className="text-blue-600" />, bg: "bg-blue-50" };
//         case "food": return { icon: <Utensils size={20} className="text-orange-600" />, bg: "bg-orange-50" };
//         case "office": return { icon: <Briefcase size={20} className="text-purple-600" />, bg: "bg-purple-50" };
//         case "client": return { icon: <DollarSign size={20} className="text-emerald-600" />, bg: "bg-emerald-50" };
//         default: return { icon: <MoreHorizontal size={20} className="text-gray-600" />, bg: "bg-gray-50" };
//     }
// }

// function StatusBadge({ status }) {
//     const styles = {
//         pending: "bg-amber-50 text-amber-600",
//         approved: "bg-blue-50 text-blue-600",
//         rejected: "bg-rose-50 text-rose-600",
//         paid: "bg-emerald-50 text-emerald-600"
//     };
//     return (
//         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || "bg-gray-100"}`}>
//             {status}
//         </span>
//     );
// }


"use client";
import { useEffect, useState } from "react";
import {
    ReceiptText,
    Plus,
    IndianRupee, // Using IndianRupee icon from Lucide
    Utensils,
    Car,
    Briefcase,
    MoreHorizontal,
    TrendingUp,
    Clock
} from "lucide-react";

export default function ExpensePage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ amount: "", category: "other", description: "", date: "" });

    const fetchExpenses = async () => {
        try {
            const res = await fetch("/api/expenses", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "" }
            });
            const result = await res.json();
            setExpenses(result.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "" // Optional: if you want to use an API key

                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                fetchExpenses();
                setForm({ amount: "", category: "other", description: "", date: "" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total pending in ₹
    const totalPending = expenses
        .filter(e => e.status === "pending")
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-gray-50">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Expenses</h1>
                    <p className="text-gray-500 font-medium text-sm">Submit receipts and track reimbursement status.</p>
                </div>
                {/* 🇮🇳 Summary Card in Rupees */}
                <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-100 min-w-[260px]">
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Pending Reimbursement</p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-2xl font-light">₹</span>
                        <span className="text-3xl font-bold">{totalPending.toLocaleString('en-IN')}</span>
                        <TrendingUp size={20} className="ml-2 opacity-50" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Submit Form */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 sticky top-8">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-600" /> New Claim
                        </h2>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    required
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-8 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                            >
                                <option value="travel">Travel</option>
                                <option value="food">Food & Dining</option>
                                <option value="office">Office Supplies</option>
                                <option value="client">Client Meeting</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Date</label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                                placeholder="Details about the expense..."
                            />
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? "Processing..." : "Submit Claim"}
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Clock size={18} className="text-gray-400" />
                        <h2 className="font-bold text-gray-800">Recent Claims</h2>
                    </div>

                    {loading ? (
                        <div className="p-20 text-center animate-pulse text-gray-400">Loading expenses...</div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((exp) => (
                                <div key={exp._id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${getCategoryStyle(exp.category).bg}`}>
                                            {getCategoryStyle(exp.category).icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 font-bold text-gray-800 text-base">
                                                <span className="text-xs font-medium text-gray-400">₹</span>
                                                {exp.amount.toLocaleString('en-IN')}
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                {exp.description} • {new Date(exp.date).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusBadge status={exp.status} />
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{exp.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Helpers ---

function getCategoryStyle(cat) {
    switch (cat) {
        case "travel": return { icon: <Car size={20} className="text-blue-600" />, bg: "bg-blue-50" };
        case "food": return { icon: <Utensils size={20} className="text-orange-600" />, bg: "bg-orange-50" };
        case "office": return { icon: <Briefcase size={20} className="text-purple-600" />, bg: "bg-purple-50" };
        case "client": return { icon: <IndianRupee size={20} className="text-emerald-600" />, bg: "bg-emerald-50" };
        default: return { icon: <MoreHorizontal size={20} className="text-gray-600" />, bg: "bg-gray-50" };
    }
}

function StatusBadge({ status }) {
    const styles = {
        pending: "bg-amber-50 text-amber-600",
        approved: "bg-blue-50 text-blue-600",
        rejected: "bg-rose-50 text-rose-600",
        paid: "bg-emerald-50 text-emerald-700 font-black"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );
}