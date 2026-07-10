import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, totalItems, limit, onPageChange }) {
    if (totalPages <= 1) return null;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, page - 2);
            let end = Math.min(totalPages, page + 2);
            if (start === 1) {
                end = 5;
            } else if (end === totalPages) {
                start = totalPages - 4;
            }
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-slate-100 rounded-b-3xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Showing <span className="font-bold text-slate-700">{startItem}</span> to{" "}
                <span className="font-bold text-slate-700">{endItem}</span> of{" "}
                <span className="font-bold text-slate-700">{totalItems}</span> entries
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    type="button"
                    className="p-2 border border-slate-100 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600 disabled:hover:bg-white cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        type="button"
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            pageNum === page
                                ? "bg-slate-900 text-white shadow-md shadow-black/10 scale-105"
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    type="button"
                    className="p-2 border border-slate-100 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 transition-all text-slate-600 disabled:hover:bg-white cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
