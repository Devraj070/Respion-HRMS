// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import jsPDF from "jspdf";
// // // import html2canvas from "html2canvas";

// // // import {
// // //     Download,
// // //     Loader2,
// // //     CheckCircle2,
// // //     Clock,
// // //     FileText,
// // //     Wallet
// // // } from "lucide-react";

// // // export default function Payroll({ user }) {
// // //     const [payrolls, setPayrolls] = useState([]);
// // //     const [loading, setLoading] = useState(true);

// // //     useEffect(() => {
// // //         const fetchPayroll = async () => {
// // //             try {
// // //                 const token = localStorage.getItem("token");

// // //                 const res = await fetch(`/api/payroll/${user._id}`, {
// // //                     headers: {
// // //                         Authorization: `Bearer ${token}`,
// // //                         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// // //                     },
// // //                 });

// // //                 const data = await res.json();

// // //                 if (data.success) {
// // //                     const payrollData = Array.isArray(data.data)
// // //                         ? data.data
// // //                         : [data.data];

// // //                     setPayrolls(payrollData);
// // //                 }
// // //             } catch (err) {
// // //                 console.log(err);
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         };

// // //         if (user?._id) fetchPayroll();
// // //     }, [user?._id]);

// // //     // 📄 PDF DOWNLOAD
// // //     const handleDownloadPayslip = async (payroll) => {
// // //         try {
// // //             const element = document.getElementById(`payslip-${payroll._id}`);

// // //             if (!element) {
// // //                 alert("Payslip not ready");
// // //                 return;
// // //             }

// // //             // 🔥 wait for fonts/images
// // //             await document.fonts.ready;

// // //             const canvas = await html2canvas(element, {
// // //                 scale: 2,
// // //                 useCORS: true,
// // //                 backgroundColor: "#ffffff",
// // //             });

// // //             const imgData = canvas.toDataURL("image/png");

// // //             const pdf = new jsPDF("p", "mm", "a4");

// // //             const pdfWidth = pdf.internal.pageSize.getWidth();
// // //             const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

// // //             pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

// // //             pdf.save(`payslip-${payroll.month}-${payroll.year}.pdf`);

// // //         } catch (err) {
// // //             console.error("PDF Error:", err);
// // //             alert("Failed to generate PDF. Try again.");
// // //         }
// // //     };
// // //     if (loading) {
// // //         return (
// // //             <div className="flex items-center justify-center h-64">
// // //                 <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
// // //             </div>
// // //         );
// // //     }

// // //     if (!payrolls.length) {
// // //         return (
// // //             <div className="text-center p-12 border border-dashed rounded-2xl">
// // //                 <FileText className="w-10 h-10 mx-auto text-gray-300 mb-3" />
// // //                 <p className="text-gray-500">No payroll records found</p>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <div className="space-y-6 max-w-5xl mx-auto p-4">

// // //             {/* HEADER */}
// // //             <div className="flex justify-between items-center">
// // //                 <div>
// // //                     <h1 className="text-2xl font-bold">Payroll</h1>
// // //                     <p className="text-sm text-gray-500">
// // //                         Download monthly salary slips
// // //                     </p>
// // //                 </div>

// // //                 <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-2">
// // //                     <Wallet className="w-4 h-4 text-indigo-600" />
// // //                     <span className="text-indigo-700 font-semibold">
// // //                         {payrolls.length} Records
// // //                     </span>
// // //                 </div>
// // //             </div>

// // //             {/* PAYROLL LIST */}
// // //             <div className="space-y-6">
// // //                 {payrolls.map((payroll) => (
// // //                     <div key={payroll._id} className="space-y-4">

// // //                         {/* 🧾 PAYSLIP CARD (FOR PDF) */}
// // //                         <div
// // //                             id={`payslip-${payroll._id}`}
// // //                             className="bg-white border rounded-xl p-6"
// // //                         >

