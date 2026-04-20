// "use client";

// import { useEffect, useState } from "react";
// import { RefreshCw, MapPin, CalendarDays } from "lucide-react";

// export default function AttendancePage() {
//     const [attendance, setAttendance] = useState([]);
//     const [date, setDate] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchAttendance = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("/api/attendance", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY
//                 },
//             });
//             const data = await res.json();
//             setAttendance(data.success ? data.data : []);
//         } catch {
//             setAttendance([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, []);

//     // --- DATE GROUPING LOGIC ---
//     const getGroupedData = () => {
//         const groups = { Today: [], Yesterday: [], Earlier: {} };
//         const todayStr = new Date().toDateString();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         const yesterdayStr = yesterday.toDateString();

//         attendance.forEach(item => {
//             const itemDate = new Date(item.date);
//             const itemDateStr = itemDate.toDateString();

//             // Filter if date picker is used
//             if (date && itemDateStr !== new Date(date).toDateString()) return;

//             if (itemDateStr === todayStr) {
//                 groups.Today.push(item);
//             } else if (itemDateStr === yesterdayStr) {
//                 groups.Yesterday.push(item);
//             } else {
//                 const formattedDate = itemDate.toLocaleDateString('en-GB'); // dd/mm/yy
//                 if (!groups.Earlier[formattedDate]) groups.Earlier[formattedDate] = [];
//                 groups.Earlier[formattedDate].push(item);
//             }
//         });
//         return groups;
//     };

//     const grouped = getGroupedData();
//     const todayData = attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

//     const stats = {
//         totalToday: todayData.length,
//         present: todayData.filter(a => a.status === "present").length,
//         absent: todayData.filter(a => a.status === "absent").length,
//         avgHours: todayData.length > 0
//             ? (todayData.reduce((acc, cur) => acc + (cur.workingHours || 0), 0) / todayData.length).toFixed(1)
//             : "0.0",
//     };

//     return (
//         <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4">
//             <div className="max-w-9xl mx-auto">
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-2xl font-bold tracking-tight text-slate-800">Attendance Dashboard</h1>
//                         <p className="text-sm text-slate-500">Manage and track employee presence</p>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-3">
//                         <input
//                             type="date"
//                             value={date}
//                             onChange={(e) => setDate(e.target.value)}
//                             className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                         />
//                         <button onClick={() => setDate("")} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
//                             Reset
//                         </button>
//                     </div>
//                 </div>

//                 {/* STATS */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                     <StatCard title="Total Staff" value={stats.totalToday} sub="Today" />
//                     <StatCard title="Present" value={stats.present} type="success" />
//                     <StatCard title="Absent" value={stats.absent} type="danger" />
//                     <StatCard title="Avg. Hours" value={`${stats.avgHours}h`} type="info" />
//                 </div>

//                 {/* GROUPED TABLES */}
//                 <div className="space-y-6">
//                     {grouped.Today.length > 0 && <TableGroup title="Today" data={grouped.Today} loading={loading} fetchAttendance={fetchAttendance} />}
//                     {grouped.Yesterday.length > 0 && <TableGroup title="Yesterday" data={grouped.Yesterday} />}
//                     {Object.keys(grouped.Earlier).sort((a, b) => b.localeCompare(a)).map(d => (
//                         <TableGroup key={d} title={d} data={grouped.Earlier[d]} />
//                     ))}

