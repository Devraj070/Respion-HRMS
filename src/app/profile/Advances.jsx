// "use client";

// import { useEffect, useState } from "react";
// import {
//     Clock,
//     CheckCircle2,
//     XCircle,
//     CreditCard,
//     Calendar,
//     ChevronRight,
//     AlertCircle,
//     Banknote
// } from "lucide-react";

// export default function Advances() {
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

//     // Helper to get status styles and icons
//     const getStatusDetails = (status) => {
//         switch (status) {
//             case "APPROVED":
//                 return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={16} /> };
//             case "REJECTED":
//                 return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle size={16} /> };
//             case "SETTLED":
//                 return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <CreditCard size={16} /> };
//             default:
//                 return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={16} /> };
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//                 <p className="text-gray-500 font-medium">Loading your advances...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
//                 <AlertCircle size={20} />
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6 md:p-10">
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">My Advances</h1>
//                     <p className="text-gray-500 mt-1">Track and manage your Issued cash advances</p>
//                 </div>

//             </div>

//             {advances.length === 0 ? (
//                 <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//                     <p className="text-gray-400 text-lg">No advances found in your history.</p>
//                 </div>
//             ) : (
//                 <div className="grid gap-6">
//                     {advances.map((adv) => {
//                         const { color, icon } = getStatusDetails(adv.status);
//                         return (
//                             <div
//                                 key={adv._id}
//                                 className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200"
//                             >
//                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                     <div className="flex items-center gap-4">
//                                         <div className={`p-3 rounded-xl ${color.split(' ')[0]}`}>
//                                             <Banknote className={color.split(' ')[1]} size={24} />
//                                         </div>
//                                         <div>
//                                             <div className="flex items-center gap-2">
//                                                 <h2 className="text-xl font-bold text-gray-900">₹{adv.amount.toLocaleString('en-IN')}</h2>
//                                                 <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
//                                                     {icon}
//                                                     {adv.status}
//                                                 </span>
//                                             </div>
//                                             <p className="text-gray-600 font-medium mt-0.5">{adv.purpose}</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col items-end gap-2">
//                                         <div className="flex items-center gap-1.5 text-gray-400 text-sm">
//                                             <Calendar size={14} />
//                                             <span>Issued {new Date(adv.createdAt).toLocaleDateString()}</span>
//                                         </div>
//                                         {adv.approvedAt && (
//                                             <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
//                                                 <CheckCircle2 size={14} />
//                                                 <span>Approved {new Date(adv.approvedAt).toLocaleDateString()}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {adv.description && (
//                                     <div className="mt-4 pt-4 border-t border-gray-50">
//                                         <p className="text-sm text-gray-500 italic leading-relaxed">
//                                             &ldquo;{adv.description}&rdquo;
//                                         </p>
//                                     </div>
//                                 )}


//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Clock, CheckCircle2, XCircle, CreditCard,
    Calendar, AlertCircle, Banknote
} from "lucide-react";

export default function Advances() {
    const [advances, setAdvances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
        fetchAdvances();
    }, []);

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-gray-400 animate-pulse">Fetching history...</p>
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10">
            <header className="mb-10">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Advances</h1>

            </header>

            {advances.length === 0 ? (
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