"use client";

export default function OverdueMessage() {
    const isOverdue = true; // change this manually or later connect to API

    if (!isOverdue) return null;

    return (
        <div className="w-full px-4 py-4  bg-red-50 text-red-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">

            {/* Left Side */}
            <div className="flex items-start gap-3">
                <span className="text-xl animate-pulse">⚠️</span>

                <div>
                    <p className="font-semibold">
                        Software Renewal Overdue
                    </p>

                    <p className="text-sm text-red-700 mt-1">
                        Your subscription has expired. Please renew immediately to
                        continue using the system without interruption.
                    </p>
                </div>
            </div>


        </div>
    );
}