// // //                             {/* COMPANY HEADER */}
// // //                             <div className="text-center border-b pb-4 mb-4">
// // //                                 <h1 className="text-2xl font-bold text-slate-900">
// // //                                     Respion Healthcare Pvt Ltd
// // //                                 </h1>
// // //                                 <p className="text-xs text-slate-500">
// // //                                     Salary Slip / Payslip
// // //                                 </p>
// // //                             </div>

// // //                             {/* EMPLOYEE INFO */}
// // //                             <div className="grid grid-cols-2 text-sm mb-4">
// // //                                 <div>
// // //                                     <p><b>Employee ID:</b> {payroll.user?.employeeId}</p>
// // //                                     <p><b>Name:</b> {payroll.user?.name}</p>
// // //                                 </div>

// // //                                 <div className="text-right">
// // //                                     <p><b>Month:</b> {payroll.month}/{payroll.year}</p>
// // //                                     <p>
// // //                                         <b>Status:</b>{" "}
// // //                                         {payroll.isPaid ? "Paid" : "Pending"}
// // //                                     </p>
// // //                                 </div>
// // //                             </div>

// // //                             {/* SALARY TABLE */}
// // //                             <table className="w-full text-sm border">
// // //                                 <tbody>
// // //                                     <tr>
// // //                                         <td className="p-2 border">Basic Salary</td>
// // //                                         <td className="p-2 border text-right">
// // //                                             ₹{payroll.basicSalary}
// // //                                         </td>
// // //                                     </tr>

// // //                                     <tr>
// // //                                         <td className="p-2 border">Allowances</td>
// // //                                         <td className="p-2 border text-right text-green-600">
// // //                                             +₹{payroll.allowances}
// // //                                         </td>
// // //                                     </tr>

// // //                                     <tr>
// // //                                         <td className="p-2 border">Deductions</td>
// // //                                         <td className="p-2 border text-right text-red-500">
// // //                                             -₹{payroll.deductions}
// // //                                         </td>
// // //                                     </tr>

// // //                                     <tr className="font-bold bg-gray-50">
// // //                                         <td className="p-2 border">Net Salary</td>
// // //                                         <td className="p-2 border text-right text-indigo-600">
// // //                                             ₹{payroll.netSalary}
// // //                                         </td>
// // //                                     </tr>
// // //                                 </tbody>
// // //                             </table>

// // //                             {/* FOOTER */}
// // //                             <div className="mt-6 text-xs text-center text-gray-400">
// // //                                 This is a system generated payslip. No signature required.
// // //                             </div>
// // //                         </div>

// // //                         {/* ACTION BUTTON */}
// // //                         <div className="flex justify-end">
// // //                             <button
// // //                                 onClick={() => handleDownloadPayslip(payroll)}
// // //                                 className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
// // //                             >
// // //                                 <Download className="w-4 h-4" />
// // //                                 Download Payslip
// // //                             </button>
// // //                         </div>

// // //                     </div>
// // //                 ))}
// // //             </div>
// // //         </div>
// // //     );
// // // }
// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import {
// //     Download,
// //     Loader2,
// //     FileText,
// //     Wallet,
// //     CheckCircle2,
// //     Building2,
// //     Calendar
// // } from "lucide-react";

// // export default function Payroll({ user }) {
// //     const [payrolls, setPayrolls] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [downloading, setDownloading] = useState(null); // Track which ID is downloading

// //     const payslipRefs = useRef({});

// //     useEffect(() => {
// //         const fetchPayroll = async () => {
// //             try {
// //                 const token = localStorage.getItem("token");
// //                 const res = await fetch(`/api/payroll/${user?._id}`, {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                     },
// //                 });

// //                 const data = await res.json();
// //                 if (data.success) {
// //                     setPayrolls(Array.isArray(data.data) ? data.data : [data.data]);
// //                 }
// //             } catch (err) {
// //                 console.error("Fetch error:", err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         if (user?._id) fetchPayroll();
// //     }, [user?._id]);

// //     const handleDownloadPayslip = async (payroll) => {
// //         setDownloading(payroll._id);
// //         try {
// //             const element = payslipRefs.current[payroll._id];
// //             if (!element) throw new Error("Element not found");

