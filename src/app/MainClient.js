"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
// Tabs
import Dashboard from "@/components/Dashboard/Tabs/Dashboard";
import toast from "react-hot-toast";
import Attendance from "@/components/Dashboard/Tabs/Attendance";
import Expense from "@/components/Dashboard/Tabs/Expense";
import Department from "@/components/Dashboard/Tabs/Department";
import Payroll from "@/components/Dashboard/Tabs/Payroll";

import { useSearchParams } from "next/navigation";
import Leave from "@/components/Dashboard/Tabs/Leave";
import EmployeesPage from "@/components/Dashboard/Tabs/Employee";
import LottieWelcomeAnimation from "@/Animations/Welcome";
import Notices from "@/components/Dashboard/Tabs/Notices";
import Documents from "@/components/Dashboard/Tabs/Documents";
import Settings from "@/components/Dashboard/Tabs/Setting";
import Analytics from "@/components/Dashboard/Tabs/Analytics";
import AdvancePage from "@/components/Dashboard/Tabs/Advances";
import DownloadReport from "@/components/Dashboard/Tabs/DownloadReport";


export default function AdminPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [currentTab, setCurrentTab] = useState("dashboard");
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "dashboard";
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(false);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const res = await fetch("/api/auth/verify-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });

                const data = await res.json();

                if (!data.success) {
                    localStorage.removeItem("token");
                    router.replace("/login");
                    return;
                }

                const role = data.user.role;
                setUser(data.user);

                // 🔥 ROLE BASED REDIRECT
                if (role === "admin") {
                    router.replace("/");
                } else if (role === "employee") {
                    router.replace("/profile");
                } else {
                    localStorage.removeItem("token");
                    router.replace("/login");
                }

            } catch (err) {
                // console.log("Token verify error:", err);
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {

        localStorage.removeItem("token");
        window.location.reload()
        toast.success("logged out!")


    };


    const renderContent = () => {
        switch (currentTab) {
            case "dashboard":
                return <Dashboard />;
            case "attendance":
                return <Attendance />;
            case "employees":
                return <EmployeesPage />;
            case "documents":
                return <Documents />;
            case "expense":
                return <Expense />;
            case "departments":
                return <Department />;
            case "payroll":
                return <Payroll />;
            case "analytics":
                return <Analytics />;
            case "leave":
                return <Leave />;
            case "settings":
                return <Settings />;
            case "notices":
                return <Notices />;
            case "advances":
                return <AdvancePage />;
            case "download":
                return <DownloadReport />;

            default:
                return null;
        }
    };

    if (loading || showAnimation) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <LottieWelcomeAnimation />
            </div>
        );
    }




    return (
        user && user?.role === "admin" && (
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentTab={currentTab}
                    // setCurrentTab={setCurrentTab}
                    logout={handleLogout}
                    user={user}
                />

                {/* Main content */}
                <main className="flex-1 flex flex-col ">

                    <Topbar
                        setSidebarOpen={setSidebarOpen}
                        logout={handleLogout}

                    />
                    <div className="max-h-screen overflow-y-auto">{renderContent()}</div>
                </main>
            </div>
        )
    );

}
