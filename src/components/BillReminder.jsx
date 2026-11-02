"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { currentMonth } from "@/lib/billingClient";

// Skippable bottom sheet shown on app open when this month's bill is unpaid
export default function BillReminder() {
    const router = useRouter();
    const [info, setInfo] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/billing", {
                    headers: {
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (!data.success) return;

                const pending = data.bills.filter((b) => b.status === "pending");
                const thisMonthUnpaid = pending.some((b) => b.month === currentMonth());
                if (!thisMonthUnpaid) return;

                setInfo({
                    count: pending.length,
                    total: pending.reduce((sum, b) => sum + b.amount, 0),
                    since: data.billingStart,
                });
                // let the sheet mount first so the slide-up transition runs
                setTimeout(() => setVisible(true), 50);
            } catch {
                // reminder is best-effort
            }
        };
        load();
    }, []);

    if (!info) return null;

    const close = () => {
        setVisible(false);
        setTimeout(() => setInfo(null), 300);
    };

    const since = new Date(`${info.since}-01T00:00:00`).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
            onClick={close}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-6 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Monthly bill pending</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            This month&apos;s software bill hasn&apos;t been paid.
                        </p>
                    </div>
                    <button onClick={close} className="p-1.5 rounded-md hover:bg-slate-100 cursor-pointer" aria-label="Skip">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 rounded-xl bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                    <span className="font-bold">{info.count}</span> unpaid bill{info.count > 1 ? "s" : ""} since {since}
                    {" · "}
                    <span className="font-bold">₹{info.total.toLocaleString("en-IN")}</span> due
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                        onClick={close}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => {
                            close();
                            router.push("/?tab=billing");
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
}
