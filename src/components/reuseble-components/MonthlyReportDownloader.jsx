// // "use client";

// // import { useState } from "react";
// // import jsPDF from "jspdf";

// // export default function MonthlyReportDownloader() {
// //     const today = new Date();

// //     // Modal Visibility State
// //     const [isModalOpen, setIsModalOpen] = useState(false);

// //     // Selection States
// //     const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
// //     const [year, setYear] = useState(today.getFullYear());
// //     const [loading, setLoading] = useState(false);

// //     const downloadReport = async () => {
// //         setLoading(true);
// //         try {
// //             const res = await fetch(
// //                 `/api/attendance/report?month=${month}&year=${year}`,
// //                 {
// //                     headers: {
// //                         "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
// //                     },
// //                 }
// //             );

// //             const json = await res.json();
// //             if (!json.success || !json.data) {
// //                 alert("No data found for the selected period.");
// //                 return;
// //             }

// //             generatePDF(json.data, month, year);
// //             setIsModalOpen(false); // Close modal on success
// //         } catch (err) {
// //             console.error(err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const generatePDF = (data, month, year) => {
// //         const doc = new jsPDF();
// //         const dates = data.map((i) => new Date(i.date)).filter((d) => !isNaN(d));
// //         if (dates.length === 0) return;

// //         const startDate = new Date(Math.min(...dates));
// //         const endDate = new Date(Math.max(...dates));

// //         const employeesMap = new Map();
// //         data.forEach((item) => {
// //             if (item.user?._id) employeesMap.set(item.user._id, item.user);
// //         });

// //         const employees = [...employeesMap.values()];

// //         doc.setFontSize(16);
// //         doc.text("Monthly Attendance Report", 14, 20);
// //         doc.setFontSize(11);
// //         doc.text(`Selected Month: ${month}-${year}`, 14, 30);
// //         doc.text(`Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`, 14, 36);

// //         let y = 50;
// //         doc.setFontSize(12);
// //         doc.text("Employee Summary", 14, y);
// //         y += 10;

// //         employees.forEach((emp) => {
// //             const empData = data.filter((i) => i.user?._id === emp._id);
// //             let present = 0, half = 0, workingDays = 0, sundayWorked = 0;

// //             for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
// //                 const date = new Date(d);
// //                 const isSunday = date.getDay() === 0;
// //                 const record = empData.find(i => new Date(i.date).toDateString() === date.toDateString());

// //                 if (!isSunday) workingDays++;
// //                 if (record) {
// //                     if (record.status === "present") present++;
// //                     if (record.status === "half-day") half++;
// //                     if (isSunday && record.status === "present") sundayWorked++;
// //                 }
// //             }

// //             const absent = workingDays - present - half;
// //             doc.setFontSize(10);
// //             doc.text(emp.name || "Unknown", 14, y);
// //             y += 6;
// //             doc.text(`Present: ${present} | Half: ${half} | Sun: ${sundayWorked} | Absent: ${absent} | Total: ${workingDays}`, 20, y);
// //             y += 10;

// //             if (y > 270) { doc.addPage(); y = 20; }
// //         });

// //         doc.save(`attendance-${month}-${year}.pdf`);
// //     };

// //     return (
// //         <>
// //             {/* MAIN TRIGGER BUTTON */}
// //             <button
// //                 onClick={() => setIsModalOpen(true)}
// //                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors"
// //             >
// //                 Download Monthly Report
// //             </button>

// //             {/* MODAL OVERLAY */}
// //             {isModalOpen && (
// //                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
// //                     <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
// //                         <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Report Period</h3>

// //                         <div className="space-y-4">
// //                             {/* MONTH SELECT */}
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
// //                                 <select
// //                                     value={month}
// //                                     onChange={(e) => setMonth(e.target.value)}
// //                                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
// //                                 >
// //                                     {Array.from({ length: 12 }).map((_, i) => (
// //                                         <option key={i} value={String(i + 1).padStart(2, "0")}>
// //                                             {new Date(0, i).toLocaleString("default", { month: "long" })}
// //                                         </option>
// //                                     ))}
// //                                 </select>
// //                             </div>

// //                             {/* YEAR SELECT */}
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
// //                                 <select
// //                                     value={year}
// //                                     onChange={(e) => setYear(Number(e.target.value))}
// //                                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
// //                                 >
// //                                     {Array.from({ length: 5 }).map((_, i) => {
// //                                         const y = today.getFullYear() - i;
// //                                         return <option key={y} value={y}>{y}</option>;
// //                                     })}
// //                                 </select>
// //                             </div>
// //                         </div>

