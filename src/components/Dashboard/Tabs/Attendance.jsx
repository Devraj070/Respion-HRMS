// // "use client";

// // import { useEffect, useState } from "react";
// // import { RefreshCw, Calendar, MapPin, Clock, Filter, Plus } from "lucide-react";

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

// //     const filteredData = date
// //         ? attendance.filter(a => new Date(a.date).toDateString() === new Date(date).toDateString())
// //         : attendance;

// //     const today = new Date().toDateString();
// //     const todayData = attendance.filter(a => new Date(a.date).toDateString() === today);

// //     const stats = {
// //         totalToday: todayData.length,
// //         present: todayData.filter(a => a.status === "present").length,
// //         absent: todayData.filter(a => a.status === "absent").length,
// //         halfDay: todayData.filter(a => a.status === "half-day").length,
// //         late: todayData.filter(a => a.isLate).length,
// //         avgHours: todayData.length > 0
// //             ? (todayData.reduce((acc, cur) => acc + (cur.workingHours || 0), 0) / todayData.length).toFixed(1)
// //             : "0.0",
// //     };



// //     useEffect(() => {
// //         fetchAttendance();
// //     }, []);

// //     return (
// //         <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4">
// //             <div className="max-w-9xl mx-auto">

// //                 {/* --- TOP NAV / HEADER --- */}
// //                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
// //                     <div>
// //                         <h1 className="text-2xl font-bold tracking-tight text-slate-800">Attendance Dashboard</h1>
// //                         <p className="text-sm text-slate-500">Manage and track employee presence</p>
// //                     </div>

// //                     <div className="flex flex-wrap items-center gap-3">
// //                         <div className="relative">
// //                             <input
// //                                 type="date"
// //                                 value={date}
// //                                 onChange={(e) => setDate(e.target.value)}
// //                                 className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
// //                             />
// //                         </div>

// //                         <button
// //                             onClick={() => setDate("")}
// //                             className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
// //                         >
// //                             Reset
// //                         </button>


// //                     </div>
// //                 </div>

// //                 {/* --- STATS OVERVIEW --- */}
// //                 <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
// //                     <StatCard title="Total Staff" value={stats.totalToday} sub="Today" />
// //                     <StatCard title="Present" value={stats.present} type="success" />
// //                     <StatCard title="Absent" value={stats.absent} type="danger" />
// //                     <StatCard title="Half Day" value={stats.halfDay} type="warning" />
// //                     <StatCard title="Late Arrivals" value={stats.late} type="warning" />
// //                     <StatCard title="Avg. Hours" value={`${stats.avgHours}h`} type="info" />
// //                 </div>

// //                 {/* --- TABLE CONTAINER --- */}
// //                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
// //                     <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
// //                         <div className="flex items-center gap-2">
// //                             <span className="font-semibold text-slate-700">Attendance Records</span>
// //                             {date && <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Filtered</span>}
// //                         </div>
// //                         <button
// //                             onClick={fetchAttendance}
// //                             disabled={loading}
// //                             className="p-2 text-slate-400 hover:text-indigo-600 transition duration-200"
// //                         >
// //                             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
// //                         </button>
// //                     </div>

// //                     <div className="overflow-x-auto">
// //                         <table className="w-full text-left border-collapse">
// //                             <thead>
// //                                 <tr className="bg-slate-50/50">
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Employee</th>
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase ">ROLE</th>

// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Check In/Out</th>
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Hours</th>
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Check In Location</th>
// //                                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Check Out Location</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody className="divide-y divide-slate-100">
// //                                 {loading ? (
// //                                     <tr className="animate-pulse">
// //                                         <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Fetching records...</td>
// //                                     </tr>
// //                                 ) : filteredData.length === 0 ? (
// //                                     <tr>
// //                                         <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No records found for this selection.</td>
// //                                     </tr>
// //                                 ) : (
// //                                     filteredData.map((item) => (
// //                                         <tr key={item._id} className="hover:bg-slate-50/50 transition duration-150">
// //                                             <td className="px-6 py-4">
// //                                                 <div className="flex flex-col">
// //                                                     <span className="font-semibold text-slate-700">{item.user?.name || "Anonymous"}</span>
// //                                                     <span className="text-xs text-slate-400">{item.user?.phone || "No phone provided"}</span>
// //                                                 </div>
// //                                             </td>
// //                                             <td className="px-6 py-4">
// //                                                 {item.user?.role || "No role provided"}
// //                                             </td>
// //                                             <td className="px-6 py-4 text-center">
// //                                                 <StatusBadge status={item.status} isLate={item.isLate} />
// //                                             </td>
// //                                             <td className="px-6 py-4">
// //                                                 <div className="flex items-center gap-4 text-xs font-medium">
// //                                                     <div className="flex flex-col">
// //                                                         <span className="text-green-400 uppercase text-lg">In</span>
// //                                                         <span className="text-slate-600">{formatTime(item.checkIn)}</span>
// //                                                     </div>
// //                                                     <div className="flex flex-col">
// //                                                         <span className="text-red-400 uppercase text-lg">Out</span>
// //                                                         <span className="text-slate-600">{formatTime(item.checkOut)}</span>
// //                                                     </div>
// //                                                 </div>
// //                                             </td>
// //                                             <td className="px-6 py-4 text-center">
// //                                                 <span className="text-sm font-semibold text-slate-700">{item.workingHours ?? "0"}h</span>
// //                                             </td>
// //                                             <td className="px-6 py-4">
// //                                                 <div className="flex items-center gap-1.5 text-slate-500">
// //                                                     <MapPin size={14} className="text-slate-300" />
// //                                                     <span className="text-xs">{item.checkInLocation}</span>
// //                                                 </div>
// //                                             </td>
// //                                             <td className="px-6 py-4">
// //                                                 <div className="flex items-center gap-1.5 text-slate-500">
// //                                                     <MapPin size={14} className="text-slate-300" />
// //                                                     <span className="text-xs">{item.checkOutLocation}</span>
// //                                                 </div>
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 )}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // // --- REFINED SUB-COMPONENTS ---

// // function StatCard({ title, value, type = "default", sub }) {
// //     const styles = {
// //         default: "border-slate-200",
// //         success: "border-emerald-100",
// //         danger: "border-rose-100",
// //         warning: "border-amber-100",
// //         info: "border-indigo-100",
// //     };

// //     return (
// //         <div className={`bg-white p-5 rounded-2xl border ${styles[type]} shadow-sm`}>
// //             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
// //             <div className="flex items-baseline gap-2">
// //                 <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
// //                 {sub && <span className="text-[10px] text-slate-400 font-medium italic">{sub}</span>}
// //             </div>
// //         </div>
// //     );
// // }

// // function StatusBadge({ status, isLate }) {
// //     const variants = {
// //         present: "bg-emerald-50 text-emerald-700 border-emerald-100",
// //         absent: "bg-rose-50 text-rose-700 border-rose-100",
// //         "half-day": "bg-amber-50 text-amber-700 border-amber-100",
// //     };

// //     return (
// //         <div className="flex flex-col items-center gap-1">
// //             <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${variants[status] || "bg-slate-50 text-slate-600"}`}>
// //                 {status}
// //             </span>
// //             {isLate && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter">Late Entry</span>}
// //         </div>
// //     );
// // }

// // function formatTime(time) {
// //     if (!time) return "--:--";
// //     return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // }


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

//     // --- GROUPING LOGIC ---
//     const groupDataByDate = (data) => {
//         const groups = {
//             Today: [],
//             Yesterday: [],
//             Earlier: {}
//         };

//         const todayStr = new Date().toDateString();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         const yesterdayStr = yesterday.toDateString();

//         data.forEach(item => {
//             const itemDate = new Date(item.date);
//             const itemDateStr = itemDate.toDateString();

//             // If user selected a specific date via picker, we only show that
//             if (date && itemDateStr !== new Date(date).toDateString()) return;