// //             // 1. Dynamic Imports
// //             const html2canvas = (await import("html2canvas")).default;
// //             const jsPDF = (await import("jspdf")).default;

// //             // 2. Wait for fonts & rendering stability
// //             await document.fonts.ready;

// //             // 3. Capture Canvas with High DPI
// //             const canvas = await html2canvas(element, {
// //                 scale: 3, // High resolution for clear text
// //                 useCORS: true,
// //                 logging: false,
// //                 backgroundColor: "#ffffff",
// //                 windowWidth: 800, // Forces consistent layout regardless of screen size
// //             });

// //             const imgData = canvas.toDataURL("image/png", 1.0);
// //             const pdf = new jsPDF("p", "mm", "a4");

// //             // 4. Calculate Dimensions
// //             const imgProps = pdf.getImageProperties(imgData);
// //             const pdfWidth = pdf.internal.pageSize.getWidth();
// //             const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

// //             pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
// //             pdf.save(`Payslip_${payroll.month}_${payroll.year}_${user.name.replace(/\s+/g, '_')}.pdf`);

// //         } catch (err) {
// //             console.error("PDF generation failed:", err);
// //             alert("Error generating PDF. Please try again.");
// //         } finally {
// //             setDownloading(null);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex flex-col items-center justify-center h-96">
// //                 <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
// //                 <p className="mt-4 text-slate-500 font-medium">Loading records...</p>
// //             </div>
// //         );
// //     }

// //     if (!payrolls.length) {
// //         return (
// //             <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 max-w-5xl mx-auto">
// //                 <FileText className="w-16 h-16 mx-auto text-slate-200 mb-4" />
// //                 <h3 className="text-xl font-bold text-slate-800">No records found</h3>
// //                 <p className="text-slate-500">Your payroll history will appear here once processed.</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="max-w-5xl mx-auto p-6 space-y-10">
// //             {/* COMPACT HEADER */}
// //             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
// //                 <div>
// //                     <h1 className="text-3xl font-black tracking-tight text-slate-900">Earnings & Records</h1>
// //                     <p className="text-slate-500 font-medium">Access and archive your official monthly payslips.</p>
// //                 </div>
// //                 <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm px-6 py-3 rounded-2xl">
// //                     <div className="p-2 bg-green-50 rounded-lg">
// //                         <Wallet className="w-5 h-5 text-green-600" />
// //                     </div>
// //                     <div>
// //                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Entries</p>
// //                         <p className="text-lg font-bold leading-none">{payrolls.length} Months</p>
// //                     </div>
// //                 </div>
// //             </header>

// //             <div className="grid gap-8">
// //                 {payrolls.map((payroll) => (
// //                     <div key={payroll._id} className="group">
// //                         <div className="flex items-center justify-between mb-4 px-2">
// //                             <h2 className="text-lg font-bold flex items-center gap-2">
// //                                 <Calendar className="w-5 h-5 text-slate-400" />
// //                                 {new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
// //                             </h2>
// //                             <button
// //                                 disabled={downloading === payroll._id}
// //                                 onClick={() => handleDownloadPayslip(payroll)}
// //                                 className="flex items-center gap-2 bg-black hover:bg-slate-800 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10"
// //                             >
// //                                 {downloading === payroll._id ? (
// //                                     <Loader2 className="w-4 h-4 animate-spin" />
// //                                 ) : (
// //                                     <Download className="w-4 h-4" />
// //                                 )}
// //                                 {downloading === payroll._id ? "Generating..." : "Download PDF"}
// //                             </button>
// //                         </div>

