
"use client";

import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import {
    FileSpreadsheet, FileText, Search,
    Calendar as CalendarIcon, Users, ArrowUpRight,
    ArrowDownLeft, ChevronRight, Download
} from "lucide-react";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState({ userId: "", startDate: "", endDate: "" });

    const currentEmployeeName = useMemo(() => {
        if (!filters.userId) return "All Employees";
        return employees.find(e => e._id === filters.userId)?.name || "All Employees";
    }, [filters.userId, employees]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await fetch("/api/employees", { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY } });
            const data = await res.json();
            if (data.success) setEmployees(data.data);
        };
        fetchEmployees();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setHasSearched(true);
        const query = new URLSearchParams(filters);
        const res = await fetch(`/api/download-report?${query.toString()}`, {
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
        });
        const data = await res.json();
        if (data.success) setHistory(data.data);
        setLoading(false);
    };

    // 📊 Excel Export Logic
    const exportExcel = () => {
        const data = history.map((i) => ({
            "Employee": i.userName || currentEmployeeName,
            "Type": i.type,
            "Amount": i.amount,
            "Category/Purpose": i.category || i.purpose,
            "Status": i.status,
            "Date": new Date(i.date).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Financial_Report");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), `${currentEmployeeName}_Report.xlsx`);
    };

    // 📄 PDF Export Logic (Custom Layout)
    const exportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text("Financial Report", 14, 20);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Entity: ${currentEmployeeName}`, 14, 28);
        doc.text(`Period: ${filters.startDate || 'Start'} to ${filters.endDate || 'End'}`, 14, 33);

        doc.line(14, 38, pageWidth - 14, 38);

        let y = 45;
        doc.setFont(undefined, 'bold');
        doc.text("Date", 14, y);
        doc.text("Type", 45, y);
        doc.text("Description", 75, y);
        doc.text("Amount (INR)", 170, y);

        doc.line(14, 48, pageWidth - 14, 48);
        doc.setFont(undefined, 'normal');

        history.forEach(item => {
            y += 10;
            if (y > 280) { doc.addPage(); y = 20; }
            doc.text(new Date(item.date).toLocaleDateString(), 14, y);
            doc.text(String(item.type), 45, y);
            doc.text(String(item.category || item.purpose).substring(0, 35), 75, y);
            doc.text(String(item.amount), 170, y);
        });

        doc.save(`${currentEmployeeName}_Report.pdf`);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Expenses & Advances Reports</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-wider">{currentEmployeeName}</p>
                    </div>

                    {history.length > 0 && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={exportExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-slate-100 transition-all shadow-sm uppercase tracking-widest">
                                <FileSpreadsheet size={16} className="text-emerald-600" /> Excel
                            </button>
                            <button onClick={exportPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-slate-100 transition-all shadow-sm uppercase tracking-widest">
                                <FileText size={16} className="text-rose-600" /> PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employee</label>
                            <select
                                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 p-2.5 rounded-xl outline-none font-bold text-slate-700 text-sm"
                            >
                                <option value="">All Employees</option>
                                {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">From</label>
                            <input type="date" onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 p-2 rounded-xl outline-none font-bold text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">To</label>
                            <input type="date" onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 p-2 rounded-xl outline-none font-bold text-sm" />
                        </div>
                        <div className="flex items-end">
                            <button onClick={fetchHistory} className="w-full bg-black text-white py-2.5 rounded-xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 uppercase tracking-widest text-xs">
                                <Search size={16} /> Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* List Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
                    {loading ? (
                        <div className="py-24 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
                            <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Processing Request</p>
                        </div>
                    ) : !hasSearched ? (
                        <div className="py-24 text-center flex flex-col items-center justify-center bg-slate-50/30">
                            <Download className="text-slate-200 mb-4" size={48} strokeWidth={1} />
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Select filters to generate report</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="py-24 text-center font-black text-slate-300 uppercase text-xs">No records matched</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 md:p-5 flex justify-between items-center hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl hidden sm:block ${item.type === 'EXPENSE' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {item.type === 'EXPENSE' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 tracking-tighter leading-none mb-1">₹{item.amount.toLocaleString('en-IN')}</p>
                                            <p className="text-slate-600 text-xs font-bold line-clamp-1">{item.category || item.purpose}</p>
                                            <p className="text-[10px] text-slate-300 font-black uppercase mt-1 tracking-tighter">
                                                {new Date(item.date).toLocaleDateString('en-IN')} • {item.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            item.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {item.status}
                                        </span>
                                        <ChevronRight size={16} className="text-slate-200 hidden md:block" />
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