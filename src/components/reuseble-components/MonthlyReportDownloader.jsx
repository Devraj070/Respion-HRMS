// "use client";

// import { useState } from "react";
// import jsPDF from "jspdf";

// export default function MonthlyReportDownloader() {
//     const today = new Date();

//     // Modal Visibility State
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Selection States
//     const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
//     const [year, setYear] = useState(today.getFullYear());
//     const [loading, setLoading] = useState(false);

//     const downloadReport = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(
//                 `/api/attendance/report?month=${month}&year=${year}`,
//                 {
//                     headers: {
//                         "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
//                     },
//                 }
//             );

//             const json = await res.json();
//             if (!json.success || !json.data) {
//                 alert("No data found for the selected period.");
//                 return;
//             }

//             generatePDF(json.data, month, year);
//             setIsModalOpen(false); // Close modal on success
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generatePDF = (data, month, year) => {
//         const doc = new jsPDF();
//         const dates = data.map((i) => new Date(i.date)).filter((d) => !isNaN(d));
//         if (dates.length === 0) return;

//         const startDate = new Date(Math.min(...dates));
//         const endDate = new Date(Math.max(...dates));

//         const employeesMap = new Map();
//         data.forEach((item) => {
//             if (item.user?._id) employeesMap.set(item.user._id, item.user);
//         });

//         const employees = [...employeesMap.values()];

//         doc.setFontSize(16);
//         doc.text("Monthly Attendance Report", 14, 20);
//         doc.setFontSize(11);
//         doc.text(`Selected Month: ${month}-${year}`, 14, 30);
//         doc.text(`Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`, 14, 36);

//         let y = 50;
//         doc.setFontSize(12);
//         doc.text("Employee Summary", 14, y);
//         y += 10;

//         employees.forEach((emp) => {
//             const empData = data.filter((i) => i.user?._id === emp._id);
//             let present = 0, half = 0, workingDays = 0, sundayWorked = 0;

//             for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//                 const date = new Date(d);
//                 const isSunday = date.getDay() === 0;
//                 const record = empData.find(i => new Date(i.date).toDateString() === date.toDateString());

//                 if (!isSunday) workingDays++;
//                 if (record) {
//                     if (record.status === "present") present++;
//                     if (record.status === "half-day") half++;
//                     if (isSunday && record.status === "present") sundayWorked++;
//                 }
//             }

//             const absent = workingDays - present - half;
//             doc.setFontSize(10);
//             doc.text(emp.name || "Unknown", 14, y);
//             y += 6;
//             doc.text(`Present: ${present} | Half: ${half} | Sun: ${sundayWorked} | Absent: ${absent} | Total: ${workingDays}`, 20, y);
//             y += 10;

//             if (y > 270) { doc.addPage(); y = 20; }
//         });

//         doc.save(`attendance-${month}-${year}.pdf`);
//     };

//     return (
//         <>
//             {/* MAIN TRIGGER BUTTON */}
//             <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors"
//             >
//                 Download Monthly Report
//             </button>

//             {/* MODAL OVERLAY */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//                     <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Report Period</h3>

//                         <div className="space-y-4">
//                             {/* MONTH SELECT */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                                 <select
//                                     value={month}
//                                     onChange={(e) => setMonth(e.target.value)}
//                                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 >
//                                     {Array.from({ length: 12 }).map((_, i) => (
//                                         <option key={i} value={String(i + 1).padStart(2, "0")}>
//                                             {new Date(0, i).toLocaleString("default", { month: "long" })}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* YEAR SELECT */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                                 <select
//                                     value={year}
//                                     onChange={(e) => setYear(Number(e.target.value))}
//                                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 >
//                                     {Array.from({ length: 5 }).map((_, i) => {
//                                         const y = today.getFullYear() - i;
//                                         return <option key={y} value={y}>{y}</option>;
//                                     })}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* MODAL ACTIONS */}
//                         <div className="flex gap-3 mt-8">
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={downloadReport}
//                                 disabled={loading}
//                                 className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
//                             >
//                                 {loading ? "Processing..." : "Download PDF"}
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
import { CalendarDays, Download, X, Loader2 } from "lucide-react"; // npm install lucide-react

export default function MonthlyReportDownloader() {
    const today = new Date();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
    const [year, setYear] = useState(today.getFullYear());
    const [loading, setLoading] = useState(false);

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
                alert("No attendance records found for this period.");
                return;
            }

            generatePDF(json.data, month, year);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Download Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // const generatePDF = (data, month, year) => {
    //     const doc = new jsPDF();
    //     const dates = data.map((i) => new Date(i.date)).filter((d) => !isNaN(d));
    //     if (dates.length === 0) return;

    //     const startDate = new Date(Math.min(...dates));
    //     const endDate = new Date(Math.max(...dates));

    //     const employeesMap = new Map();
    //     data.forEach((item) => {
    //         if (item.user?._id) employeesMap.set(item.user._id, item.user);
    //     });

    //     const employees = [...employeesMap.values()];

    //     doc.setFontSize(16);
    //     doc.text("Monthly Attendance Report", 14, 20);
    //     doc.setFontSize(11);
    //     doc.text(`Selected Month: ${month}-${year}`, 14, 30);
    //     doc.text(`Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`, 14, 36);

    //     let y = 50;
    //     doc.setFontSize(12);
    //     doc.text("Employee Summary", 14, y);
    //     y += 10;

    //     employees.forEach((emp) => {
    //         const empData = data.filter((i) => i.user?._id === emp._id);
    //         let present = 0, half = 0, workingDays = 0, sundayWorked = 0;

    //         for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    //             const date = new Date(d);
    //             const isSunday = date.getDay() === 0;
    //             const record = empData.find(i => new Date(i.date).toDateString() === date.toDateString());

    //             if (!isSunday) workingDays++;
    //             if (record) {
    //                 if (record.status === "present") present++;
    //                 if (record.status === "half-day") half++;
    //                 if (isSunday && record.status === "present") sundayWorked++;
    //             }
    //         }

    //         const absent = workingDays - present - half;
    //         doc.setFontSize(10);
    //         doc.text(emp.name || "Unknown", 14, y);
    //         y += 6;
    //         doc.text(`Present: ${present} | Half: ${half} | Sun: ${sundayWorked} | Absent: ${absent} | Total: ${workingDays}`, 20, y);
    //         y += 10;

    //         if (y > 270) { doc.addPage(); y = 20; }
    //     });

    //     doc.save(`attendance-${month}-${year}.pdf`);
    // };

    // const generatePDF = (data, month, year) => {
    //     const doc = new jsPDF();

    //     const dates = data
    //         .map((i) => new Date(i.date))
    //         .filter((d) => !isNaN(d));

    //     if (dates.length === 0) return;

    //     const startDate = new Date(Math.min(...dates));
    //     const endDate = new Date(Math.max(...dates));

    //     const employeesMap = new Map();

    //     data.forEach((item) => {
    //         if (item.user?._id) {
    //             employeesMap.set(item.user._id, item.user);
    //         }
    //     });

    //     const employees = [...employeesMap.values()];

    //     // ================= HEADER =================
    //     doc.setFontSize(16);
    //     doc.text("Monthly Attendance Report", 14, 20);

    //     doc.setFontSize(11);
    //     doc.text(`Selected Month: ${month}-${year}`, 14, 30);

    //     doc.text(
    //         `Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`,
    //         14,
    //         36
    //     );

    //     let y = 50;

    //     doc.setFontSize(12);
    //     doc.text("Employee Summary", 14, y);
    //     y += 10;

    //     // ================= EMPLOYEES =================
    //     employees.forEach((emp) => {
    //         const empData = data.filter(
    //             (i) => i.user?._id === emp._id
    //         );

    //         let present = 0;
    //         let half = 0;
    //         let workingDays = 0;
    //         let sundayWorked = 0;

    //         // ================= DATE LOOP =================
    //         for (
    //             let d = new Date(startDate);
    //             d <= endDate;
    //             d.setDate(d.getDate() + 1)
    //         ) {
    //             const date = new Date(d);
    //             const isSunday = date.getDay() === 0;

    //             const record = empData.find(
    //                 (i) =>
    //                     new Date(i.date).toDateString() ===
    //                     date.toDateString()
    //             );

    //             // count working days (Mon–Sat only)
    //             if (!isSunday) workingDays++;

    //             if (record) {
    //                 if (record.status === "present") {
    //                     present++;

    //                     // Sunday worked counted separately
    //                     if (isSunday) {
    //                         sundayWorked++;
    //                     }
    //                 }

    //                 if (record.status === "half-day") {
    //                     half++;
    //                 }
    //             }
    //         }

    //         // ================= FINAL CALCULATIONS =================
    //         const totalWorked = present + sundayWorked + half;
    //         const absent = workingDays - present - half - sundayWorked;

    //         // ================= OUTPUT =================
    //         // doc.setFontSize(10);

    //         // doc.text(emp.name || "Unknown", 14, y);
    //         // y += 6;

    //         // doc.text(
    //         //     `Present: ${present} | Half: ${half} | Sunday: ${sundayWorked} | Total Worked: ${totalWorked} | Absent: ${absent}`,
    //         //     20,
    //         //     y
    //         // );

    //         // y += 10;

    //         // if (y > 270) {
    //         //     doc.addPage();
    //         //     y = 20;
    //         // }


    //         // ================= TABLE HEADER (only once per page) =================
    //         doc.setFontSize(10);

    //         // Column positions
    //         const xName = 14;
    //         const xPresent = 65;
    //         const xHalf = 85;
    //         const xSunday = 105;
    //         const xTotal = 135;
    //         const xAbsent = 165;

    //         // Header row (only first employee OR first page feel)
    //         if (y === 60 || y === 50) {
    //             doc.setFont(undefined, "bold");

    //             doc.text("Name", xName, y);
    //             doc.text("P", xPresent, y);
    //             doc.text("H", xHalf, y);
    //             doc.text("Sun", xSunday, y);
    //             doc.text("Total", xTotal, y);
    //             doc.text("Abs", xAbsent, y);

    //             doc.setFont(undefined, "normal");
    //             y += 8;

    //             doc.line(14, y - 4, 200, y - 4);
    //         }

    //         // ================= ROW =================
    //         doc.text(emp.name || "Unknown", xName, y);
    //         doc.text(String(present), xPresent, y);
    //         doc.text(String(half), xHalf, y);
    //         doc.text(String(sundayWorked), xSunday, y);
    //         doc.text(String(totalWorked), xTotal, y);
    //         doc.text(String(absent), xAbsent, y);

    //         y += 8;
    //     });



    //     doc.save(`attendance-${month}-${year}.pdf`);
    // };

    const generatePDF = (data, month, year) => {
        const doc = new jsPDF();

        const dates = data
            .map((i) => new Date(i.date))
            .filter((d) => !isNaN(d));

        if (dates.length === 0) return;

        const startDate = new Date(Math.min(...dates));
        const endDate = new Date(Math.max(...dates));

        const employeesMap = new Map();

        data.forEach((item) => {
            if (item.user?._id) {
                employeesMap.set(item.user._id, item.user);
            }
        });

        const employees = [...employeesMap.values()];

        // ================= HEADER =================
        doc.setFontSize(16);
        doc.text("Monthly Attendance Report", 14, 20);

        doc.setFontSize(11);
        doc.text(`Selected Month: ${month}-${year}`, 14, 30);

        doc.text(
            `Report Range: ${startDate.toDateString()} - ${endDate.toDateString()}`,
            14,
            36
        );

        let y = 55;

        // ================= TABLE HEADER =================
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");

        const xName = 14;
        const xP = 70;
        const xH = 90;
        const xSun = 110;
        const xTotal = 135;
        const xAbs = 165;

        doc.text("Name", xName, y);
        doc.text("P", xP, y);
        doc.text("H", xH, y);
        doc.text("Sun", xSun, y);
        doc.text("Worked", xTotal, y);
        doc.text("Abs", xAbs, y);

        doc.setFont(undefined, "normal");
        doc.line(14, y + 2, 200, y + 2);

        y += 10;

        // ================= EMPLOYEES =================
        employees.forEach((emp) => {
            const empData = data.filter(
                (i) => i.user?._id === emp._id
            );

            let present = 0;
            let half = 0;
            let workingDays = 0;
            let sundayWorked = 0;

            // ================= DATE LOOP =================
            for (
                let d = new Date(startDate);
                d <= endDate;
                d.setDate(d.getDate() + 1)
            ) {
                const date = new Date(d);
                const isSunday = date.getDay() === 0;

                const record = empData.find(
                    (i) =>
                        new Date(i.date).toDateString() ===
                        date.toDateString()
                );

                // Mon–Sat working days
                if (!isSunday) workingDays++;

                if (record) {
                    if (record.status === "present") {
                        present++;

                        if (isSunday) {
                            sundayWorked++;
                        }
                    }

                    if (record.status === "half-day") {
                        half++;
                    }
                }
            }

            // ================= SAFE CALCULATION =================
            const totalWorked = present + sundayWorked + half * 0.5;

            let absent = workingDays - present - half * 0.5;
            if (absent < 0) absent = 0; // prevent negative values

            // ================= TABLE ROW =================
            doc.text(emp.name || "Unknown", xName, y);
            doc.text(String(present), xP, y);
            doc.text(String(half), xH, y);
            doc.text(String(sundayWorked), xSun, y);
            doc.text(String(totalWorked.toFixed(1)), xTotal, y);
            doc.text(String(absent.toFixed(1)), xAbs, y);

            y += 8;

            // page break
            if (y > 270) {
                doc.addPage();
                y = 20;

                // redraw header on new page
                doc.setFont(undefined, "bold");
                doc.text("Name", xName, y);
                doc.text("P", xP, y);
                doc.text("H", xH, y);
                doc.text("Sun", xSun, y);
                doc.text("Worked", xTotal, y);
                doc.text("Abs", xAbs, y);
                doc.setFont(undefined, "normal");

                doc.line(14, y + 2, 200, y + 2);

                y += 10;
            }
        });

        doc.save(`attendance-${month}-${year}.pdf`);
    };
    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95"
            >
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span className="font-semibold text-sm">Monthly Report</span>
            </button>

            {/* MODAL SYSTEM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !loading && setIsModalOpen(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-200">

                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Generate Report</h3>
                                    <p className="text-xs text-slate-500">Select the period for the PDF</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="px-6 py-4 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Month Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 ml-1">Month</label>
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <option key={i} value={String(i + 1).padStart(2, "0")}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 ml-1">Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const y = today.getFullYear() - i;
                                            return <option key={y} value={y}>{y}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-6 bg-slate-50/80 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={downloadReport}
                                disabled={loading}
                                className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Preparing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Download PDF</span>
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