// //                         {/* 🧾 PAYSLIP UI (Optimized for Canvas Capture) */}
// //                         <div
// //                             ref={(el) => (payslipRefs.current[payroll._id] = el)}
// //                             className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm"
// //                             style={{ width: "100%", maxWidth: "800px" }}
// //                         >
// //                             {/* Header Section */}
// //                             <div className="bg-slate-50 border-b border-slate-100 p-8 flex justify-between items-start">
// //                                 <div className="space-y-1">
// //                                     <div className="flex items-center gap-2 text-slate-900 font-black text-xl">
// //                                         <Building2 className="w-6 h-6 text-blue-600" />
// //                                         Respion Healthcare Pvt Ltd
// //                                     </div>
// //                                     <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Official Earnings Statement</p>
// //                                 </div>
// //                                 <div className="text-right">
// //                                     <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
// //                                         Processed
// //                                     </span>
// //                                 </div>
// //                             </div>

// //                             {/* Info Grid */}
// //                             <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-50">
// //                                 <div>
// //                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Employee Name</p>
// //                                     <p className="font-bold text-slate-800">{payroll.user?.name}</p>
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff ID</p>
// //                                     <p className="font-bold text-slate-800">#{payroll.user?.employeeId || "N/A"}</p>
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pay Period</p>
// //                                     <p className="font-bold text-slate-800">{payroll.month}/{payroll.year}</p>
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
// //                                     <p className="font-bold text-green-600 flex items-center gap-1">
// //                                         <CheckCircle2 size={14} /> Paid
// //                                     </p>
// //                                 </div>
// //                             </div>

// //                             {/* Calculation Table */}
// //                             <div className="p-8">
// //                                 <div className="rounded-2xl border border-slate-100 overflow-hidden">
// //                                     <table className="w-full text-sm">
// //                                         <thead>
// //                                             <tr className="bg-slate-50 text-slate-400 text-left">
// //                                                 <th className="p-4 font-black uppercase tracking-widest text-[10px]">Description</th>
// //                                                 <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Amount (INR)</th>
// //                                             </tr>
// //                                         </thead>
// //                                         <tbody className="divide-y divide-slate-50">
// //                                             <tr>
// //                                                 <td className="p-4 text-slate-600 font-medium">Basic Component</td>
// //                                                 <td className="p-4 text-right font-bold text-slate-800">₹{payroll.basicSalary.toLocaleString()}</td>
// //                                             </tr>
// //                                             <tr>
// //                                                 <td className="p-4 text-slate-600 font-medium">Performance Allowances</td>
// //                                                 <td className="p-4 text-right font-bold text-green-600">+₹{payroll.allowances.toLocaleString()}</td>
// //                                             </tr>
// //                                             <tr>
// //                                                 <td className="p-4 text-slate-600 font-medium">Standard Deductions (TDS/PF)</td>
// //                                                 <td className="p-4 text-right font-bold text-red-500">-₹{payroll.deductions.toLocaleString()}</td>
// //                                             </tr>
// //                                             <tr className="bg-slate-900 text-white">
// //                                                 <td className="p-5 font-bold">Net Payable Amount</td>
// //                                                 <td className="p-5 text-right font-black text-xl underline decoration-blue-500 underline-offset-4">
// //                                                     ₹{payroll.netSalary.toLocaleString()}
// //                                                 </td>
// //                                             </tr>
// //                                         </tbody>
// //                                     </table>
// //                                 </div>
// //                             </div>

