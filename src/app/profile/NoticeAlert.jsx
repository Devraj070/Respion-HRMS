"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

export default function NoticeAlert() {
    const [notice, setNotice] = useState(null);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchLatestNotice = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/notice", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY
                    },
                });

                const data = await res.json();

                if (data.success && data.data.length > 0) {
                    // 🔥 get latest notice
                    setNotice(data.data[0]);
                }
            } catch (err) {
                console.error("Notice fetch error:", err);
            }
        };

        fetchLatestNotice();
    }, []);

    // ❌ nothing to show
    if (!notice || !show) return null;

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start justify-between gap-3 shadow-sm">

            <div className="flex gap-3">
                <div className=" text-yellow-700 p-2 rounded-lg">
                    <Bell size={18} />
                </div>

                <div>
                    <p className="font-semibold text-sm text-gray-800">
                        {notice.title}
                    </p>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notice.message}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(notice.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>
        </div>
    );
}