//                     {attendance.length === 0 && !loading && (
//                         <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 text-slate-400">
//                             No records found.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Helper to keep the table structure consistent
// function TableGroup({ title, data, loading, fetchAttendance }) {
//     return (
//         <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                 <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">{title}</span>
//                 {fetchAttendance && (
//                     <button onClick={fetchAttendance} disabled={loading} className="p-2 text-slate-400 hover:text-indigo-600 transition">
//                         <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
//                     </button>
//                 )}
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-blue-950">
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Employee</th>
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Designation</th>
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Status</th>
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Check In/Out</th>
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Hours</th>
//                             <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Location</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                         {data.map((item) => (
//                             <tr key={item._id} className="hover:bg-slate-50/50 transition duration-150">
//                                 <td className="px-6 py-4">
//                                     <div className="flex flex-col">
//                                         <span className="font-semibold text-slate-700">{item.user?.name || "Anonymous"}</span>
//                                         <span className="text-md text-slate-400">{item.user?.phone || "No phone"}</span>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-slate-600 text-sm">{item.user?.designation || "N/A"}</td>
//                                 <td className="px-6 py-4 text-center">
//                                     <StatusBadge status={item.status} isLate={item.isLate} />
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex items-center gap-4 text-xs font-medium">
//                                         <div className="flex flex-col">
//                                             <span className="text-emerald-500 uppercase text-lg font-bold">In</span>
//                                             <span className="text-slate-600 text-sm">{formatTime(item.checkIn)}</span>
//                                         </div>
//                                         <div className="flex flex-col">
//                                             <span className="text-rose-500 uppercase text-lg font-bold">Out</span>
//                                             <span className="text-slate-600 text-sm">{formatTime(item.checkOut)}</span>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.workingHours ?? "0"}h</td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex flex-col gap-1">
//                                         <div className="flex items-center gap-1 text-md text-slate-500">
//                                             <MapPin size={10} className="text-emerald-400" /> {item.checkInLocation || "N/A"}
//                                         </div>
//                                         <div className="flex items-center gap-1 text-md text-slate-500">
//                                             <MapPin size={10} className="text-rose-400" /> {item.checkOutLocation || "N/A"}
//                                         </div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// function StatCard({ title, value, type = "default", sub }) {
//     const styles = {
//         default: "border-slate-200",
//         success: "border-emerald-100",
//         danger: "border-rose-100",
//         info: "border-indigo-100",
//     };
//     return (
//         <div className={`bg-white p-5 rounded-2xl border ${styles[type]} shadow-sm`}>
//             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
//             <div className="flex items-baseline gap-2">
//                 <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
//                 {sub && <span className="text-[10px] text-slate-400 font-medium italic">{sub}</span>}
//             </div>
//         </div>
//     );
// }

// function StatusBadge({ status, isLate }) {
//     const variants = {
//         present: "bg-emerald-50 text-emerald-700 border-emerald-100",
//         absent: "bg-rose-50 text-rose-700 border-rose-100",
//         "half-day": "bg-amber-50 text-amber-700 border-amber-100",
//     };
//     return (
//         <div className="flex flex-col items-center gap-1">
//             <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${variants[status] || "bg-slate-50 text-slate-600"}`}>
//                 {status}
//             </span>
//             {isLate && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter">Late Entry</span>}
//         </div>
//     );
// }

// function formatTime(time) {
//     if (!time) return "--:--";
//     return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }


// // "use client";

// // import { useEffect, useState } from "react";
// // import { RefreshCw, MapPin, CalendarDays, Clock, User, Phone } from "lucide-react";

// // export default function AttendancePage() {
// //     const [attendance, setAttendance] = useState([]);
// //     const [date, setDate] = useState("");
// //     const [loading, setLoading] = useState(false);

// //     const fetchAttendance = async () => {
// //         setLoading(true);
// //         try {
// //             const res = await fetch("/api/attendance", {
// //                 method: "GET",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY
// //                 },
// //             });
// //             const data = await res.json();
// //             setAttendance(data.success ? data.data : []);
// //         } catch {
// //             setAttendance([]);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchAttendance();
// //     }, []);

// //     const getGroupedData = () => {
// //         const groups = { Today: [], Yesterday: [], Earlier: {} };
// //         const todayStr = new Date().toDateString();
// //         const yesterday = new Date();
// //         yesterday.setDate(yesterday.getDate() - 1);
// //         const yesterdayStr = yesterday.toDateString();

