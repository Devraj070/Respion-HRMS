"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "announcement_v2";

export default function BottomAnnouncement({
    title = "📢 Important Update",
    message = "We've launched new features. Check them out now!",
}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) setShow(true);
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <>
            {/* Background Overlay */}
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" />

            {/* Bottom Modal */}
            <div className="fixed bottom-4 left-4 right-4 z-50 animate-slideUp sm:left-auto sm:right-6 sm:w-[420px]">
                <div className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            {title}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            {message}
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            {/* <button
                                onClick={handleClose}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
                            >
                                Later
                            </button> */}

                            <button
                                onClick={handleClose}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}