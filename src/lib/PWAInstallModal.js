"use client";

import { useEffect, useState } from "react";

export default function PWAInstallModal({ onInstalled }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iPhone
        const ua = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            setIsIOS(true);
            setShow(true);
        }

        // Detect already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            onInstalled(true);
            return;
        }

        // Android / Chrome install event
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShow(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        window.addEventListener("appinstalled", () => {
            setShow(false);
            onInstalled(true);
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
            setShow(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center w-[300px] shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Install App</h2>

                {isIOS ? (
                    <p className="text-gray-500 mb-4 text-sm">
                        Tap <b>Share</b> → <b>Add to Home Screen</b>
                    </p>
                ) : (
                    <p className="text-gray-500 mb-4 text-sm">
                        Install this app for better experience 🚀
                    </p>
                )}

                {!isIOS && (
                    <button
                        onClick={handleInstall}
                        className="bg-black text-white px-4 py-2 rounded-lg w-full"
                    >
                        Install
                    </button>
                )}

                <button
                    onClick={() => setShow(false)}
                    className="mt-3 text-xs text-gray-400 underline"
                >
                    Continue in browser
                </button>
            </div>
        </div>
    );
}