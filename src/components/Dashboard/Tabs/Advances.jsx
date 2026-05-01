// // "use client";

// // import { useEffect, useState } from "react";

// // export default function AdvancePage() {
// //     const [advances, setAdvances] = useState([]);
// //     const [users, setUsers] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [actionLoading, setActionLoading] = useState(false);

// //     // Modal States
// //     const [showEditModal, setShowEditModal] = useState(false);
// //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// //     const [activeItem, setActiveItem] = useState(null);

// //     const [form, setForm] = useState({
// //         employeeId: "",
// //         amount: "",
// //         purpose: "TRAVEL",
// //         paymentSource: "CASH",
// //         description: "",
// //     });

// //     const fetchUsers = async () => {
// //         try {
// //             const res = await fetch("/api/employees", {
// //                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
// //             });
// //             const data = await res.json();
// //             setUsers(data?.data || []);
// //         } catch {
// //             setUsers([]);
// //         }
// //     };

// //     const fetchAdvances = async () => {
// //         try {
// //             setLoading(true);
// //             const res = await fetch("/api/advance", {
// //                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
// //             });
// //             const data = await res.json();
// //             setAdvances(data?.data || []);
// //         } catch {
// //             setAdvances([]);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchUsers();
// //         fetchAdvances();
// //     }, []);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (!form.employeeId || !form.amount) return alert("Fill required fields");

// //         setActionLoading(true);
// //         await fetch("/api/advance", {
// //             method: "POST",
// //             headers: {
// //                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({ ...form, amount: Number(form.amount) }),
// //         });
// //         setForm({ employeeId: "", amount: "", purpose: "TRAVEL", paymentSource: "CASH", description: "" });
// //         await fetchAdvances();
// //         setActionLoading(false);
// //     };

// //     const updateStatus = async (id, status) => {
// //         await fetch(`/api/advance/${id}`, {
// //             method: "PATCH",
// //             headers: {
// //                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({ status }),
// //         });
// //         fetchAdvances();
// //     };

// //     const handleSaveEdit = async () => {
// //         setActionLoading(true);
// //         const payload = {
// //             ...activeItem,
// //             employeeId: activeItem.employeeId,
// //             amount: Number(activeItem.amount)
// //         };

// //         await fetch(`/api/advance/${activeItem._id}`, {
// //             method: "PATCH",
// //             headers: {
// //                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(payload),
// //         });
// //         setShowEditModal(false);
// //         fetchAdvances();
// //         setActionLoading(false);
// //     };

// //     const handleDelete = async () => {
// //         setActionLoading(true);
// //         await fetch(`/api/advance/${activeItem._id}`, {
// //             method: "DELETE",
// //             headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
// //         });
// //         setShowDeleteModal(false);
// //         fetchAdvances();
// //         setActionLoading(false);
// //     };

// //     const getStatusStyle = (status) => {
// //         switch (status) {
// //             case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
// //             case "SETTLED": return "bg-blue-100 text-blue-700 border-blue-200";
// //             case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
// //             default: return "bg-amber-100 text-amber-700 border-amber-200";
// //         }
// //     };

// //     return (
// //         <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 font-sans text-slate-900">
// //             <div className="max-w-7xl mx-auto">
// //                 <header className="mb-6 md:mb-10">
// //                     <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center md:text-left">
// //                         Advance Management
// //                     </h1>
// //                 </header>

// //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

// //                     {/* CREATE FORM - order-2 on mobile, order-1 on desktop (lg+) */}
// //                     <div className="lg:col-span-4 order-1 lg:order-1">
// //                         <div className="bg-white p-5 md:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 lg:sticky lg:top-8">
// //                             <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
// //                                 <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
// //                                 New Record
// //                             </h2>
// //                             <form onSubmit={handleSubmit} className="space-y-4">
// //                                 <select
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
// //                                     value={form.employeeId}
// //                                     onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
// //                                 >
// //                                     <option value="">Select Employee</option>
// //                                     {users.map((u) => (
// //                                         <option key={u._id} value={u._id}>{u.name}</option>
// //                                     ))}
// //                                 </select>

