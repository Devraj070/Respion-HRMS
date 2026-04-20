// "use client";

// import { useEffect, useState } from "react";

// export default function PWAInstallModal({ onInstalled }) {
//     const [deferredPrompt, setDeferredPrompt] = useState(null);
//     const [show, setShow] = useState(false);
//     const [isIOS, setIsIOS] = useState(false);
//     const [ready, setReady] = useState(false);

//     useEffect(() => {
//         const ua = window.navigator.userAgent.toLowerCase();

//         // 🍎 iOS detection
//         if (/iphone|ipad|ipod/.test(ua)) {
//             setIsIOS(true);
//             setShow(true);
//             setReady(true);
//         }

//         // ✅ already installed check
//         if (window.matchMedia("(display-mode: standalone)").matches) {
//             onInstalled?.(true);
//             setReady(true);
//             return;
//         }

//         // 📲 Chrome/Android install event
//         const handler = (e) => {
//             e.preventDefault();
//             setDeferredPrompt(e);
//             setShow(true);
//             setReady(true);
//         };

//         window.addEventListener("beforeinstallprompt", handler);

//         // 🔥 fallback (important fix)
//         const fallback = setTimeout(() => {
//             setShow(true);
//             setReady(true);
//         }, 2000);

//         // 🎉 installed event
//         const installedHandler = () => {
//             setShow(false);
//             onInstalled?.(true);
//         };

//         window.addEventListener("appinstalled", installedHandler);

//         return () => {
//             window.removeEventListener("beforeinstallprompt", handler);
//             window.removeEventListener("appinstalled", installedHandler);
//             clearTimeout(fallback);
//         };
//     }, []);

//     const handleInstall = async () => {
//         if (!deferredPrompt) {
//             alert("Install not available in this browser. Please use Chrome.");
//             return;
//         }

//         deferredPrompt.prompt();
//         const choice = await deferredPrompt.userChoice;

//         if (choice.outcome === "accepted") {
//             setShow(false);
//             onInstalled?.(true);
//         }
//     };

//     if (!ready || !show) return null;

//     return (
//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-xl text-center w-[320px] shadow-xl">

//                 <h2 className="text-lg font-semibold mb-2">
//                     Install App
//                 </h2>

//                 <p className="text-gray-500 text-sm mb-4">
//                     Install this app for faster access and better experience 🚀
//                 </p>

//                 {/* iOS instruction */}
//                 {isIOS ? (
//                     <div className="text-sm text-gray-600 mb-4">
//                         <p>To install on iPhone:</p>
//                         <p className="font-semibold mt-2">
//                             Tap Share → Add to Home Screen
//                         </p>
//                     </div>
//                 ) : (
//                     <button
//                         onClick={handleInstall}
//                         className="bg-black text-white px-4 py-2 rounded-lg w-full"
//                     >
//                         Install App
//                     </button>
//                 )}

//                 {/* optional skip */}
//                 <button
//                     onClick={() => setShow(false)}
//                     className="mt-3 text-xs text-gray-400 underline"
//                 >
//                     Continue in browser
//                 </button>

//             </div>
//         </div>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, Share2, X } from "lucide-react";

export default function PWAInstallModal({ onInstalled }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const ua = window.navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(ua)) {
            setIsIOS(true);
            setShow(true);
            setReady(true);
        }

        if (window.matchMedia("(display-mode: standalone)").matches) {
            onInstalled?.(true);
            setReady(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShow(true);
            setReady(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        const fallback = setTimeout(() => {
            setShow(true);
            setReady(true);
        }, 2000);

        window.addEventListener("appinstalled", () => {
            setShow(false);
            onInstalled?.(true);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            clearTimeout(fallback);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            alert("Use App Now!");
            return;
        }

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {
            setShow(false);
            onInstalled?.(true);
        }
    };

    if (!ready || !show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in">

                {/* Header */}
                <div className="bg-black text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Smartphone size={18} />
                        <h2 className="text-sm font-semibold">Install App</h2>
                    </div>

                    <button onClick={() => setShow(false)}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <Download size={28} />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold">
                        Install for Better Experience
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Get faster access, offline support & smoother performance 🚀
                    </p>

                    {/* iOS instructions */}
                    {isIOS ? (
                        <div className="mt-5 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Share2 size={16} />
                                <span className="font-medium">iPhone Install Steps</span>
                            </div>
                            Tap <b>Share</b> → <b>Add to Home Screen</b>
                        </div>
                    ) : (
                        <button
                            onClick={handleInstall}
                            className="mt-5 w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                            Install Now
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
        </div>
    );
}