// //                         {/* MODAL ACTIONS */}
// //                         <div className="flex gap-3 mt-8">
// //                             <button
// //                                 onClick={() => setIsModalOpen(false)}
// //                                 className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
// //                             >
// //                                 Cancel
// //                             </button>
// //                             <button
// //                                 onClick={downloadReport}
// //                                 disabled={loading}
// //                                 className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
// //                             >
// //                                 {loading ? "Processing..." : "Download PDF"}
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </>
// //     );
// // }

// "use client";

// import { useState } from "react";
// import jsPDF from "jspdf";

// export default function MonthlyReportDownloader() {
//     const today = new Date();

//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const [month, setMonth] = useState(
//         String(today.getMonth() + 1).padStart(2, "0")
//     );

//     const [year, setYear] = useState(today.getFullYear());

//     const [loading, setLoading] = useState(false);

//     // ================= FORMAT NUMBER =================
//     const formatNum = (num) => {
//         return Number.isInteger(num)
//             ? String(num)
//             : String(Number(num.toFixed(1)));
//     };

//     // ================= DOWNLOAD REPORT =================
//     const downloadReport = async () => {
//         setLoading(true);

//         try {
//             const res = await fetch(
//                 `/api/attendance/report?month=${month}&year=${year}`,
//                 {
//                     headers: {
//                         "X-API-KEY":
//                             process.env.NEXT_PUBLIC_API_KEY || "",
//                     },
//                 }
//             );

//             const json = await res.json();

//             if (!json.success || !json.data) {
//                 alert("No data found for selected period.");
//                 return;
//             }

//             generatePDF(json.data, month, year);

//             setIsModalOpen(false);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ================= PDF GENERATOR =================
//     const generatePDF = (data, month, year) => {
//         const doc = new jsPDF();

//         // ================= DATE RANGE =================
//         const dates = data
//             .map((i) => new Date(i.date))
//             .filter((d) => !isNaN(d));

//         if (dates.length === 0) return;

//         const startDate = new Date(Math.min(...dates));
//         const endDate = new Date(Math.max(...dates));

//         // ================= EMPLOYEES =================
//         const employeesMap = new Map();

//         data.forEach((item) => {
//             if (item.user?._id) {
//                 employeesMap.set(item.user._id, item.user);
//             }
//         });

//         const employees = [...employeesMap.values()];

//         // ================= HEADER =================
//         doc.setFontSize(16);
//         doc.text("Monthly Attendance Report", 14, 20);

//         doc.setFontSize(11);
//         doc.text(`Selected Month: ${month}-${year}`, 14, 30);

//         doc.text(
//             `Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`,
//             14,
//             36
//         );

//         let y = 55;

//         // ================= TABLE =================
//         const xName = 14;
//         const xP = 75;
//         const xH = 95;
//         const xSun = 115;
//         const xWorked = 145;
//         const xAbs = 175;

//         const drawHeader = () => {
//             doc.setFontSize(10);
//             doc.setFont(undefined, "bold");

//             doc.text("Name", xName, y);
//             doc.text("Present", xP, y);
//             doc.text("Half", xH, y);
//             doc.text("Sunday", xSun, y);
//             doc.text("Total Worked", xWorked, y);
//             doc.text("Absent", xAbs, y);

//             doc.line(14, y + 2, 195, y + 2);

//             doc.setFont(undefined, "normal");

//             y += 10;
//         };

//         drawHeader();

//         // ================= EMPLOYEE LOOP =================
//         employees.forEach((emp) => {
//             const empData = data.filter(
//                 (i) => i.user?._id === emp._id
//             );

//             let present = 0;
//             let half = 0;
//             let sundayWorked = 0;
//             let workingDays = 0;

//             // ================= DATE LOOP =================
//             for (
//                 let d = new Date(startDate);
//                 d <= endDate;
//                 d.setDate(d.getDate() + 1)
//             ) {
//                 const date = new Date(d);

//                 const isSunday =
//                     date.getDay() === 0;

//                 const record = empData.find(
//                     (i) =>
//                         new Date(i.date).toDateString() ===
//                         date.toDateString()
//                 );

//                 // Mon-Sat only
//                 if (!isSunday) {
//                     workingDays++;
//                 }

//                 if (record) {

//                     // ================= SUNDAY =================
//                     if (isSunday) {

//                         if (
//                             record.status === "present"
//                         ) {
//                             sundayWorked++;
//                         }

//                     } else {

//                         // ================= NORMAL DAYS =================
//                         if (
//                             record.status === "present"
//                         ) {
//                             present++;
//                         }

//                         if (
//                             record.status === "half-day"
//                         ) {
//                             half++;
//                         }
//                     }
//                 }
//             }

//             // ================= FINAL CALC =================
//             const totalWorked =
//                 present +
//                 sundayWorked +
//                 half * 0.5;

//             let absent =
//                 workingDays -
//                 present -
//                 half * 0.5;

//             if (absent < 0) absent = 0;

//             // ================= ROW =================
//             doc.text(
//                 emp.name || "Unknown",
//                 xName,
//                 y
//             );