//             if (itemDateStr === todayStr) {
//                 groups.Today.push(item);
//             } else if (itemDateStr === yesterdayStr) {
//                 groups.Yesterday.push(item);
//             } else {
//                 const formattedDate = itemDate.toLocaleDateString('en-GB'); // dd/mm/yyyy
//                 if (!groups.Earlier[formattedDate]) groups.Earlier[formattedDate] = [];
//                 groups.Earlier[formattedDate].push(item);
//             }
//         });

//         return groups;
//     };

//     const groupedRecords = groupDataByDate(attendance);

//     // Stats calculations (kept for top cards)
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
//         <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-6">
//             <div className="max-w-[1600px] mx-auto">

//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-800">Attendance Log</h1>
//                         <p className="text-sm text-slate-500 italic">Chronological employee activity</p>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <input
//                             type="date"
//                             value={date}
//                             onChange={(e) => setDate(e.target.value)}
//                             className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
//                         />
//                         <button onClick={() => setDate("")} className="text-xs font-medium text-indigo-600 hover:underline">Clear Filter</button>
//                         <button onClick={fetchAttendance} className="p-2 bg-white border rounded-lg hover:bg-slate-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
//                     </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                     <StatCard title="Today's Strength" value={stats.totalToday} />
//                     <StatCard title="Present" value={stats.present} type="success" />
//                     <StatCard title="Absent" value={stats.absent} type="danger" />
//                     <StatCard title="Avg. Shift" value={`${stats.avgHours}h`} type="info" />
//                 </div>

//                 {/* Grouped Table Sections */}
//                 <div className="space-y-8">
//                     {/* Render Today */}
//                     {groupedRecords.Today.length > 0 && (
//                         <TableSection title="Today" dateLabel="Latest Activity" data={groupedRecords.Today} />
//                     )}

//                     {/* Render Yesterday */}
//                     {groupedRecords.Yesterday.length > 0 && (
//                         <TableSection title="Yesterday" dateLabel={new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-GB')} data={groupedRecords.Yesterday} />
//                     )}

//                     {/* Render Earlier Dates */}
//                     {Object.keys(groupedRecords.Earlier).sort((a, b) => b.localeCompare(a)).map(dateKey => (
//                         <TableSection key={dateKey} title={dateKey} data={groupedRecords.Earlier[dateKey]} />
//                     ))}

//                     {attendance.length === 0 && !loading && (
//                         <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-slate-400">
//                             No attendance records found.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // --- SUB-COMPONENTS ---

// function TableSection({ title, data, dateLabel }) {
//     return (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <CalendarDays size={14} className="text-indigo-500" />
//                     <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight">{title}</h2>
//                 </div>
//                 {dateLabel && <span className="text-[10px] text-slate-400 font-medium italic">{dateLabel}</span>}
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                     <thead className="bg-slate-50/30 text-[11px] uppercase text-slate-500 font-bold border-b">
//                         <tr>
//                             <th className="px-6 py-3">Employee</th>
//                             <th className="px-6 py-3">Role</th>
//                             <th className="px-6 py-3 text-center">Status</th>
//                             <th className="px-6 py-3">Punch Times</th>
//                             <th className="px-6 py-3 text-center">Hours</th>
//                             <th className="px-6 py-3">Location (In/Out)</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                         {data.map((item) => (
//                             <tr key={item._id} className="hover:bg-slate-50/50 transition">
//                                 <td className="px-6 py-4">
//                                     <div className="flex flex-col">
//                                         <span className="text-sm font-semibold text-slate-700">{item.user?.name}</span>
//                                         <span className="text-[11px] text-slate-400">{item.user?.phone}</span>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-xs text-slate-500 italic">{item.user?.role}</td>
//                                 <td className="px-6 py-4 text-center">
//                                     <StatusBadge status={item.status} isLate={item.isLate} />
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex gap-3 text-xs">
//                                         <span className="text-emerald-600 font-mono bg-emerald-50 px-1.5 rounded">{formatTime(item.checkIn)}</span>
//                                         <span className="text-rose-600 font-mono bg-rose-50 px-1.5 rounded">{formatTime(item.checkOut)}</span>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-center font-bold text-slate-700 text-sm">{item.workingHours ?? "0"}h</td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex flex-col gap-1 max-w-[180px]">
//                                         <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
//                                             <MapPin size={10} className="text-emerald-400" /> {item.checkInLocation || "N/A"}
//                                         </div>
//                                         <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
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

