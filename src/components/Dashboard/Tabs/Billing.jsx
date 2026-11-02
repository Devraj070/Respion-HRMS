"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Clock, Loader2, History, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const monthLabel = (month) =>
    new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const authHeaders = () => ({
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export default function Billing() {
    const [view, setView] = useState("bills");
    const [data, setData] = useState({ bills: [], history: [] });
    const [loading, setLoading] = useState(true);
    const [payingMonth, setPayingMonth] = useState(null);

    const fetchBilling = useCallback(async () => {
        try {
            const res = await fetch("/api/billing", { headers: authHeaders() });
            const json = await res.json();
            if (json.success) setData(json);
            else toast.error(json.message || "Failed to load billing");
        } catch {
            toast.error("Failed to load billing");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBilling();
    }, [fetchBilling]);

    const pay = async (month) => {
        setPayingMonth(month);
        try {
            if (!(await loadRazorpay())) {
                toast.error("Could not load Razorpay. Check your connection.");
                setPayingMonth(null);
                return;
            }

            const res = await fetch("/api/billing/order", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ month }),
            });
            const order = await res.json();
            if (!order.success) {
                toast.error(order.message || "Could not start payment");
                setPayingMonth(null);
                return;
            }

            const rzp = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: "HRMS Monthly Bill",
                description: `Bill for ${monthLabel(month)}`,
                handler: async (response) => {
                    const vRes = await fetch("/api/billing/verify", {
                        method: "POST",
                        headers: authHeaders(),
                        body: JSON.stringify(response),
                    });
                    const v = await vRes.json();
                    if (v.success) {
                        toast.success("Payment successful");
                        await fetchBilling();
                    } else {
                        toast.error(v.message || "Payment verification failed");
                    }
                    setPayingMonth(null);
                },
                modal: { ondismiss: () => setPayingMonth(null) },
                theme: { color: "#2563eb" },
            });
            rzp.on("payment.failed", (r) => {
                toast.error(r.error?.description || "Payment failed");
                setPayingMonth(null);
            });
            rzp.open();
        } catch {
            toast.error("Something went wrong");
            setPayingMonth(null);
        }
    };

    const pending = data.bills.filter((b) => b.status === "pending");

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight">Billing</h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">
                        Monthly software bill, starting {data.billingStart ? monthLabel(data.billingStart) : "this month"}.
                    </p>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "bills", label: "Monthly Bills", icon: CreditCard },
                        { key: "history", label: "Payment History", icon: History },
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setView(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${view === key
                                ? "bg-blue-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : view === "bills" ? (
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                        {pending.length > 0 && (
                            <div className="px-5 py-3 bg-amber-50 text-amber-800 text-sm font-medium rounded-t-2xl">
                                {pending.length} bill{pending.length > 1 ? "s" : ""} pending
                            </div>
                        )}
                        {data.bills.map((b) => (
                            <div key={b.month} className="flex items-center justify-between gap-4 px-5 py-4">
                                <div>
                                    <p className="font-bold">{monthLabel(b.month)}</p>
                                    <p className="text-sm text-slate-500">{inr(b.amount)}</p>
                                </div>
                                {b.status === "paid" ? (
                                    <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                                        <CheckCircle2 size={16} /> Paid
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => pay(b.month)}
                                        disabled={payingMonth !== null}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                    >
                                        {payingMonth === b.month ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Clock size={16} />
                                        )}
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        ))}
                        {data.bills.length === 0 && (
                            <p className="p-8 text-center text-slate-400">No bills yet.</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Month</th>
                                    <th className="px-5 py-3 font-semibold">Amount</th>
                                    <th className="px-5 py-3 font-semibold">Paid On</th>
                                    <th className="px-5 py-3 font-semibold">Payment ID</th>
                                    <th className="px-5 py-3 font-semibold">Paid By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.history.map((p) => (
                                    <tr key={p._id}>
                                        <td className="px-5 py-3 font-semibold">{monthLabel(p.month)}</td>
                                        <td className="px-5 py-3">{inr(p.amount / 100)}</td>
                                        <td className="px-5 py-3">
                                            {p.paidAt ? new Date(p.paidAt).toLocaleString("en-GB") : "-"}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-xs">{p.razorpayPaymentId}</td>
                                        <td className="px-5 py-3">{p.paidBy?.name || "-"}</td>
                                    </tr>
                                ))}
                                {data.history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">
                                            No payments yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
