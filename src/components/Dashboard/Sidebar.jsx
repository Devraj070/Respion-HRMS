// "use client";

// import React, { useState } from "react";
// import {
//     Home,
//     Users,
//     LogOut,
//     X,
//     Handshake,
//     Cpu,
//     ChevronLeft,
//     ChevronRight,
//     CalendarCheck,
//     Building2,
//     Wallet
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function Sidebar({
//     sidebarOpen,
//     setSidebarOpen,
//     currentTab,
//     setCurrentTab,
//     logout,
//     user,
// }) {
//     const [collapsed, setCollapsed] = useState(false);
//     const router = useRouter();

//     const navItems = [
//         { key: "dashboard", label: "Dashboard", icon: Home },
//         { key: "attendance", label: "Attendance", icon: CalendarCheck },
//         { key: "employees", label: "Employees", icon: Users },
//         { key: "departments", label: "Departments", icon: Building2 },
//         { key: "payroll", label: "Payroll", icon: Wallet },
//     ];

//     return (
//         <>
//             {/* Overlay */}
//             <div
//                 className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${sidebarOpen ? "block" : "hidden"
//                     }`}
//                 onClick={() => setSidebarOpen(false)}
//             />

//             {/* Sidebar */}
//             <aside
//                 className={`fixed z-50 inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 flex flex-col
//         ${collapsed ? "w-20" : "w-64"}
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0 lg:static`}
//             >
//                 {/* Header */}
//                 <div className="h-16 flex items-center justify-between px-3">
//                     <div className="flex items-center gap-3 overflow-hidden">
//                         {/* <img
//                             src={user?.photo || "/default-avatar.webp"}
//                             alt="avatar"
//                             className="w-10 h-10 rounded-full object-cover"
//                         /> */}

//                         {!collapsed && (
//                             <div>
//                                 <h1 className="text-lg font-semibold text-gray-900">
//                                     Dashboard
//                                 </h1>
//                                 <p className="text-xs text-gray-500">{user?.name}</p>
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-1">
//                         {/* Collapse Button */}
//                         <button
//                             onClick={() => setCollapsed(!collapsed)}
//                             className="p-1.5 rounded-md hover:bg-gray-200"
//                         >
//                             {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//                         </button>

//                         {/* Mobile Close */}
//                         <button
//                             onClick={() => setSidebarOpen(false)}
//                             className="lg:hidden p-1.5 rounded-md hover:bg-gray-200"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Menu */}
//                 <nav className="flex-1 px-2 py-4 space-y-1">
//                     {navItems.map(({ key, label, icon: Icon }) => {
//                         const active = currentTab === key;

//                         return (
//                             <button
//                                 key={key}
//                                 // onClick={() => {
//                                 //     setCurrentTab(key);
//                                 //     setSidebarOpen(false);
//                                 // }}
//                                 onClick={() => {
//                                     router.push(`/?tab=${key}`);
//                                     setSidebarOpen(false);
//                                 }}
//                                 title={collapsed ? label : ""}
//                                 className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[18px] font-medium transition cursor-pointer
//                 ${active
//                                         ? "bg-blue-100 text-blue-700"
//                                         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                                     }`}
//                             >
//                                 <Icon
//                                     size={18}
//                                     className={active ? "text-blue-600" : "text-gray-400"}
//                                 />

//                                 {!collapsed && <span>{label}</span>}
//                             </button>
//                         );
//                     })}
//                 </nav>

//                 {/* Footer */}
//                 <div className="p-3">
//                     <button
//                         onClick={logout}
//                         title={collapsed ? "Sign Out" : ""}
//                         className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
//                     >
//                         <LogOut size={18} />
//                         {!collapsed && <span>Sign Out</span>}
//                     </button>

//                     {!collapsed && (
//                         <p className="text-xs text-gray-400 text-center mt-3">
//                             Version 2.1.0
//                         </p>
//                     )}
//                 </div>
//             </aside>
//         </>
//     );
// }

"use client";

import React, { useState, useEffect } from "react";
import {
    Home,
    Users,
    LogOut,
    X,
    ChevronLeft,
    ChevronRight,
    CalendarCheck,
    Building2,
    Wallet,
    BarChart3,
    Settings,
    TimerOff,
    TimerIcon,
    IndianRupee,
    BellIcon,
    Book,
    Coins
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    currentTab,
    setCurrentTab,
    logout,
    user,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        logo: "",
    });
    const [fetching, setFetching] = useState(true);
    const router = useRouter();



    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await fetch("/api/company",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "no_key" // Ensure
                        }
                    }
                );
                const data = await res.json();

                if (data?._id) {
                    setCompanyId(data._id);
                    setForm({
                        name: data.name || "",
                        description: data.description || "",
                        logo: data.logo || "",
                    });
                }
            } catch (err) {
                console.error("Error fetching company:", err);
            } finally {
                setFetching(false);
            }
        };

        fetchCompany();
    }, []);

    const navItems = [
        { key: "dashboard", label: "Dashboard", icon: Home },
        { key: "attendance", label: "Attendance", icon: CalendarCheck },
        { key: "employees", label: "Employees", icon: Users },
        { key: "documents", label: "Documents", icon: Book },
        { key: "departments", label: "Departments", icon: Building2 },
        { key: "payroll", label: "Payroll", icon: Wallet },
        { key: "analytics", label: "Analytics", icon: BarChart3 },
        { key: "leave", label: "Leave Requests", icon: TimerIcon },
        { key: "expense", label: "Expenses", icon: Coins },
        { key: "notices", label: "Notices", icon: BellIcon },
        { key: "advances", label: "Advances", icon: IndianRupee }

    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${sidebarOpen ? "block" : "hidden"
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed z-50 inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 flex flex-col
                ${collapsed ? "w-25" : "w-64"}
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static`}
            >
                {/* Header with Logo */}
                <div className="h-16 flex items-center justify-between px-3 border-b border-gray-300">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Logo */}
                        <Image
                            src={form?.logo || "/logo.png"}
                            alt="Company Logo"
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                        />

                        {!collapsed && (
                            <div>
                                <h1 className="text-sm font-semibold text-gray-900">
                                    {form.name || "Company Name"}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    {user?.name || "Admin Panel"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Collapse */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1.5 rounded-md cursor-pointer bg-gray-200"
                        >
                            {collapsed ? (
                                <ChevronRight size={18} />
                            ) : (
                                <ChevronLeft size={18} />
                            )}
                        </button>

                        {/* Mobile Close */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-md hover:bg-gray-200"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map(({ key, label, icon: Icon }) => {
                        const active = currentTab === key;

                        return (
                            <button
                                key={key}
                                onClick={() => {
                                    router.push(`/?tab=${key}`);
                                    setSidebarOpen(false);
                                }}
                                title={collapsed ? label : ""}
                                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[15px] font-medium transition cursor-pointer
                                ${active
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={
                                        active
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                    }
                                />
                                {!collapsed && <span>{label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-3 border-t border-gray-300 space-y-1">
                    {/* Settings */}
                    <button
                        onClick={() => {
                            router.push(`/?tab=settings`);
                            setSidebarOpen(false);
                        }}
                        title={collapsed ? "Settings" : ""}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                        <Settings size={20} />
                        {!collapsed && <span className="text-[15px]">Settings</span>}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        title={collapsed ? "Sign Out" : ""}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="text-[15px]">Sign Out</span>}
                    </button>

                    {!collapsed && (
                        <p className="text-xs text-gray-400 text-center mt-3">
                            Version 2.1.0
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
}