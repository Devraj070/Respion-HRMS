// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import {
// // //     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// // //     PieChart, Pie, Cell, Legend, LineChart, Line
// // // } from "recharts";
// // // import {
// // //     Wallet, Users, TrendingUp, PieChart as PieIcon,
// // //     ArrowUpRight, ArrowDownRight, Activity, Calendar
// // // } from "lucide-react";

// // // export default function Analytics() {
// // //     const [data, setData] = useState(null);
// // //     const [loading, setLoading] = useState(true);

// // //     useEffect(() => {
// // //         const fetchStats = async () => {
// // //             try {
// // //                 const res = await fetch("/api/analytics");
// // //                 const result = await res.json();
// // //                 setData(result);
// // //             } catch (err) {
// // //                 console.error("Failed to fetch analytics", err);
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         };
// // //         fetchStats();
// // //     }, []);

// // //     if (loading) return <LoadingState />;

// // //     // Prepare data for Pie Chart (Attendance)
// // //     const attendancePieData = [
// // //         { name: "Present", value: data.attendance.present, color: "#10b981" },
// // //         { name: "Absent", value: data.attendance.absent, color: "#ef4444" },
// // //         { name: "Half Day", value: data.attendance.halfDay, color: "#f59e0b" },
// // //     ];

// // //     // Prepare data for Bar Chart (Expenses by Category)
// // //     const expenseBarData = Object.entries(data.categoryWiseExpense).map(([name, value]) => ({
// // //         name,
// // //         amount: value,
// // //     }));

// // //     return (
// // //         <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
// // //             <div className="mx-auto max-w-7xl">

// // //                 {/* HEADER */}
// // //                 <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// // //                     <div>
// // //                         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Insights</h1>
// // //                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
// // //                             <Calendar size={14} /> Real-time Financial & HR Data
// // //                         </p>
// // //                     </div>
// // //                     <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
// // //                         <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg">Today</button>
// // //                         <button className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">This Week</button>
// // //                     </div>
// // //                 </header>

// // //                 {/* TOP STATS GRID */}
// // //                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
// // //                     <SummaryCard
// // //                         title="Today's Spend"
// // //                         value={`₹${data.expenses.totalAmount.toLocaleString()}`}
// // //                         sub={`${data.expenses.total} Requests`}
// // //                         icon={<Wallet className="text-indigo-600" />}
// // //                         trend="+12%"
// // //                     />
// // //                     <SummaryCard
// // //                         title="Workforce Active"
// // //                         value={`${data.attendance.present}`}
// // //                         sub={`Out of ${data.attendance.total}`}
// // //                         icon={<Users className="text-emerald-600" />}
// // //                         trend="+2%"
// // //                     />
// // //                     <SummaryCard
// // //                         title="Pending Approvals"
// // //                         value={data.expenses.pending}
// // //                         sub="Awaiting review"
// // //                         icon={<Activity className="text-amber-600" />}
// // //                         isNeutral
// // //                     />
// // //                     <SummaryCard
// // //                         title="Lateness Rate"
// // //                         value={`${data.attendance.late}`}
// // //                         sub="Late check-ins"
// // //                         icon={<TrendingUp className="text-rose-600" />}
// // //                         trend="-5%"
// // //                         isNegative
// // //                     />
// // //                 </div>

// // //                 {/* CHARTS SECTION */}
// // //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

// // //                     {/* BAR CHART: EXPENSES */}
// // //                     <div className="lg:col-span-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
// // //                         <div className="mb-8 flex items-center justify-between">
// // //                             <h3 className="text-lg font-black text-slate-800">Expense Breakdown</h3>
// // //                             <div className="rounded-full bg-slate-100 p-2 text-slate-400"><TrendingUp size={20} /></div>
// // //                         </div>
// // //                         <div className="h-[350px] w-full">
// // //                             <ResponsiveContainer width="100%" height="100%">
// // //                                 <BarChart data={expenseBarData}>
// // //                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// // //                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
// // //                                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
// // //                                     <Tooltip
// // //                                         cursor={{ fill: '#f8fafc' }}
// // //                                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
// // //                                     />
// // //                                     <Bar dataKey="amount" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
// // //                                 </BarChart>
// // //                             </ResponsiveContainer>
// // //                         </div>
// // //                     </div>