// //         attendance.forEach(item => {
// //             const itemDate = new Date(item.date);
// //             const itemDateStr = itemDate.toDateString();

// //             if (date && itemDateStr !== new Date(date).toDateString()) return;

// //             if (itemDateStr === todayStr) {
// //                 groups.Today.push(item);
// //             } else if (itemDateStr === yesterdayStr) {
// //                 groups.Yesterday.push(item);
// //             } else {
// //                 const formattedDate = itemDate.toLocaleDateString('en-GB');
// //                 if (!groups.Earlier[formattedDate]) groups.Earlier[formattedDate] = [];
// //                 groups.Earlier[formattedDate].push(item);
// //             }
// //         });
// //         return groups;
// //     };

// //     const grouped = getGroupedData();
// //     const todayData = attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

// //     const stats = {
// //         totalToday: todayData.length,
// //         present: todayData.filter(a => a.status === "present").length,
// //         absent: todayData.filter(a => a.status === "absent").length,
// //         avgHours: todayData.length > 0
// //             ? (todayData.reduce((acc, cur) => acc + (cur.workingHours || 0), 0) / todayData.length).toFixed(1)
// //             : "0.0",
// //     };

// //     return (
// //         <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-3 md:p-6">
// //             <div className="max-w-7xl mx-auto">

// //                 {/* HEADER - Responsive Stack */}
// //                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
// //                     <div>
// //                         <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Attendance</h1>
// //                         <p className="text-xs md:text-sm text-slate-500 font-medium">Daily presence tracking</p>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                         <input
// //                             type="date"
// //                             value={date}
// //                             onChange={(e) => setDate(e.target.value)}
// //                             className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
// //                         />
// //                         <button onClick={() => setDate("")} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
// //                             Reset
// //                         </button>
// //                     </div>
// //                 </div>

// //                 {/* STATS - 2 columns on mobile, 4 on desktop */}
// //                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
// //                     <StatCard title="Total Staff" value={stats.totalToday} sub="Today" />
// //                     <StatCard title="Present" value={stats.present} type="success" />
// //                     <StatCard title="Absent" value={stats.absent} type="danger" />
// //                     <StatCard title="Avg. Hours" value={`${stats.avgHours}h`} type="info" />
// //                 </div>

// //                 {/* GROUPED LISTS */}
// //                 <div className="space-y-8">
// //                     {grouped.Today.length > 0 && <TableGroup title="Today" data={grouped.Today} loading={loading} fetchAttendance={fetchAttendance} />}
// //                     {grouped.Yesterday.length > 0 && <TableGroup title="Yesterday" data={grouped.Yesterday} />}
// //                     {Object.keys(grouped.Earlier).sort((a, b) => b.localeCompare(a)).map(d => (
// //                         <TableGroup key={d} title={d} data={grouped.Earlier[d]} />
// //                     ))}

// //                     {attendance.length === 0 && !loading && (
// //                         <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
// //                             No attendance records found.
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // function TableGroup({ title, data, loading, fetchAttendance }) {
// //     return (
// //         <div className="space-y-3">
// //             <div className="flex justify-between items-center px-1">
// //                 <span className="font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">{title}</span>
// //                 {fetchAttendance && (
// //                     <button onClick={fetchAttendance} disabled={loading} className="p-2 text-slate-400 hover:text-indigo-600 transition">
// //                         <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
// //                     </button>
// //                 )}
// //             </div>

// //             {/* MOBILE VIEW: List of Cards */}
// //             <div className="grid grid-cols-1 gap-3 md:hidden">
// //                 {data.map(item => (
// //                     <MobileCard key={item._id} item={item} />
// //                 ))}
// //             </div>

