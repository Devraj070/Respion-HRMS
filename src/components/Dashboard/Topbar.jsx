// export default function Topbar({ setSidebarOpen, logout }) {
//     return (
//         <header className="flex items-center justify-between bg-white p-4 shadow lg:hidden">
//             <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-indigo-700 focus:outline-none text-2xl"
//             >
//                 ☰
//             </button>

//             <button
//                 onClick={logout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//             >
//                 Logout
//             </button>
//         </header>
//     );
// }



"use client";

import { Menu, LogOut, ShieldCheck, Bell } from "lucide-react";

export default function Topbar({ setSidebarOpen, logout }) {
    return (
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-30 lg:hidden">

            {/* LEFT: MOBILE MENU TRIGGER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
                    aria-label="Open Sidebar"
                >
                    <Menu size={24} strokeWidth={2.5} />
                </button>

                {/* BRAND LOGO FOR MOBILE */}
                {/* <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">PrimeOwnr</span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">System Console</span>
                </div> */}
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2">

                {/* NOTIFICATION DOT (VISUAL ONLY) */}
                {/* <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="relative">
                        <Bell size={18} />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                    </div>
                </button> */}

                {/* DIVIDER */}
                {/* <div className="w-[1px] h-4 bg-slate-200 mx-1"></div> */}

                {/* LOGOUT BUTTON */}
                <button
                    onClick={logout}
                    className="group flex items-center gap-2 bg-red-600 hover:bg-rose-900 text-white pl-4 pr-3 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-slate-200 active:scale-95"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
                    <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <LogOut size={14} strokeWidth={3} />
                    </div>
                </button>
            </div>
        </header>
    );
}