// // //                     {/* PIE CHART: ATTENDANCE */}
// // //                     <div className="lg:col-span-4 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm flex flex-col">
// // //                         <div className="mb-8 flex items-center justify-between">
// // //                             <h3 className="text-lg font-black text-slate-800">Attendance Mix</h3>
// // //                             <div className="rounded-full bg-slate-100 p-2 text-slate-400"><PieIcon size={20} /></div>
// // //                         </div>
// // //                         <div className="h-[300px] w-full flex-1">
// // //                             <ResponsiveContainer width="100%" height="100%">
// // //                                 <PieChart>
// // //                                     <Pie
// // //                                         data={attendancePieData}
// // //                                         innerRadius={80}
// // //                                         outerRadius={110}
// // //                                         paddingAngle={8}
// // //                                         dataKey="value"
// // //                                     >
// // //                                         {attendancePieData.map((entry, index) => (
// // //                                             <Cell key={`cell-${index}`} fill={entry.color} />
// // //                                         ))}
// // //                                     </Pie>
// // //                                     <Tooltip />
// // //                                 </PieChart>
// // //                             </ResponsiveContainer>
// // //                         </div>
// // //                         <div className="mt-4 space-y-3">
// // //                             {attendancePieData.map((item) => (
// // //                                 <div key={item.name} className="flex items-center justify-between border-b border-slate-50 pb-2">
// // //                                     <div className="flex items-center gap-2">
// // //                                         <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
// // //                                         <span className="text-sm font-bold text-slate-600">{item.name}</span>
// // //                                     </div>
// // //                                     <span className="text-sm font-black text-slate-900">{item.value}</span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     </div>

// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // function SummaryCard({ title, value, sub, icon, trend, isNegative, isNeutral }) {
// // //     return (
// // //         <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-100/30">
// // //             <div className="mb-4 flex items-center justify-between">
// // //                 <div className="rounded-2xl bg-slate-50 p-3">{icon}</div>
// // //                 {!isNeutral && (
// // //                     <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
// // //                         {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
// // //                         {trend}
// // //                     </div>
// // //                 )}
// // //             </div>
// // //             <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
// // //             <div className="mt-1 flex items-baseline gap-2">
// // //                 <span className="text-3xl font-black text-slate-900">{value}</span>
// // //                 <span className="text-xs font-bold text-slate-400">{sub}</span>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // function LoadingState() {
// // //     return (
// // //         <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
// // //             <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-lg" />
// // //             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Assembling Analytics...</p>
// // //         </div>
// // //     );
// // // }


// // "use client";

// // import { useEffect, useState, useCallback } from "react";
// // import {
// //     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// //     PieChart, Pie, Cell
// // } from "recharts";
// // import {
// //     Wallet, Users, TrendingUp, PieChart as PieIcon,
// //     ArrowUpRight, ArrowDownRight, Activity, Calendar,
// //     AlertCircle, RefreshCcw
// // } from "lucide-react";

// // export default function Analytics() {
// //     const [data, setData] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const fetchStats = useCallback(async () => {
// //         setLoading(true);
// //         setError(null);
// //         try {
// //             const res = await fetch("/api/analytics", {
// //                 cache: 'no-store',
// //                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "" }
// //             });

// //             if (!res.ok) {
// //                 throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
// //             }

// //             const result = await res.json();

// //             // Validate data structure before setting state
// //             if (!result.attendance || !result.expenses) {
// //                 throw new Error("Invalid data format received from server");
// //             }

// //             setData(result);
// //         } catch (err) {
// //             console.error("Analytics Error:", err);
// //             setError(err.message || "An unexpected error occurred while loading analytics.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, []);

// //     useEffect(() => {
// //         fetchStats();
// //     }, [fetchStats]);

// //     if (loading) return <LoadingState />;

// //     if (error) return <ErrorState message={error} retry={fetchStats} />;

// //     // Prepare data for Charts
// //     const attendancePieData = [
// //         { name: "Present", value: data.attendance.present, color: "#10b981" },
// //         { name: "Absent", value: data.attendance.absent, color: "#ef4444" },
// //         { name: "Half Day", value: data.attendance.halfDay, color: "#f59e0b" },
// //     ].filter(item => item.value > 0); // Hide zero values for cleaner Pie