// //                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                                     <input
// //                                         type="number"
// //                                         placeholder="Amount"
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
// //                                         value={form.amount}
// //                                         onChange={(e) => setForm({ ...form, amount: e.target.value })}
// //                                     />
// //                                     <select
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
// //                                         value={form.paymentSource}
// //                                         onChange={(e) => setForm({ ...form, paymentSource: e.target.value })}
// //                                     >
// //                                         <option value="CASH">Cash</option>
// //                                         <option value="BANK">Bank</option>
// //                                         <option value="UPI">UPI</option>
// //                                     </select>
// //                                 </div>

// //                                 <select
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
// //                                     value={form.purpose}
// //                                     onChange={(e) => setForm({ ...form, purpose: e.target.value })}
// //                                 >
// //                                     <option value="TRAVEL">Travel</option>
// //                                     <option value="FOOD">Food</option>
// //                                     <option value="OFFICE_PURCHASE">Office Purchase</option>
// //                                     <option value="OTHER">Other</option>
// //                                 </select>

// //                                 <textarea
// //                                     placeholder="Description"
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
// //                                     rows="3"
// //                                     value={form.description}
// //                                     onChange={(e) => setForm({ ...form, description: e.target.value })}
// //                                 />

// //                                 <button
// //                                     disabled={actionLoading}
// //                                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center"
// //                                 >
// //                                     {actionLoading ? "Processing..." : "Save Record"}
// //                                 </button>
// //                             </form>
// //                         </div>
// //                     </div>

// //                     {/* LIST - order-1 on mobile, order-2 on desktop (lg+) */}
// //                     <div className="lg:col-span-8 order-2 lg:order-2">
// //                         <div className="space-y-4">
// //                             {/* Optional: Mobile-only subtitle to separate list from header */}
// //                             <h2 className="lg:hidden text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
// //                                 Recent Activity
// //                             </h2>

// //                             {loading ? (
// //                                 <div className="text-center py-20 text-slate-400">Loading advances...</div>
// //                             ) : advances.length === 0 ? (
// //                                 <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">No records found.</div>
// //                             ) : advances.map((adv) => (
// //                                 <div key={adv._id} className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
// //                                     <div className="flex flex-col gap-6">
// //                                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
// //                                             <div className="flex-1">
// //                                                 <div className="flex items-center gap-3 mb-2">
// //                                                     <span className="text-2xl md:text-3xl font-black text-slate-800">₹{adv.amount}</span>
// //                                                     <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-black uppercase ${getStatusStyle(adv.status)}`}>
// //                                                         {adv.status}
// //                                                     </span>
// //                                                 </div>
// //                                                 <h3 className="font-bold text-slate-700 text-lg">{adv.employee?.name || "Deleted Employee"}</h3>
// //                                                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-sm mt-1 font-medium">
// //                                                     <span>📁 {adv.purpose}</span>
// //                                                     <span>💳 {adv.paymentSource}</span>
// //                                                 </div>
// //                                                 {adv.description && <p className="mt-3 text-slate-500 text-sm italic line-clamp-2">{adv.description}</p>}
// //                                             </div>

// //                                             {/* Quick Status Actions */}
// //                                             <div className="flex sm:flex-col gap-2">
// //                                                 <button onClick={() => updateStatus(adv._id, "APPROVED")} className="flex-1 sm:w-24 p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition-all border border-emerald-100 text-[10px] font-black uppercase">Approve</button>
// //                                                 <button onClick={() => updateStatus(adv._id, "SETTLED")} className="flex-1 sm:w-24 p-2 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-600 rounded-xl transition-all border border-sky-100 text-[10px] font-black uppercase">Settle</button>
// //                                                 <button onClick={() => updateStatus(adv._id, "REJECTED")} className="flex-1 sm:w-24 p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-all border border-rose-100 text-[10px] font-black uppercase">Reject</button>
// //                                             </div>
// //                                         </div>