// function StatCard({ title, value, type = "default" }) {
//     const border = {
//         success: "border-l-emerald-400",
//         danger: "border-l-rose-400",
//         info: "border-l-indigo-400",
//         default: "border-l-slate-300"
//     };
//     return (
//         <div className={`bg-white p-4 rounded-xl border border-slate-200 border-l-4 ${border[type]} shadow-sm`}>
//             <p className="text-[10px] font-bold text-slate-400 uppercase">{title}</p>
//             <h2 className="text-xl font-bold text-slate-800">{value}</h2>
//         </div>
//     );
// }

// function StatusBadge({ status, isLate }) {
//     const colors = {
//         present: "text-emerald-600 bg-emerald-50",
//         absent: "text-rose-600 bg-rose-50",
//         "half-day": "text-amber-600 bg-amber-50"
//     };
//     return (
//         <div className="flex flex-col items-center gap-0.5">
//             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[status]}`}>
//                 {status}
//             </span>
//             {isLate && <span className="text-[8px] text-rose-500 font-black tracking-tighter uppercase italic">Late</span>}
//         </div>
//     );
// }

// function formatTime(time) {
//     if (!time) return "--:--";
//     return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }


"use client";

import { useEffect, useState } from "react";
import { RefreshCw, MapPin, CalendarDays } from "lucide-react";

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

    // --- DATE GROUPING LOGIC ---
    const getGroupedData = () => {
        const groups = { Today: [], Yesterday: [], Earlier: {} };
        const todayStr = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        attendance.forEach(item => {
            const itemDate = new Date(item.date);
            const itemDateStr = itemDate.toDateString();

            // Filter if date picker is used
            if (date && itemDateStr !== new Date(date).toDateString()) return;

            if (itemDateStr === todayStr) {
                groups.Today.push(item);
            } else if (itemDateStr === yesterdayStr) {
                groups.Yesterday.push(item);
            } else {
                const formattedDate = itemDate.toLocaleDateString('en-GB'); // dd/mm/yy
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4">
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
                            className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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

                {/* GROUPED TABLES */}
                <div className="space-y-6">
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

// Helper to keep the table structure consistent
function TableGroup({ title, data, loading, fetchAttendance }) {
    return (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">{title}</span>
                {fetchAttendance && (
                    <button onClick={fetchAttendance} disabled={loading} className="p-2 text-slate-400 hover:text-indigo-600 transition">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-950">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Employee</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Designation</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase">Check In/Out</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Hours</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-50 uppercase text-center">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition duration-150">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700">{item.user?.name || "Anonymous"}</span>
                                        <span className="text-md text-slate-400">{item.user?.phone || "No phone"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{item.user?.designation || "N/A"}</td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={item.status} isLate={item.isLate} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-500 uppercase text-lg font-bold">In</span>
                                            <span className="text-slate-600 text-sm">{formatTime(item.checkIn)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-rose-500 uppercase text-lg font-bold">Out</span>
                                            <span className="text-slate-600 text-sm">{formatTime(item.checkOut)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.workingHours ?? "0"}h</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-md text-slate-500">
                                            <MapPin size={10} className="text-emerald-400" /> {item.checkInLocation || "N/A"}
                                        </div>
                                        <div className="flex items-center gap-1 text-md text-slate-500">
                                            <MapPin size={10} className="text-rose-400" /> {item.checkOutLocation || "N/A"}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        <div className="flex flex-col items-center gap-1">
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