// //     const expenseBarData = Object.entries(data.categoryWiseExpense || {}).map(([name, value]) => ({
// //         name,
// //         amount: value,
// //     }));

// //     return (
// //         <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
// //             <div className="mx-auto max-w-7xl">

// //                 {/* HEADER */}
// //                 <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //                     <div>
// //                         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Insights</h1>
// //                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
// //                             <Calendar size={14} /> Real-time Financial & HR Data
// //                         </p>
// //                     </div>
// //                     <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
// //                         <button onClick={fetchStats} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
// //                             <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
// //                         </button>
// //                         <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg">Today</button>
// //                     </div>
// //                 </header>

// //                 {/* TOP STATS GRID */}
// //                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
// //                     <SummaryCard
// //                         title="Today's Spend"
// //                         value={`₹${(data.expenses.totalAmount || 0).toLocaleString()}`}
// //                         sub={`${data.expenses.total || 0} Requests`}
// //                         icon={<Wallet className="text-indigo-600" />}
// //                         trend="+12%"
// //                     />
// //                     <SummaryCard
// //                         title="Workforce Active"
// //                         value={data.attendance.present}
// //                         sub={`Out of ${data.attendance.total}`}
// //                         icon={<Users className="text-emerald-600" />}
// //                         trend="+2%"
// //                     />
// //                     <SummaryCard
// //                         title="Pending Approvals"
// //                         value={data.expenses.pending}
// //                         sub="Awaiting review"
// //                         icon={<Activity className="text-amber-600" />}
// //                         isNeutral
// //                     />
// //                     <SummaryCard
// //                         title="Lateness Rate"
// //                         value={data.attendance.late}
// //                         sub="Late check-ins"
// //                         icon={<TrendingUp className="text-rose-600" />}
// //                         trend="-5%"
// //                         isNegative
// //                     />
// //                 </div>

// //                 {/* CHARTS SECTION */}
// //                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

// //                     {/* BAR CHART */}
// //                     <div className="lg:col-span-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
// //                         <div className="mb-8 flex items-center justify-between">
// //                             <h3 className="text-lg font-black text-slate-800">Expense Breakdown</h3>
// //                             <div className="rounded-full bg-slate-100 p-2 text-slate-400"><TrendingUp size={20} /></div>
// //                         </div>
// //                         <div className="h-[350px] w-full">
// //                             {expenseBarData.length > 0 ? (
// //                                 <ResponsiveContainer width="100%" height="100%">
// //                                     <BarChart data={expenseBarData}>
// //                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //                                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
// //                                         <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
// //                                         <Tooltip
// //                                             cursor={{ fill: '#f8fafc' }}
// //                                             contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
// //                                         />
// //                                         <Bar dataKey="amount" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
// //                                     </BarChart>
// //                                 </ResponsiveContainer>
// //                             ) : (
// //                                 <EmptyChartState message="No expense data available for this period" />
// //                             )}
// //                         </div>
// //                     </div>

// //                     {/* PIE CHART */}
// //                     <div className="lg:col-span-4 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
// //                         <div className="mb-8 flex items-center justify-between">
// //                             <h3 className="text-lg font-black text-slate-800">Attendance Mix</h3>
// //                             <div className="rounded-full bg-slate-100 p-2 text-slate-400"><PieIcon size={20} /></div>
// //                         </div>
// //                         <div className="h-[300px] w-full flex-1">
// //                             {attendancePieData.length > 0 ? (
// //                                 <ResponsiveContainer width="100%" height="100%">
// //                                     <PieChart>
// //                                         <Pie data={attendancePieData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
// //                                             {attendancePieData.map((entry, index) => (
// //                                                 <Cell key={`cell-${index}`} fill={entry.color} />
// //                                             ))}
// //                                         </Pie>
// //                                         <Tooltip />
// //                                     </PieChart>
// //                                 </ResponsiveContainer>
// //                             ) : (
// //                                 <EmptyChartState message="No attendance data" />
// //                             )}
// //                         </div>
// //                         <div className="mt-4 space-y-3">
// //                             {attendancePieData.map((item) => (
// //                                 <div key={item.name} className="flex items-center justify-between border-b border-slate-50 pb-2">
// //                                     <div className="flex items-center gap-2">
// //                                         <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
// //                                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
// //                                     </div>
// //                                     <span className="text-sm font-black text-slate-900">{item.value}</span>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>

// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // // ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// // function ErrorState({ message, retry }) {
// //     return (
// //         <div className="flex h-screen flex-col items-center justify-center bg-white p-6 text-center">
// //             <div className="mb-4 rounded-2xl bg-rose-50 p-4 text-rose-500">
// //                 <AlertCircle size={48} />
// //             </div>
// //             <h2 className="text-xl font-black text-slate-900">Analytics Unavailable</h2>
// //             <p className="mt-2 max-w-md text-sm font-medium text-slate-500">{message}</p>
// //             <button
// //                 onClick={retry}
// //                 className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
// //             >
// //                 <RefreshCcw size={16} /> Try Again
// //             </button>
// //         </div>
// //     );
// // }

// // function EmptyChartState({ message }) {
// //     return (
// //         <div className="flex h-full items-center justify-center text-center">
// //             <p className="text-xs font-bold uppercase tracking-widest text-slate-300">{message}</p>
// //         </div>
// //     );
// // }

// // function SummaryCard({ title, value, sub, icon, trend, isNegative, isNeutral }) {
// //     return (
// //         <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-100/30">
// //             <div className="mb-4 flex items-center justify-between">
// //                 <div className="rounded-2xl bg-slate-50 p-3">{icon}</div>
// //                 {!isNeutral && (
// //                     <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
// //                         {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
// //                         {trend}
// //                     </div>
// //                 )}
// //             </div>
// //             <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
// //             <div className="mt-1 flex items-baseline gap-2">
// //                 <span className="text-3xl font-black text-slate-900">{value}</span>
// //                 <span className="text-[10px] font-bold text-slate-400 uppercase">{sub}</span>
// //             </div>
// //         </div>
// //     );
// // }

// // function LoadingState() {
// //     return (
// //         <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
// //             <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-lg" />
// //             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Intelligence...</p>
// //         </div>
// //     );
// // }



// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//     PieChart, Pie, Cell, AreaChart, Area
// } from "recharts";
// import {
//     Wallet, Users, TrendingUp, PieChart as PieIcon,
//     ArrowUpRight, ArrowDownRight, Activity, Calendar,
//     AlertCircle, RefreshCcw, Layers, Zap
// } from "lucide-react";

// export default function Analytics() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [view, setView] = useState("today"); // 'today' | 'tomorrow' | 'overall'

//     const fetchStats = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch("/api/analytics", {
//                 cache: 'no-store',
//                 headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "" }
//             });
//             if (!res.ok) throw new Error("Failed to sync dashboard data.");
//             const result = await res.json();
//             setData(result);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchStats(); }, [fetchStats]);

//     if (loading) return <LoadingState />;
//     if (error) return <ErrorState message={error} retry={fetchStats} />;

//     // Contextual Data Selection
//     const currentAttendance = data.attendance[view];
//     const currentExpenses = view === 'tomorrow' ? { totalAmount: 0, total: 0 } : data.expenses[view === 'overall' ? 'overall' : 'today'];

//     // Chart Data
//     const attendanceMix = [
//         { name: "Present", value: currentAttendance.present, color: "#4F46E5" },
//         { name: "Absent", value: currentAttendance.absent, color: "#F43F5E" },
//         { name: "Half Day", value: currentAttendance.halfDay, color: "#F59E0B" },
//     ].filter(v => v.value > 0);

//     // Comparison Chart (Today vs Tomorrow)
//     const forecastData = [
//         { name: 'Today', attendance: data.attendance.today.present },
//         { name: 'Tomorrow (Planned)', attendance: data.attendance.tomorrow.present },
//     ];

//     return (
//         <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-8 lg:p-12">
//             <div className="mx-auto max-w-7xl">

//                 {/* HEADER & VIEW SWITCHER */}
//                 <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//                     <div>
//                         <div className="flex items-center gap-2 mb-1">
//                             <Zap size={18} className="text-indigo-600 fill-indigo-600" />
//                             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Analytics</h1>
//                         </div>
//                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Operations Control</p>
//                     </div>

