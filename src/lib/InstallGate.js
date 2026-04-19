"use client";

import { useEffect, useState } from "react";

export default function InstallGate({ children }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setInstalled(true);
            setReady(true);
            return;
        }

        // Listen for install prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setReady(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // After install
        window.addEventListener("appinstalled", () => {
            setInstalled(true);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {
            setInstalled(true);
        }
    };

    // ⏳ Wait until we know install state
    if (!ready) {
        return null;
    }

    // 🔒 Block app until installed
    if (!installed) {
        return (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl text-center w-[320px] shadow-xl">
                    <h2 className="text-lg font-semibold mb-2">
                        Install Required
                    </h2>

                    <p className="text-gray-500 text-sm mb-4">
                        Please install this app to continue
                    </p>

                    <button
                        onClick={handleInstall}
                        className="bg-black text-white px-4 py-2 rounded-lg w-full"
                    >
                        Install App
                    </button>
                </div>
            </div>
        );
    }

    // ✅ After install → show app
    return children;
}