// //             {/* DESKTOP VIEW: Standard Table */}
// //             <div className="hidden md:block bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
// //                 <div className="overflow-x-auto">
// //                     <table className="w-full text-left border-collapse">
// //                         <thead>
// //                             <tr className="bg-slate-900">
// //                                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
// //                                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
// //                                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check In/Out</th>
// //                                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hours</th>
// //                                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locations</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-slate-100">
// //                             {data.map((item) => (
// //                                 <tr key={item._id} className="hover:bg-slate-50 transition duration-150">
// //                                     <td className="px-6 py-4">
// //                                         <div className="flex flex-col">
// //                                             <span className="font-bold text-slate-700">{item.user?.name || "Anonymous"}</span>
// //                                             <span className="text-xs text-slate-400 font-medium">{item.user?.designation || "Staff"}</span>
// //                                         </div>
// //                                     </td>
// //                                     <td className="px-6 py-4 text-center">
// //                                         <StatusBadge status={item.status} isLate={item.isLate} />
// //                                     </td>
// //                                     <td className="px-6 py-4">
// //                                         <div className="flex items-center gap-4 text-xs">
// //                                             <div className="flex flex-col">
// //                                                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">In</span>
// //                                                 <span className="text-slate-600 font-bold">{formatTime(item.checkIn)}</span>
// //                                             </div>
// //                                             <div className="flex flex-col">
// //                                                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Out</span>
// //                                                 <span className="text-slate-600 font-bold">{formatTime(item.checkOut)}</span>
// //                                             </div>
// //                                         </div>
// //                                     </td>
// //                                     <td className="px-6 py-4 text-center font-bold text-slate-700">{item.workingHours ?? "0"}h</td>
// //                                     <td className="px-6 py-4">
// //                                         <div className="flex flex-col gap-1 max-w-[150px]">
// //                                             <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
// //                                                 <MapPin size={10} className="text-emerald-400 shrink-0" /> {item.checkInLocation || "N/A"}
// //                                             </div>
// //                                             <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
// //                                                 <MapPin size={10} className="text-rose-400 shrink-0" /> {item.checkOutLocation || "N/A"}
// //                                             </div>
// //                                         </div>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // // Mobile-specific card UI
// // // Update the MobileCard component in your file with this version:

// // function MobileCard({ item }) {
// //     return (
// //         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
// //             {/* Top Section: User Info & Status */}
// //             <div className="flex justify-between items-start">
// //                 <div className="flex gap-3">
// //                     <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
// //                         <User size={20} />
// //                     </div>
// //                     <div className="min-w-0">
// //                         <p className="font-bold text-slate-800 leading-none truncate">{item.user?.name || "Anonymous"}</p>
// //                         <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tight truncate">
// //                             {item.user?.designation || "Staff"}
// //                         </p>
// //                     </div>
// //                 </div>
// //                 <StatusBadge status={item.status} isLate={item.isLate} />
// //             </div>

// //             {/* Middle Section: Time Grid */}
// //             <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
// //                 <div className="flex flex-col">
// //                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Check In</span>
// //                     <span className="text-sm font-bold text-slate-700">{formatTime(item.checkIn)}</span>
// //                 </div>
// //                 <div className="flex flex-col border-l border-slate-200 pl-3">
// //                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Check Out</span>
// //                     <span className="text-sm font-bold text-slate-700">{formatTime(item.checkOut)}</span>
// //                 </div>
// //             </div>

// //             {/* Bottom Section: Hours and BOTH Locations */}
// //             <div className="space-y-3 pt-1">
// //                 <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
// //                     <Clock size={12} />
// //                     <span>{item.workingHours ?? "0"} Hours Worked</span>
// //                 </div>

// //                 <div className="grid grid-cols-1 gap-2">
// //                     <div className="flex items-start gap-2">
// //                         <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
// //                         <div className="flex flex-col">
// //                             <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">In Location</span>
// //                             <span className="text-[11px] text-slate-600 font-medium leading-tight">
// //                                 {item.checkInLocation || "Not Recorded"}
// //                             </span>
// //                         </div>
// //                     </div>