// //                                         {/* Utility Actions */}
// //                                         <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
// //                                             <button
// //                                                 onClick={() => { setActiveItem({ ...adv, employeeId: adv.employee?._id }); setShowEditModal(true); }}
// //                                                 className="flex-1 px-4 py-3 bg-slate-800 text-white hover:bg-black rounded-xl transition-all text-[11px] font-black uppercase tracking-widest text-center"
// //                                             >
// //                                                 Edit Details
// //                                             </button>
// //                                             <button
// //                                                 onClick={() => { setActiveItem(adv); setShowDeleteModal(true); }}
// //                                                 className="flex-1 px-4 py-3 bg-white text-rose-500 border border-slate-200 hover:bg-rose-50 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest text-center"
// //                                             >
// //                                                 Delete
// //                                             </button>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* ================= EDIT MODAL ================= */}
// //             {showEditModal && activeItem && (
// //                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowEditModal(false)}></div>
// //                     <div className="bg-white rounded-[28px] p-6 md:p-8 w-full max-w-lg relative shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
// //                         <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6">Modify Record</h2>

// //                         <div className="space-y-4">
// //                             <div className="space-y-1">
// //                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employee</label>
// //                                 <select
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold appearance-none"
// //                                     value={activeItem.employeeId}
// //                                     onChange={(e) => setActiveItem({ ...activeItem, employeeId: e.target.value })}
// //                                 >
// //                                     {users.map((u) => (
// //                                         <option key={u._id} value={u._id}>{u.name}</option>
// //                                     ))}
// //                                 </select>
// //                             </div>

// //                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                                 <div className="space-y-1">
// //                                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Amount (₹)</label>
// //                                     <input
// //                                         type="number"
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-black text-indigo-600"
// //                                         value={activeItem.amount}
// //                                         onChange={(e) => setActiveItem({ ...activeItem, amount: e.target.value })}
// //                                     />
// //                                 </div>
// //                                 <div className="space-y-1">
// //                                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Source</label>
// //                                     <select
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold"
// //                                         value={activeItem.paymentSource}
// //                                         onChange={(e) => setActiveItem({ ...activeItem, paymentSource: e.target.value })}
// //                                     >
// //                                         <option value="CASH">Cash</option>
// //                                         <option value="BANK">Bank</option>
// //                                         <option value="UPI">UPI</option>
// //                                     </select>
// //                                 </div>
// //                             </div>

// //                             <div className="space-y-1">
// //                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Purpose</label>
// //                                 <select
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold"
// //                                     value={activeItem.purpose}
// //                                     onChange={(e) => setActiveItem({ ...activeItem, purpose: e.target.value })}
// //                                 >
// //                                     <option value="TRAVEL">Travel</option>
// //                                     <option value="FOOD">Food</option>
// //                                     <option value="OFFICE_PURCHASE">Office Purchase</option>
// //                                     <option value="OTHER">Other</option>
// //                                 </select>
// //                             </div>

// //                             <div className="space-y-1">
// //                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
// //                                 <textarea
// //                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none resize-none"
// //                                     rows="3"
// //                                     value={activeItem.description}
// //                                     onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
// //                                 />
// //                             </div>
// //                         </div>

// //                         <div className="flex flex-col sm:flex-row gap-3 mt-8">
// //                             <button onClick={() => setShowEditModal(false)} className="order-2 sm:order-1 flex-1 py-4 font-black text-[11px] uppercase text-slate-500 bg-slate-100 rounded-2xl">Cancel</button>
// //                             <button onClick={handleSaveEdit} className="order-1 sm:order-2 flex-1 py-4 font-black text-[11px] uppercase text-white bg-indigo-600 rounded-2xl shadow-lg">Save Updates</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ================= DELETE MODAL ================= */}
// //             {showDeleteModal && (
// //                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowDeleteModal(false)}></div>
// //                     <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-sm relative shadow-2xl animate-in zoom-in duration-300 text-center">
// //                         <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
// //                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //                             </svg>
// //                         </div>
// //                         <h2 className="text-2xl font-black mb-2 text-slate-800">Delete Record?</h2>
// //                         <p className="text-slate-500 text-sm mb-8">This action cannot be undone. This record will be permanently removed.</p>
// //                         <div className="space-y-2">
// //                             <button onClick={handleDelete} className="w-full py-4 font-black text-[11px] uppercase text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-200">Confirm Delete</button>
// //                             <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 font-black text-[11px] uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// "use client";

// import { useEffect, useState } from "react";

// export default function AdvancePage() {
//     const [advances, setAdvances] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [actionLoading, setActionLoading] = useState(false);

//     // Modal States
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [activeItem, setActiveItem] = useState(null);