//                     <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
//                         {['today', 'tomorrow', 'overall'].map((t) => (
//                             <button
//                                 key={t}
//                                 onClick={() => setView(t)}
//                                 className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${view === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
//                                     }`}
//                             >
//                                 {t}
//                             </button>
//                         ))}
//                     </div>
//                 </header>

//                 {/* KPI STRIP */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//                     <KpiCard
//                         label="Projected Spend"
//                         value={`₹${currentExpenses.totalAmount.toLocaleString()}`}
//                         sub={`${currentExpenses.total} Vouchers`}
//                         icon={<Wallet size={18} />}
//                         color="indigo"
//                     />
//                     <KpiCard
//                         label="Headcount"
//                         value={currentAttendance.total}
//                         sub="Total Registered"
//                         icon={<Users size={18} />}
//                         color="emerald"
//                     />
//                     <KpiCard
//                         label="Status: Present"
//                         value={currentAttendance.present}
//                         sub={`${Math.round((currentAttendance.present / currentAttendance.total) * 100 || 0)}% Occupancy`}
//                         icon={<Activity size={18} />}
//                         color="amber"
//                     />
//                     <KpiCard
//                         label="Incidents"
//                         value={currentAttendance.late || 0}
//                         sub="Late Arrivals"
//                         icon={<AlertCircle size={18} />}
//                         color="rose"
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//                     {/* ATTENDANCE MIX (PIE) */}
//                     <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center">
//                         <div className="w-full flex justify-between items-center mb-6">
//                             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Distribution</h3>
//                             <PieIcon size={16} className="text-slate-300" />
//                         </div>
//                         <div className="h-[250px] w-full">
//                             <ResponsiveContainer>
//                                 <PieChart>
//                                     <Pie data={attendanceMix} innerRadius={60} outerRadius={90} paddingAngle={10} dataKey="value">
//                                         {attendanceMix.map((entry, index) => (
//                                             <Cell key={index} fill={entry.color} strokeWidth={0} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="w-full space-y-3 mt-4">
//                             {attendanceMix.map((item) => (
//                                 <div key={item.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
//                                         <span className="text-[10px] font-black uppercase text-slate-500">{item.name}</span>
//                                     </div>
//                                     <span className="text-sm font-black text-slate-900">{item.value}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* FORECAST & TRENDS (AREA CHART) */}
//                     <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50">
//                         <div className="flex justify-between items-center mb-10">
//                             <div>
//                                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Trend Analysis</h3>
//                                 <p className="text-xs font-bold text-indigo-600 mt-1">Today vs Tomorrow Forecast</p>
//                             </div>
//                             <Layers size={16} className="text-slate-300" />
//                         </div>

//                         <div className="h-[300px] w-full">
//                             <ResponsiveContainer>
//                                 <AreaChart data={forecastData}>
//                                     <defs>
//                                         <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
//                                             <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
//                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
//                                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
//                                     <Tooltip />
//                                     <Area type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>

//                         <div className="mt-8 grid grid-cols-2 gap-4">
//                             <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
//                                 <p className="text-[9px] font-black uppercase text-slate-400">Total System Entries</p>
//                                 <p className="text-xl font-black text-slate-900">{data.attendance.overall.total}</p>
//                             </div>
//                             <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
//                                 <p className="text-[9px] font-black uppercase text-slate-400">Cumulative Spend</p>
//                                 <p className="text-xl font-black text-slate-900">₹{data.expenses.overall.totalAmount.toLocaleString()}</p>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── COMPONENTS ──────────────────────────────────────────────────────────────

// function KpiCard({ label, value, sub, icon, color }) {
//     const colors = {
//         indigo: "bg-indigo-50 text-indigo-600",
//         emerald: "bg-emerald-50 text-emerald-600",
//         amber: "bg-amber-50 text-amber-600",
//         rose: "bg-rose-50 text-rose-600",
//     };
//     return (
//         <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
//             <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
//                 {icon}
//             </div>
//             <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</p>
//             <h2 className="text-2xl font-black text-slate-900 mt-1">{value}</h2>
//             <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{sub}</p>
//         </div>
//     );
// }

// function LoadingState() {
//     return (
//         <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Calculating Engine...</p>
//         </div>
//     );
// }