// //                     <div className="flex items-start gap-2">
// //                         <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
// //                         <div className="flex flex-col">
// //                             <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Out Location</span>
// //                             <span className="text-[11px] text-slate-600 font-medium leading-tight">
// //                                 {item.checkOutLocation || "Not Recorded"}
// //                             </span>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // function StatCard({ title, value, type = "default", sub }) {
// //     const styles = {
// //         default: "border-slate-200",
// //         success: "border-emerald-100 bg-emerald-50/30",
// //         danger: "border-rose-100 bg-rose-50/30",
// //         info: "border-indigo-100 bg-indigo-50/30",
// //     };
// //     return (
// //         <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border ${styles[type]} bg-white shadow-sm transition-transform active:scale-95`}>
// //             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
// //             <div className="flex items-baseline gap-1.5">
// //                 <h2 className="text-xl md:text-2xl font-black text-slate-800">{value}</h2>
// //                 {sub && <span className="text-[10px] text-slate-400 font-bold italic">{sub}</span>}
// //             </div>
// //         </div>
// //     );
// // }

// // function StatusBadge({ status, isLate }) {
// //     const variants = {
// //         present: "bg-emerald-50 text-emerald-600 border-emerald-100",
// //         absent: "bg-rose-50 text-rose-600 border-rose-100",
// //         "half-day": "bg-amber-50 text-amber-600 border-amber-100",
// //     };
// //     return (
// //         <div className="flex flex-col items-center sm:items-end gap-1">
// //             <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${variants[status] || "bg-slate-50 text-slate-600"}`}>
// //                 {status}
// //             </span>
// //             {isLate && (
// //                 <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded text-[8px] font-black uppercase tracking-tighter animate-pulse">
// //                     Late
// //                 </span>
// //             )}
// //         </div>
// //     );
// // }

// // function formatTime(time) {
// //     if (!time) return "--:--";
// //     return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
// // }



"use client";

import { useEffect, useState } from "react";
import { RefreshCw, MapPin, CalendarDays, Clock, User } from "lucide-react";