//     const [form, setForm] = useState({
//         employeeId: "",
//         amount: "",
//         purpose: "TRAVEL",
//         paymentSource: "CASH",
//         description: "",
//     });

//     // --- HELPER: Grouping & Formatting ---
//     const getGroupedAdvances = () => {
//         const groups = {};
//         // Sort by date descending (newest first)
//         const sorted = [...advances].sort((a, b) =>
//             new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
//         );

//         sorted.forEach((adv) => {
//             const dateKey = adv.createdAt
//                 ? new Date(adv.createdAt).toLocaleDateString('en-GB', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                 })
//                 : "Recent";

//             if (!groups[dateKey]) {
//                 groups[dateKey] = [];
//             }
//             groups[dateKey].push(adv);
//         });
//         return groups;
//     };

//     const formatTime = (dateString) => {
//         if (!dateString) return "--:--";
//         return new Date(dateString).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     const getStatusStyle = (status) => {
//         switch (status) {
//             case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
//             case "SETTLED": return "bg-blue-100 text-blue-700 border-blue-200";
//             case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
//             default: return "bg-amber-100 text-amber-700 border-amber-200";
//         }
//     };

//     // --- API Calls ---
//     const fetchUsers = async () => {
//         try {
//             const res = await fetch("/api/employees", {
//                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//             });
//             const data = await res.json();
//             setUsers(data?.data || []);
//         } catch {
//             setUsers([]);
//         }
//     };

//     const fetchAdvances = async () => {
//         try {
//             setLoading(true);
//             const res = await fetch("/api/advance", {
//                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//             });
//             const data = await res.json();
//             setAdvances(data?.data || []);
//         } catch {
//             setAdvances([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         fetchAdvances();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!form.employeeId || !form.amount) return alert("Fill required fields");

//         setActionLoading(true);
//         await fetch("/api/advance", {
//             method: "POST",
//             headers: {
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ ...form, amount: Number(form.amount) }),
//         });
//         setForm({ employeeId: "", amount: "", purpose: "TRAVEL", paymentSource: "CASH", description: "" });
//         await fetchAdvances();
//         setActionLoading(false);
//     };

//     const updateStatus = async (id, status) => {
//         await fetch(`/api/advance/${id}`, {
//             method: "PATCH",
//             headers: {
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ status }),
//         });
//         fetchAdvances();
//     };

//     const handleSaveEdit = async () => {
//         setActionLoading(true);
//         const payload = {
//             ...activeItem,
//             employeeId: activeItem.employeeId,
//             amount: Number(activeItem.amount)
//         };

//         await fetch(`/api/advance/${activeItem._id}`, {
//             method: "PATCH",
//             headers: {
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//         });
//         setShowEditModal(false);
//         fetchAdvances();
//         setActionLoading(false);
//     };

//     const handleDelete = async () => {
//         setActionLoading(true);
//         await fetch(`/api/advance/${activeItem._id}`, {
//             method: "DELETE",
//             headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//         });
//         setShowDeleteModal(false);
//         fetchAdvances();
//         setActionLoading(false);
//     };

//     const groupedData = getGroupedAdvances();

//     return (
//         <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 font-sans text-slate-900">
//             <div className="max-w-7xl mx-auto">
//                 <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div>
//                         <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
//                             Advance Management
//                         </h1>
//                     </div>
//                 </header>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

//                     {/* LEFT COLUMN: CREATE FORM */}
//                     <div className="lg:col-span-4 order-1 lg:order-1">
//                         <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 lg:sticky lg:top-8">
//                             <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
//                                 <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
//                                 New Advance Record
//                             </h2>
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <select
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium"
//                                     value={form.employeeId}
//                                     onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
//                                 >
//                                     <option value="">Select Employee</option>
//                                     {users.map((u) => (
//                                         <option key={u._id} value={u._id}>{u.name}</option>
//                                     ))}
//                                 </select>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <input
//                                         type="number"
//                                         placeholder="Amount"
//                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
//                                         value={form.amount}
//                                         onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                                     />
//                                     <select
//                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
//                                         value={form.paymentSource}
//                                         onChange={(e) => setForm({ ...form, paymentSource: e.target.value })}
//                                     >
//                                         <option value="CASH">Cash</option>
//                                         <option value="BANK">Bank</option>
//                                         <option value="UPI">UPI</option>
//                                     </select>
//                                 </div>