// //                             <footer className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
// //                                 <p className="text-[10px] text-slate-400 font-medium">
// //                                     System ID: {payroll._id.slice(-8).toUpperCase()} • Generated on {new Date().toLocaleDateString()}
// //                                 </p>
// //                                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
// //                                     Digital Record • No Signature Required
// //                                 </p>
// //                             </footer>
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import {
//     Download,
//     Loader2,
//     FileText,
//     Wallet,
//     CheckCircle2,
//     Building2,
//     Calendar,
//     ArrowRight
// } from "lucide-react";
// import jsPDF from "jspdf";

// export default function Payroll({ user }) {
//     const [payrolls, setPayrolls] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [downloadingId, setDownloadingId] = useState(null);

//     useEffect(() => {
//         const fetchPayroll = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await fetch(`/api/payroll/${user?._id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                     },
//                 });
//                 const data = await res.json();
//                 if (data.success) {
//                     const payrollData = Array.isArray(data.data) ? data.data : [data.data];
//                     setPayrolls(payrollData.sort((a, b) => b.year - a.year || b.month - a.month));
//                 }
//             } catch (err) {
//                 console.error("Payroll Fetch Error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user?._id) fetchPayroll();
//     }, [user?._id]);

//     const generatePDF = (payroll) => {
//         setDownloadingId(payroll._id);
//         const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
//         const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString('en-US', { month: 'long' });

//         // Header
//         doc.setFillColor(30, 41, 59);
//         doc.rect(0, 0, 210, 15, "F");
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(20);
//         doc.setTextColor(30, 41, 59);
//         doc.text("RESPION HEALTHCARE", 15, 30);
//         doc.setFontSize(9);
//         doc.setFont("helvetica", "normal");
//         doc.text("SALARY SLIP / PAYSLIP", 15, 36);

//         // Grid Lines
//         doc.setDrawColor(240);
//         doc.line(15, 42, 195, 42);

//         // Employee Info (Strictly from data)
//         doc.setFontSize(8);
//         doc.setTextColor(150);
//         doc.text("EMPLOYEE", 15, 50);
//         doc.text("MONTH/YEAR", 120, 50);

//         doc.setFontSize(10);
//         doc.setTextColor(0);
//         doc.setFont("helvetica", "bold");
//         doc.text(user?.name?.toUpperCase() || "N/A", 15, 55);
//         doc.text(`${monthName} ${payroll.year}`, 120, 55);

//         // Calculations
//         let currentY = 75;
//         doc.setFontSize(10);
//         doc.text("DESCRIPTION", 20, currentY);
//         doc.text("AMOUNT (INR)", 190, currentY, { align: "right" });
//         doc.line(15, currentY + 2, 195, currentY + 2);

//         const rows = [
//             { label: "Basic Salary", val: payroll.basicSalary },
//             { label: "Allowances", val: payroll.allowances, prefix: "+" },
//             { label: "Deductions", val: payroll.deductions, prefix: "-" },
//         ];

//         currentY += 10;
//         doc.setFont("helvetica", "normal");
//         rows.forEach(row => {
//             doc.text(row.label, 20, currentY);
//             doc.text(`${row.prefix || ""} ${row.val.toLocaleString()}`, 190, currentY, { align: "right" });
//             currentY += 10;
//         });

//         // Net Amount
//         currentY += 5;
//         doc.setFillColor(245);
//         doc.rect(15, currentY, 180, 15, "F");
//         doc.setFont("helvetica", "bold");
//         doc.text("NET SALARY", 22, currentY + 9);
//         doc.text(`INR ${payroll.netSalary.toLocaleString()}`, 188, currentY + 9, { align: "right" });

//         doc.setFontSize(8);
//         doc.setTextColor(180);
//         doc.text("System generated payslip. No signature required.", 105, 280, { align: "center" });

//         doc.save(`Payslip_${monthName}_${payroll.year}.pdf`);
//         setDownloadingId(null);
//     };

//     if (loading) return (
//         <div className="flex flex-col h-64 items-center justify-center gap-3">
//             <Loader2 className="animate-spin text-slate-900" />
//             <span className="text-xs font-bold text-slate-400">LOADING PAYROLL</span>
//         </div>
//     );

//     return (
//         <div className="max-w-6xl mx-auto p-6 space-y-8">
//             {/* COMPACT SUMMARY HEADER */}
//             <div className="flex flex-col md:flex-row justify-between items-end border-b pb-8 border-slate-100 gap-6">
//                 <div>
//                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payroll</h1>
//                     <p className="text-slate-500 font-medium mt-1">View and download your salary statements.</p>
//                 </div>

//                 {payrolls.length > 0 && (
//                     <div className="flex gap-4">
//                         <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Payout</p>
//                             <p className="text-xl font-black text-slate-800">₹{payrolls[0].netSalary.toLocaleString()}</p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className="grid lg:grid-cols-12 gap-8">
//                 {/* PROFILE SIDEBAR */}
//                 <div className="lg:col-span-4">
//                     <div className="bg-white border border-slate-200 p-8 rounded-[32px] space-y-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
//                                 <Building2 size={24} />
//                             </div>
//                             <h3 className="font-bold text-lg leading-tight">Respion Healthcare</h3>
//                         </div>

//                         <div>
//                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</label>
//                             <p className="font-bold text-slate-800 uppercase">{user?.name || "N/A"}</p>
//                         </div>

//                         {user?.employeeId && (
//                             <div>
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff ID</label>
//                                 <p className="font-bold text-slate-800">#{user.employeeId}</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* RECORDS LIST */}
//                 <div className="lg:col-span-8 space-y-4">
//                     {payrolls.map((p) => (
//                         <div key={p._id} className="bg-white border border-slate-100 p-6 rounded-3xl hover:border-slate-300 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
//                             <div className="flex items-center gap-6">
//                                 <div className="text-center min-w-[60px]">
//                                     <p className="text-[10px] font-black text-slate-400 uppercase leading-none">
//                                         {new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' })}
//                                     </p>
//                                     <p className="text-xl font-black text-slate-900">{p.year}</p>
//                                 </div>
//                                 <div className="h-10 w-[1px] bg-slate-100 hidden sm:block" />
//                                 <div>
//                                     <h4 className="font-bold text-slate-800">Monthly Salary Slip</h4>
//                                     <p className="text-sm font-medium text-slate-400">Net Payable: ₹{p.netSalary.toLocaleString()}</p>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={() => generatePDF(p)}
//                                 disabled={downloadingId === p._id}
//                                 className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
//                             >
//                                 {downloadingId === p._id ? (
//                                     <Loader2 className="animate-spin w-4 h-4" />
//                                 ) : (
//                                     <Download className="w-4 h-4" />
//                                 )}
//                                 {downloadingId === p._id ? "Processing..." : "Download"}
//                             </button>
//                         </div>
//                     ))}

//                     {payrolls.length === 0 && (
//                         <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//                             <FileText className="mx-auto text-slate-300 mb-2" />
//                             <p className="text-slate-500 font-medium">No payroll records found for this account.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    Download,
    Loader2,
    FileText,
    Wallet,
    Building2,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import jsPDF from "jspdf";

export default function Payroll({ user }) {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/payroll/${user?._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    const payrollData = Array.isArray(data.data) ? data.data : [data.data];
                    setPayrolls(payrollData.sort((a, b) => b.year - a.year || b.month - a.month));
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) fetchPayroll();
    }, [user?._id]);

    const generatePDF = (payroll) => {
        setDownloadingId(payroll._id);
        const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
        const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString('en-US', { month: 'long' });

        // --- PDF STYLING ---
        const margin = 15;
        const pageWidth = 210;
        const tableWidth = pageWidth - (margin * 2);

        // 1. Branding Header
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, 210, 12, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(30, 41, 59);
        doc.text("RESPION HEALTHCARE PVT LTD", margin, 25);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Salary Statement / Digital Payslip", margin, 31);
        doc.text(`Ref ID: ${payroll._id.toUpperCase()}`, pageWidth - margin, 31, { align: "right" });

        // 2. Employee Info Table Grid
        let infoY = 40;
        doc.setDrawColor(200);
        doc.setLineWidth(0.1);
        doc.rect(margin, infoY, tableWidth, 20); // Border for info box
        doc.line(pageWidth / 2, infoY, pageWidth / 2, infoY + 20); // Vertical middle line

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("EMPLOYEE NAME", margin + 5, infoY + 7);
        doc.text("PAY PERIOD", (pageWidth / 2) + 5, infoY + 7);

        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text(user?.name?.toUpperCase() || "N/A", margin + 5, infoY + 14);
        doc.text(`${monthName} ${payroll.year}`, (pageWidth / 2) + 5, infoY + 14);

        // 3. MAIN SALARY TABLE
        let tableY = 70;
        const rowHeight = 12;

        // Table Header
        doc.setFillColor(245, 247, 250);
        doc.rect(margin, tableY, tableWidth, rowHeight, "F");
        doc.setDrawColor(180);
        doc.rect(margin, tableY, tableWidth, rowHeight, "S");

        doc.setFontSize(9);
        doc.setTextColor(50);
        doc.text("EARNINGS & DEDUCTIONS DESCRIPTION", margin + 5, tableY + 8);
        doc.text("AMOUNT (INR)", pageWidth - margin - 5, tableY + 8, { align: "right" });

        // Table Rows
        const dataRows = [
            { label: "Basic Monthly Salary", value: payroll.basicSalary, type: "neutral" },
            { label: "Performance & Special Allowances", value: payroll.allowances, type: "plus" },
            { label: "Statutory Deductions", value: payroll.deductions, type: "minus" }
        ];

        dataRows.forEach((row, i) => {
            const y = tableY + rowHeight + (i * rowHeight);
            doc.setDrawColor(230);
            doc.rect(margin, y, tableWidth, rowHeight, "S");

            doc.setFont("helvetica", "normal");
            doc.setTextColor(80);
            doc.text(row.label, margin + 5, y + 7);

            // Set color based on type
            if (row.type === "plus") doc.setTextColor(34, 197, 94);
            else if (row.type === "minus") doc.setTextColor(220, 38, 38);
            else doc.setTextColor(0);

            const prefix = row.type === "plus" ? "+ " : row.type === "minus" ? "- " : "";
            doc.text(`${prefix}${row.value.toLocaleString()}`, pageWidth - margin - 5, y + 7, { align: "right" });
        });

        // 4. Net Total Row (Highlight)
        const totalY = tableY + rowHeight + (dataRows.length * rowHeight);
        doc.setFillColor(30, 41, 59);
        doc.rect(margin, totalY, tableWidth, 15, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255);
        doc.text("NET PAYABLE AMOUNT", margin + 5, totalY + 9);
        doc.setFontSize(13);
        doc.text(`INR ${payroll.netSalary.toLocaleString()}`, pageWidth - margin - 5, totalY + 9, { align: "right" });

        // 5. Footer
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.text("This is a computer-generated document and does not require a physical signature.", pageWidth / 2, 280, { align: "center" });

        doc.save(`Payslip_${monthName}_${payroll.year}.pdf`);
        setDownloadingId(null);
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-slate-800" size={32} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Payroll</h1>
                    <p className="text-slate-500 font-medium">Manage and audit your official monthly earnings.</p>
                </div>
                {payrolls.length > 0 && (
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-[24px] shadow-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest Net</p>
                        <p className="text-2xl font-black">₹{payrolls[0].netSalary.toLocaleString()}</p>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] sticky top-8">
                        <Building2 className="text-slate-900 mb-6" size={32} />
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</label>
                                <p className="font-bold text-slate-900">{user?.name || "N/A"}</p>
                            </div>
                            {user?.employeeId && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff ID</label>
                                    <p className="font-bold text-slate-900">#{user.employeeId}</p>
                                </div>
                            )}
                            <div className="pt-4">
                                <span className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                    <ShieldCheck size={12} className="text-green-500" /> Verified Record
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-8 space-y-4">
                    {payrolls.map((p) => (
                        <div key={p._id} className="bg-white border border-slate-100 p-6 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-lg transition-shadow group">
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">
                                        {new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-lg font-black text-slate-900 leading-none">{p.year}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Standard Remuneration</h4>
                                    <p className="text-sm text-slate-400 font-medium tracking-tight">Net Disbursed: ₹{p.netSalary.toLocaleString()}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => generatePDF(p)}
                                disabled={downloadingId === p._id}
                                className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {downloadingId === p._id ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {downloadingId === p._id ? "Generating..." : "Download"}
                            </button>
                        </div>
                    ))}

                    {payrolls.length === 0 && (
                        <div className="text-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}