export default function AttendancePage() {
    const [attendance, setAttendance] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/attendance", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY
                },
            });
            const data = await res.json();
            setAttendance(data.success ? data.data : []);
        } catch {
            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const getGroupedData = () => {
        const groups = { Today: [], Yesterday: [], Earlier: {} };
        const todayStr = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        attendance.forEach(item => {
            const itemDate = new Date(item.date);
            const itemDateStr = itemDate.toDateString();

            if (date && itemDateStr !== new Date(date).toDateString()) return;

            if (itemDateStr === todayStr) {
                groups.Today.push(item);
            } else if (itemDateStr === yesterdayStr) {
                groups.Yesterday.push(item);
            } else {
                const formattedDate = itemDate.toLocaleDateString('en-GB');
                if (!groups.Earlier[formattedDate]) groups.Earlier[formattedDate] = [];
                groups.Earlier[formattedDate].push(item);
            }
        });
        return groups;
    };

    const grouped = getGroupedData();
    const todayData = attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

    const stats = {
        totalToday: todayData.length,
        present: todayData.filter(a => a.status === "present").length,
        absent: todayData.filter(a => a.status === "absent").length,
        avgHours: todayData.length > 0
            ? (todayData.reduce((acc, cur) => acc + (cur.workingHours || 0), 0) / todayData.length).toFixed(1)
            : "0.0",
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-8">
            <div className="max-w-9xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Attendance Dashboard</h1>
                        <p className="text-sm text-slate-500">Manage and track employee presence</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="flex-1 md:flex-none appearance-none bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button onClick={() => setDate("")} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                            Reset
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Staff" value={stats.totalToday} sub="Today" />
                    <StatCard title="Present" value={stats.present} type="success" />
                    <StatCard title="Absent" value={stats.absent} type="danger" />
                    <StatCard title="Avg. Hours" value={`${stats.avgHours}h`} type="info" />
                </div>

                {/* GROUPED TABLES / CARDS */}
                <div className="space-y-8">
                    {grouped.Today.length > 0 && <TableGroup title="Today" data={grouped.Today} loading={loading} fetchAttendance={fetchAttendance} />}
                    {grouped.Yesterday.length > 0 && <TableGroup title="Yesterday" data={grouped.Yesterday} />}
                    {Object.keys(grouped.Earlier).sort((a, b) => b.localeCompare(a)).map(d => (
                        <TableGroup key={d} title={d} data={grouped.Earlier[d]} />
                    ))}

                    {attendance.length === 0 && !loading && (
                        <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 text-slate-400">
                            No records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TableGroup({ title, data, loading, fetchAttendance }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">{title}</span>
                {fetchAttendance && (
                    <button onClick={fetchAttendance} disabled={loading} className="p-2 text-slate-400 hover:text-indigo-600 transition">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                )}
            </div>

            {/* MOBILE VIEW */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data.map((item) => (
                    <MobileCard key={item._id} item={item} />
                ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-950">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Designation</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Check In/Out</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Hours</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-700">{item.user?.name || "Anonymous"}</span>
                                            <span className="text-sm text-slate-400">{item.user?.phone || "No phone"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{item.user?.designation || "N/A"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={item.status} isLate={item.isLate} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-xs font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-emerald-500 uppercase text-[10px] font-bold">In</span>
                                                <span className="text-slate-600 text-sm">{formatTime(item.checkIn)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-rose-500 uppercase text-[10px] font-bold">Out</span>
                                                <span className="text-slate-600 text-sm">{formatTime(item.checkOut)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.workingHours ?? "0"}h</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin size={12} className="text-emerald-400 shrink-0" /> {item.checkInLocation || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin size={12} className="text-rose-400 shrink-0" /> {item.checkOutLocation || "N/A"}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MobileCard({ item }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                        <User size={20} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 leading-none truncate">{item.user?.name || "Anonymous"}</p>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tight truncate">
                            {item.user?.designation || "Staff"}
                        </p>
                    </div>
                </div>
                <StatusBadge status={item.status} isLate={item.isLate} />
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Check In</span>
                    <span className="text-sm font-bold text-slate-700">{formatTime(item.checkIn)}</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Check Out</span>
                    <span className="text-sm font-bold text-slate-700">{formatTime(item.checkOut)}</span>
                </div>
            </div>

            <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
                    <Clock size={12} />
                    <span>{item.workingHours ?? "0"} Hours Worked</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">In Location</span>
                            <span className="text-[11px] text-slate-600 font-medium leading-tight">
                                {item.checkInLocation || "Not Recorded"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Out Location</span>
                            <span className="text-[11px] text-slate-600 font-medium leading-tight">
                                {item.checkOutLocation || "Not Recorded"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, type = "default", sub }) {
    const styles = {
        default: "border-slate-200",
        success: "border-emerald-100",
        danger: "border-rose-100",
        info: "border-indigo-100",
    };
    return (
        <div className={`bg-white p-5 rounded-2xl border ${styles[type]} shadow-sm`}>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
                {sub && <span className="text-[10px] text-slate-400 font-medium italic">{sub}</span>}
            </div>
        </div>
    );
}

function StatusBadge({ status, isLate }) {
    const variants = {
        present: "bg-emerald-50 text-emerald-700 border-emerald-100",
        absent: "bg-rose-50 text-rose-700 border-rose-100",
        "half-day": "bg-amber-50 text-amber-700 border-amber-100",
    };
    return (
        <div className="flex flex-col items-center md:items-end gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${variants[status] || "bg-slate-50 text-slate-600"}`}>
                {status}
            </span>
            {isLate && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter">Late Entry</span>}
        </div>
    );
}

function formatTime(time) {
    if (!time) return "--:--";
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}