//                                 <select
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
//                                     value={form.purpose}
//                                     onChange={(e) => setForm({ ...form, purpose: e.target.value })}
//                                 >
//                                     <option value="TRAVEL">Travel</option>
//                                     <option value="FOOD">Food</option>
//                                     <option value="OFFICE_PURCHASE">Office Purchase</option>
//                                     <option value="COURIER">Courier</option>
//                                     <option value="LOGISTICS">Logistics</option>
//                                     <option value="OTHER">Other</option>
//                                 </select>

//                                 <textarea
//                                     placeholder="Brief description..."
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm"
//                                     rows="3"
//                                     value={form.description}
//                                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                                 />

//                                 <button
//                                     disabled={actionLoading}
//                                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
//                                 >
//                                     {actionLoading ? "Saving..." : "Create Record"}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN: GROUPED LIST */}
//                     <div className="lg:col-span-8 order-2 lg:order-2">
//                         {loading ? (
//                             <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading records...</div>
//                         ) : Object.keys(groupedData).length === 0 ? (
//                             <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
//                                 No activity records found.
//                             </div>
//                         ) : (
//                             <div className="space-y-12">
//                                 {Object.entries(groupedData).map(([date, items]) => (
//                                     <div key={date} className="relative">
//                                         {/* Sticky Date Badge */}
//                                         <div className="sticky top-6 z-10 mb-6">
//                                             <span className="bg-slate-900 text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-xl uppercase tracking-[0.2em] border border-slate-700">
//                                                 {date}
//                                             </span>
//                                         </div>

//                                         {/* Timeline Vertical Line */}
//                                         <div className="ml-4 border-l-2 border-slate-200 pl-8 space-y-6">
//                                             {items.map((adv) => (
//                                                 <div key={adv._id} className="relative group">
//                                                     {/* Timeline Dot */}
//                                                     <div className="absolute -left-[41px] top-8 w-4 h-4 bg-white border-4 border-indigo-500 rounded-full z-0 group-hover:scale-125 transition-transform"></div>

//                                                     <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
//                                                         <div className="flex flex-col gap-6">
//                                                             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                                                                 <div className="flex-1">
//                                                                     <div className="flex items-center gap-3 mb-2">
//                                                                         <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">₹{adv.amount}</span>
//                                                                         <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-wider ${getStatusStyle(adv.status)}`}>
//                                                                             {adv.status}
//                                                                         </span>
//                                                                     </div>

//                                                                     <div className="flex items-center gap-2 mb-3">
//                                                                         <span className="bg-indigo-50 text-indigo-600 text-[11px] font-black px-2 py-1 rounded-md">
//                                                                             {formatTime(adv.createdAt)}
//                                                                         </span>
//                                                                         <h3 className="font-extrabold text-slate-700 text-lg">
//                                                                             {adv.employee?.name || "Unknown User"}
//                                                                         </h3>
//                                                                     </div>

//                                                                     <div className="flex flex-wrap gap-4 text-slate-400 text-sm font-bold">
//                                                                         <span className="flex items-center gap-1.5">📁 {adv.purpose}</span>
//                                                                         <span className="flex items-center gap-1.5">💳 {adv.paymentSource}</span>
//                                                                     </div>

//                                                                     {adv.description && (
//                                                                         <p className="mt-4 text-slate-500 text-sm leading-relaxed border-l-2 border-slate-100 pl-3 italic">
//                                                                             {adv.description}
//                                                                         </p>
//                                                                     )}
//                                                                 </div>