//             doc.text(
//                 formatNum(present),
//                 xP,
//                 y
//             );

//             doc.text(
//                 formatNum(half),
//                 xH,
//                 y
//             );

//             doc.text(
//                 formatNum(sundayWorked),
//                 xSun,
//                 y
//             );

//             doc.text(
//                 formatNum(totalWorked),
//                 xWorked,
//                 y
//             );

//             doc.text(
//                 formatNum(absent),
//                 xAbs,
//                 y
//             );

//             y += 8;

//             // ================= PAGE BREAK =================
//             if (y > 270) {
//                 doc.addPage();

//                 y = 20;

//                 drawHeader();
//             }
//         });

//         // ================= SAVE =================
//         doc.save(`attendance-${month}-${year}.pdf`);
//     };

//     // return (
//     //     <>
//     //         {/* BUTTON */}
//     //         <button
//     //             onClick={() => setIsModalOpen(true)}
//     //             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
//     //         >
//     //             Download Monthly Report
//     //         </button>

//     //         {/* MODAL */}
//     //         {isModalOpen && (
//     //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//     //                 <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

//     //                     <h3 className="text-xl font-semibold mb-4">
//     //                         Select Report Period
//     //                     </h3>

//     //                     {/* MONTH */}
//     //                     <div className="mb-4">
//     //                         <label className="block text-sm mb-1">
//     //                             Month
//     //                         </label>

//     //                         <select
//     //                             value={month}
//     //                             onChange={(e) =>
//     //                                 setMonth(e.target.value)
//     //                             }
//     //                             className="w-full border p-2 rounded"
//     //                         >
//     //                             {Array.from({
//     //                                 length: 12,
//     //                             }).map((_, i) => (
//     //                                 <option
//     //                                     key={i}
//     //                                     value={String(
//     //                                         i + 1
//     //                                     ).padStart(2, "0")}
//     //                                 >
//     //                                     {new Date(
//     //                                         0,
//     //                                         i
//     //                                     ).toLocaleString(
//     //                                         "default",
//     //                                         {
//     //                                             month: "long",
//     //                                         }
//     //                                     )}
//     //                                 </option>
//     //                             ))}
//     //                         </select>
//     //                     </div>

//     //                     {/* YEAR */}
//     //                     <div className="mb-6">
//     //                         <label className="block text-sm mb-1">
//     //                             Year
//     //                         </label>

//     //                         <select
//     //                             value={year}
//     //                             onChange={(e) =>
//     //                                 setYear(
//     //                                     Number(
//     //                                         e.target.value
//     //                                     )
//     //                                 )
//     //                             }
//     //                             className="w-full border p-2 rounded"
//     //                         >
//     //                             {Array.from({
//     //                                 length: 5,
//     //                             }).map((_, i) => {
//     //                                 const y =
//     //                                     today.getFullYear() -
//     //                                     i;

//     //                                 return (
//     //                                     <option
//     //                                         key={y}
//     //                                         value={y}
//     //                                     >
//     //                                         {y}
//     //                                     </option>
//     //                                 );
//     //                             })}
//     //                         </select>
//     //                     </div>

//     //                     {/* ACTIONS */}
//     //                     <div className="flex gap-3">
//     //                         <button
//     //                             onClick={() =>
//     //                                 setIsModalOpen(false)
//     //                             }
//     //                             className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
//     //                         >
//     //                             Cancel
//     //                         </button>

//     //                         <button
//     //                             onClick={downloadReport}
//     //                             disabled={loading}
//     //                             className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
//     //                         >
//     //                             {loading
//     //                                 ? "Processing..."
//     //                                 : "Download PDF"}
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         )}
//     //     </>
//     // );

//     return (
//         <>
//             <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="group relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
//             >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//                 <span className="font-medium">Monthly Report</span>
//             </button>

//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
//                     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
//                         <div className="p-8">
//                             <h3 className="text-2xl font-bold text-slate-800 mb-2">Export Data</h3>
//                             <p className="text-slate-500 text-sm mb-6">Choose the period for your attendance report.</p>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Month</label>
//                                     <select
//                                         value={month}
//                                         onChange={(e) => setMonth(e.target.value)}
//                                         className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                                     >
//                                         {Array.from({ length: 12 }).map((_, i) => (
//                                             <option key={i} value={String(i + 1).padStart(2, "0")}>
//                                                 {new Date(0, i).toLocaleString("default", { month: "long" })}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Year</label>
//                                     <select
//                                         value={year}
//                                         onChange={(e) => setYear(Number(e.target.value))}
//                                         className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                                     >
//                                         {[0, 1, 2, 3].map((i) => {
//                                             const y = today.getFullYear() - i;
//                                             return <option key={y} value={y}>{y}</option>;
//                                         })}
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex bg-slate-50 p-4 gap-3">
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="flex-1 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 onClick={downloadReport}
//                                 disabled={loading}
//                                 className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center"
//                             >
//                                 {loading ? (
//                                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
//                                 ) : "Generate PDF"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }



"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import {
    CalendarDays,
    Download,
    X,
    Loader2,
    ChevronDown,
    FileText
} from "lucide-react";

export default function MonthlyReportDownloader() {
    const today = new Date();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
    const [year, setYear] = useState(today.getFullYear());
    const [loading, setLoading] = useState(false);

    const formatNum = (num) => {
        return Number.isInteger(num) ? String(num) : String(Number(num.toFixed(1)));
    };

    const downloadReport = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/attendance/report?month=${month}&year=${year}`,
                {
                    headers: {
                        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
                    },
                }
            );
            const json = await res.json();
            if (!json.success || !json.data) {
                alert("No data found for selected period.");
                return;
            }
            generatePDF(json.data, month, year);
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = (data, month, year) => {
        const doc = new jsPDF();
        const dates = data.map((i) => new Date(i.date)).filter((d) => !isNaN(d));
        if (dates.length === 0) return;

        const startDate = new Date(Math.min(...dates));
        const endDate = new Date(Math.max(...dates));
        const employeesMap = new Map();

        data.forEach((item) => {
            if (item.user?._id) employeesMap.set(item.user._id, item.user);
        });

        const employees = [...employeesMap.values()];

        // PDF Styling & Generation logic remains same as your original script
        doc.setFontSize(16);
        doc.text("Monthly Attendance Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Selected Month: ${month}-${year}`, 14, 30);
        doc.text(`Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`, 14, 36);

        let y = 55;
        const xPositions = { name: 14, p: 75, h: 95, sun: 115, total: 145, abs: 175 };

        const drawHeader = () => {
            doc.setFontSize(10);
            doc.setFont(undefined, "bold");
            doc.text("Name", xPositions.name, y);
            doc.text("Present", xPositions.p, y);
            doc.text("Halfday", xPositions.h, y);
            doc.text("Sunday", xPositions.sun, y);
            doc.text("Worked", xPositions.total, y);
            doc.text("Absent", xPositions.abs, y);
            doc.line(14, y + 2, 195, y + 2);
            doc.setFont(undefined, "normal");
            y += 10;
        };

        drawHeader();

        employees.forEach((emp) => {
            const empData = data.filter((i) => i.user?._id === emp._id);
            let present = 0, half = 0, sundayWorked = 0, workingDays = 0;

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const date = new Date(d);
                const isSunday = date.getDay() === 0;
                const record = empData.find(i => new Date(i.date).toDateString() === date.toDateString());

                if (!isSunday) workingDays++;
                if (record) {
                    if (isSunday) {
                        if (record.status === "present") sundayWorked++;
                    } else {
                        if (record.status === "present") present++;
                        if (record.status === "half-day") half++;
                    }
                }
            }

            const totalWorked = present + sundayWorked + (half * 0.5);
            let absent = Math.max(0, workingDays - present - (half * 0.5));

            doc.text(emp.name || "Unknown", xPositions.name, y);
            doc.text(formatNum(present), xPositions.p, y);
            doc.text(formatNum(half), xPositions.h, y);
            doc.text(formatNum(sundayWorked), xPositions.sun, y);
            doc.text(formatNum(totalWorked), xPositions.total, y);
            doc.text(formatNum(absent), xPositions.abs, y);

            y += 8;
            if (y > 270) { doc.addPage(); y = 20; drawHeader(); }
        });

        doc.save(`attendance-${month}-${year}.pdf`);
    };

    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-400 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-950 transition flex justify-center items-center gap-2 text-white"
            >
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors animate-pulse">
                    <Download className="w-4 h-4 " />
                </div>
                <span className="font-semibold text-sm tracking-wide">Monthly Report</span>
            </button>

            {/* MODAL OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
                        {/* HEADER */}
                        <div className="flex items-center justify-between p-6 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-50 p-2 rounded-lg">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Export Report</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-500 text-sm mb-6">Select the month and year to generate the attendance summary.</p>

                            <div className="space-y-5">
                                {/* MONTH SELECT */}
                                <div className="relative">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Period Month</label>
                                    <div className="relative">
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                                        >
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <option key={i} value={String(i + 1).padStart(2, "0")}>
                                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* YEAR SELECT */}
                                <div className="relative">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Period Year</label>
                                    <div className="relative">
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                                        >
                                            {[0, 1, 2, 3].map((i) => {
                                                const y = today.getFullYear() - i;
                                                return <option key={y} value={y}>{y}</option>;
                                            })}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="flex bg-slate-50/80 p-4 gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={downloadReport}
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm disabled:opacity-70 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" />
                                        <span>Generate PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}