// function ErrorState({ message, retry }) {
//     return (
//         <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
//             <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
//                 <AlertCircle size={32} />
//             </div>
//             <h2 className="text-xl font-black text-slate-900">Link Interrupted</h2>
//             <p className="text-sm font-medium text-slate-500 mt-2 max-w-xs">{message}</p>
//             <button onClick={retry} className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
//                 <RefreshCcw size={14} /> Reconnect
//             </button>
//         </div>
//     );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
    Wallet, Users, TrendingUp, PieChart as PieIcon,
    Zap, Activity, Calendar, AlertCircle, RefreshCcw, Layers, History
} from "lucide-react";

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState("today"); // 'today' | 'yesterday' | 'overall'

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/analytics", {
                cache: 'no-store',
                headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "" }
            });
            if (!res.ok) throw new Error("Connection to analytics engine failed.");
            const result = await res.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} retry={fetchStats} />;

    // Contextual Data Selection
    const currentAttendance = data.attendance[view];
    const currentExpenses = data.expenses[view];

    // Attendance Mix Data
    const attendanceMix = [
        { name: "Present", value: currentAttendance.present, color: "#4F46E5" },
        { name: "Absent", value: currentAttendance.absent, color: "#F43F5E" },
        { name: "Half Day", value: currentAttendance.halfDay, color: "#F59E0B" },
    ].filter(v => v.value > 0);

    // Performance Comparison (Yesterday vs Today)
    const comparisonData = [
        { name: 'Yesterday', attendance: data.attendance.yesterday.present },
        { name: 'Today', attendance: data.attendance.today.present },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-8 lg:p-12">
            <div className="mx-auto max-w-7xl">

                {/* HEADER & VIEW SWITCHER */}
                <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={18} className="text-indigo-600 fill-indigo-600" />
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Analytics</h1>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historical Performance Control</p>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        {['yesterday', 'today', 'overall'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setView(t)}
                                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${view === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </header>

                {/* KPI STRIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KpiCard
                        label="Period Spend"
                        value={`₹${currentExpenses.totalAmount.toLocaleString()}`}
                        sub={`${currentExpenses.total} Records`}
                        icon={<Wallet size={18} />}
                        color="indigo"
                    />
                    <KpiCard
                        label="Workforce"
                        value={currentAttendance.total}
                        sub="Total Headcount"
                        icon={<Users size={18} />}
                        color="emerald"
                    />
                    <KpiCard
                        label="Occupancy"
                        value={currentAttendance.present}
                        sub={`${Math.round((currentAttendance.present / currentAttendance.total) * 100 || 0)}% Active`}
                        icon={<Activity size={18} />}
                        color="amber"
                    />
                    <KpiCard
                        label="Exceptions"
                        value={currentAttendance.late || 0}
                        sub="Late Check-ins"
                        icon={<AlertCircle size={18} />}
                        color="rose"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* DISTRIBUTION MIX */}
                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Status Mix</h3>
                            <PieIcon size={16} className="text-slate-300" />
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={attendanceMix} innerRadius={60} outerRadius={90} paddingAngle={10} dataKey="value">
                                        {attendanceMix.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4">
                            {attendanceMix.map((item) => (
                                <div key={item.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-black uppercase text-slate-500">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GROWTH TRENDS (Yesterday vs Today) */}
                    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Velocity Trend</h3>
                                <p className="text-xs font-bold text-indigo-600 mt-1">Comparing Yesterday vs Today Attendance</p>
                            </div>
                            <History size={16} className="text-slate-300" />
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <AreaChart data={comparisonData}>
                                    <defs>
                                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
                                <p className="text-[9px] font-black uppercase text-slate-400">Total System Attendance</p>
                                <p className="text-xl font-black text-slate-900">{data.attendance.overall.total}</p>
                            </div>
                            <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
                                <p className="text-[9px] font-black uppercase text-slate-400">Global Expenditure</p>
                                <p className="text-xl font-black text-slate-900">₹{data.expenses.overall.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, color }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
    };
    return (
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{value}</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{sub}</p>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Syncing Engine...</p>
        </div>
    );
}

function ErrorState({ message, retry }) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900">System Link Error</h2>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-xs">{message}</p>
            <button onClick={retry} className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                <RefreshCcw size={14} /> Retry Sync
            </button>
        </div>
    );
}