//                                                                 {/* Status Quick Actions */}
//                                                                 <div className="flex flex-row md:flex-col gap-2">
//                                                                     <button onClick={() => updateStatus(adv._id, "APPROVED")} className="flex-1 md:w-28 p-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition-all border border-emerald-100 text-[10px] font-black uppercase tracking-widest">Approve</button>
//                                                                     <button onClick={() => updateStatus(adv._id, "SETTLED")} className="flex-1 md:w-28 p-2.5 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-600 rounded-xl transition-all border border-sky-100 text-[10px] font-black uppercase tracking-widest">Settle</button>
//                                                                     <button onClick={() => updateStatus(adv._id, "REJECTED")} className="flex-1 md:w-28 p-2.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-all border border-rose-100 text-[10px] font-black uppercase tracking-widest">Reject</button>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Secondary Actions */}
//                                                             <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-50">
//                                                                 <button
//                                                                     onClick={() => { setActiveItem({ ...adv, employeeId: adv.employee?._id }); setShowEditModal(true); }}
//                                                                     className="flex-1 px-4 py-3 bg-slate-900 text-white hover:bg-black rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] text-center"
//                                                                 >
//                                                                     Modify
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => { setActiveItem(adv); setShowDeleteModal(true); }}
//                                                                     className="flex-1 px-4 py-3 bg-white text-rose-500 border border-slate-200 hover:bg-rose-50 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] text-center"
//                                                                 >
//                                                                     Remove
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ================= MODALS (Keep existing logic) ================= */}
//             {showEditModal && activeItem && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
//                     <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto">
//                         <h2 className="text-2xl font-black text-slate-800 mb-8">Update Record</h2>
//                         <div className="space-y-5">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Employee</label>
//                                 <select
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold appearance-none"
//                                     value={activeItem.employeeId}
//                                     onChange={(e) => setActiveItem({ ...activeItem, employeeId: e.target.value })}
//                                 >
//                                     {users.map((u) => (
//                                         <option key={u._id} value={u._id}>{u.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Amount (₹)</label>
//                                     <input
//                                         type="number"
//                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-black text-indigo-600 text-lg"
//                                         value={activeItem.amount}
//                                         onChange={(e) => setActiveItem({ ...activeItem, amount: e.target.value })}
//                                     />
//                                 </div>
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Source</label>
//                                     <select
//                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold"
//                                         value={activeItem.paymentSource}
//                                         onChange={(e) => setActiveItem({ ...activeItem, paymentSource: e.target.value })}
//                                     >
//                                         <option value="CASH">Cash</option>
//                                         <option value="BANK">Bank</option>
//                                         <option value="UPI">UPI</option>
//                                     </select>
//                                 </div>
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Purpose</label>
//                                 <select
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold"
//                                     value={activeItem.purpose}
//                                     onChange={(e) => setActiveItem({ ...activeItem, purpose: e.target.value })}
//                                 >
//                                     <option value="TRAVEL">Travel</option>
//                                     <option value="FOOD">Food</option>
//                                     <option value="OFFICE_PURCHASE">Office Purchase</option>
//                                     <option value="OTHER">Other</option>
//                                 </select>
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Notes</label>
//                                 <textarea
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none resize-none font-medium text-sm"
//                                     rows="3"
//                                     value={activeItem.description}
//                                     onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex gap-3 mt-10">
//                             <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest text-slate-500 bg-slate-100 rounded-2xl transition-colors hover:bg-slate-200">Cancel</button>
//                             <button onClick={handleSaveEdit} className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">Apply Changes</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showDeleteModal && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
//                     <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm relative shadow-2xl text-center">
//                         <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                         </div>
//                         <h2 className="text-2xl font-black mb-2 text-slate-800">Permanently Delete?</h2>
//                         <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">This record will be removed from history and cannot be recovered.</p>
//                         <div className="space-y-3">
//                             <button onClick={handleDelete} className="w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95">Confirm Removal</button>
//                             <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";

export default function AdvancePage() {
    const [advances, setAdvances] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const [form, setForm] = useState({
        employeeId: "",
        amount: "",
        purpose: "TRAVEL",
        paymentSource: "CASH",
        description: "",
    });

    // --- HELPER: Grouping & Formatting ---
    const getGroupedAdvances = () => {
        const groups = {};
        const sorted = [...advances].sort((a, b) =>
            new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
        );

        sorted.forEach((adv) => {
            const dateKey = adv.createdAt
                ? new Date(adv.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
                : "Recent";

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(adv);
        });
        return groups;
    };

    const formatTime = (dateString) => {
        if (!dateString) return "--:--";
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
            case "SETTLED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    // --- API Calls ---
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/employees", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            const data = await res.json();
            setUsers(data?.data || []);
        } catch {
            setUsers([]);
        }
    };

    const fetchAdvances = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/advance", {
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            const data = await res.json();
            setAdvances(data?.data || []);
        } catch {
            setAdvances([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAdvances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.employeeId || !form.amount) return alert("Fill required fields");

        setActionLoading(true);
        try {
            await fetch("/api/advance", {
                method: "POST",
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...form, amount: Number(form.amount) }),
            });
            setForm({ employeeId: "", amount: "", purpose: "TRAVEL", paymentSource: "CASH", description: "" });
            await fetchAdvances();
        } finally {
            setActionLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        setActionLoading(true);
        try {
            await fetch(`/api/advance/${id}`, {
                method: "PATCH",
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            await fetchAdvances();
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        setActionLoading(true);
        try {
            const payload = {
                ...activeItem,
                employeeId: activeItem.employeeId,
                amount: Number(activeItem.amount)
            };

            await fetch(`/api/advance/${activeItem._id}`, {
                method: "PATCH",
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            setShowEditModal(false);
            await fetchAdvances();
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await fetch(`/api/advance/${activeItem._id}`, {
                method: "DELETE",
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
            });
            setShowDeleteModal(false);
            await fetchAdvances();
        } finally {
            setActionLoading(false);
        }
    };

    const groupedData = getGroupedAdvances();

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 font-sans text-slate-900 relative">

            {/* 1. GLOBAL PROCESSING OVERLAY */}
            {actionLoading && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/40 backdrop-blur-[2px] cursor-wait">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 scale-110 transition-transform">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processing</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                            Advance Management
                        </h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: CREATE FORM */}
                    <div className="lg:col-span-4 order-1 lg:order-1">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 lg:sticky lg:top-8">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                New Advance Record
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <select
                                    disabled={actionLoading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium disabled:opacity-60"
                                    value={form.employeeId}
                                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                >
                                    <option value="">Select Employee</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </select>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        disabled={actionLoading}
                                        type="number"
                                        placeholder="Amount"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold disabled:opacity-60"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    />
                                    <select
                                        disabled={actionLoading}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60"
                                        value={form.paymentSource}
                                        onChange={(e) => setForm({ ...form, paymentSource: e.target.value })}
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="BANK">Bank</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>

                                <select
                                    disabled={actionLoading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60"
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
                                    disabled={actionLoading}
                                    placeholder="Brief description..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm disabled:opacity-60"
                                    rows="3"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />

                                <button
                                    disabled={actionLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : "Create Record"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: GROUPED LIST */}
                    <div className="lg:col-span-8 order-2 lg:order-2">
                        {loading ? (
                            <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading records...</div>
                        ) : Object.keys(groupedData).length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                                No activity records found.
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {Object.entries(groupedData).map(([date, items]) => (
                                    <div key={date} className="relative">
                                        <div className="sticky top-6 z-10 mb-6">
                                            <span className="bg-slate-900 text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-xl uppercase tracking-[0.2em] border border-slate-700">
                                                {date}
                                            </span>
                                        </div>

                                        <div className="ml-4 border-l-2 border-slate-200 pl-8 space-y-6">
                                            {items.map((adv) => (
                                                <div key={adv._id} className="relative group">
                                                    <div className="absolute -left-[41px] top-8 w-4 h-4 bg-white border-4 border-indigo-500 rounded-full z-0 group-hover:scale-125 transition-transform"></div>

                                                    <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                                                        <div className="flex flex-col gap-6">
                                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">₹{adv.amount}</span>
                                                                        <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-wider ${getStatusStyle(adv.status)}`}>
                                                                            {adv.status}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <span className="bg-indigo-50 text-indigo-600 text-[11px] font-black px-2 py-1 rounded-md">
                                                                            {formatTime(adv.createdAt)}
                                                                        </span>
                                                                        <h3 className="font-extrabold text-slate-700 text-lg">
                                                                            {adv.employee?.name || "Unknown User"}
                                                                        </h3>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-4 text-slate-400 text-sm font-bold">
                                                                        <span className="flex items-center gap-1.5">📁 {adv.purpose}</span>
                                                                        <span className="flex items-center gap-1.5">💳 {adv.paymentSource}</span>
                                                                    </div>

                                                                    {adv.description && (
                                                                        <p className="mt-4 text-slate-500 text-sm leading-relaxed border-l-2 border-slate-100 pl-3 italic">
                                                                            {adv.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Status Quick Actions */}
                                                                <div className="flex flex-row md:flex-col gap-2">
                                                                    <button
                                                                        disabled={actionLoading}
                                                                        onClick={() => updateStatus(adv._id, "APPROVED")}
                                                                        className="flex-1 md:w-28 p-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition-all border border-emerald-100 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                                                    >
                                                                        {actionLoading ? "..." : "Approve"}
                                                                    </button>
                                                                    <button
                                                                        disabled={actionLoading}
                                                                        onClick={() => updateStatus(adv._id, "SETTLED")}
                                                                        className="flex-1 md:w-28 p-2.5 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-600 rounded-xl transition-all border border-sky-100 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                                                    >
                                                                        {actionLoading ? "..." : "Settle"}
                                                                    </button>
                                                                    <button
                                                                        disabled={actionLoading}
                                                                        onClick={() => updateStatus(adv._id, "REJECTED")}
                                                                        className="flex-1 md:w-28 p-2.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-all border border-rose-100 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                                                    >
                                                                        {actionLoading ? "..." : "Reject"}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-50">
                                                                <button
                                                                    disabled={actionLoading}
                                                                    onClick={() => { setActiveItem({ ...adv, employeeId: adv.employee?._id }); setShowEditModal(true); }}
                                                                    className="flex-1 px-4 py-3 bg-slate-900 text-white hover:bg-black rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] text-center disabled:opacity-50"
                                                                >
                                                                    Modify
                                                                </button>
                                                                <button
                                                                    disabled={actionLoading}
                                                                    onClick={() => { setActiveItem(adv); setShowDeleteModal(true); }}
                                                                    className="flex-1 px-4 py-3 bg-white text-rose-500 border border-slate-200 hover:bg-rose-50 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] text-center disabled:opacity-50"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            {showEditModal && activeItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !actionLoading && setShowEditModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">Update Record</h2>
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Employee</label>
                                <select
                                    disabled={actionLoading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold appearance-none disabled:opacity-60"
                                    value={activeItem.employeeId}
                                    onChange={(e) => setActiveItem({ ...activeItem, employeeId: e.target.value })}
                                >
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Amount (₹)</label>
                                    <input
                                        disabled={actionLoading}
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-black text-indigo-600 text-lg disabled:opacity-60"
                                        value={activeItem.amount}
                                        onChange={(e) => setActiveItem({ ...activeItem, amount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Source</label>
                                    <select
                                        disabled={actionLoading}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold disabled:opacity-60"
                                        value={activeItem.paymentSource}
                                        onChange={(e) => setActiveItem({ ...activeItem, paymentSource: e.target.value })}
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="BANK">Bank</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Purpose</label>
                                <select
                                    disabled={actionLoading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold disabled:opacity-60"
                                    value={activeItem.purpose}
                                    onChange={(e) => setActiveItem({ ...activeItem, purpose: e.target.value })}
                                >
                                    <option value="TRAVEL">Travel</option>
                                    <option value="FOOD">Food</option>
                                    <option value="OFFICE_PURCHASE">Office Purchase</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Notes</label>
                                <textarea
                                    disabled={actionLoading}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none resize-none font-medium text-sm disabled:opacity-60"
                                    rows="3"
                                    value={activeItem.description}
                                    onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button
                                disabled={actionLoading}
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest text-slate-500 bg-slate-100 rounded-2xl transition-colors hover:bg-slate-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actionLoading}
                                onClick={handleSaveEdit}
                                className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {actionLoading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                {actionLoading ? "Saving..." : "Apply Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !actionLoading && setShowDeleteModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm relative shadow-2xl text-center">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2 text-slate-800">Permanently Delete?</h2>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">This record will be removed from history and cannot be recovered.</p>
                        <div className="space-y-3">
                            <button
                                disabled={actionLoading}
                                onClick={handleDelete}
                                className="w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {actionLoading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                {actionLoading ? "Deleting..." : "Confirm Removal"}
                            </button>
                            <button
                                disabled={actionLoading}
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}