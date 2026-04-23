// "use client";
// import { useEffect, useState } from "react";
// import {
//     Mail, Phone, MapPin, Briefcase, Landmark,
//     ShieldAlert, LogOut, Calendar, FileText,
//     Clock, Play, Square, Wallet
// } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";

// import LeavePage from "./Leave";
// import History from "./History";
// import Expenses from "./Expenses";
// import Payslip from "./payslip";
// import NoticeAlert from "./NoticeAlert";
// import LottieWelcomeAnimation from "@/Animations/Welcome";

// export default function ProfilePage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const tab = searchParams.get("tab") || "overview";

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [punchLoading, setPunchLoading] = useState(false);
//     const [isPunchedIn, setIsPunchedIn] = useState(false);
//     const [location, setLocation] = useState("");
//     const [activityLog, setActivityLog] = useState([]);
//     const [attendance, setAttendance] = useState(null);

//     // useEffect(() => {
//     //     const fetchProfile = async () => {
//     //         try {
//     //             const token = localStorage.getItem("token");
//     //             if (!token) return;

//     //             const res = await fetch("/api/profile", {
//     //                 headers: {
//     //                     "Authorization": `Bearer ${token}`,
//     //                     "Content-Type": "application/json",
//     //                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//     //                 }
//     //             });
//     //             const result = await res.json();
//     //             if (result.success) setUser(result.data);
//     //         } catch (err) {
//     //             console.error("Profile Fetch Error:", err);
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };
//     //     fetchProfile();
//     // }, []);




//     // Helper: Get GPS Location and Reverse Geocode
//     const fetchProfile = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) return;

//             const res = await fetch("/api/profile", {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                 }
//             });

//             const result = await res.json();

//             if (result.success) {
//                 setUser(result.data);

//                 // ✅ SAVE ATTENDANCE PROPERLY
//                 setAttendance(result.attendance);

//                 setIsPunchedIn(result.attendance?.isPunchedIn || false);
//             }

//         } catch (err) {
//             console.error("Profile Fetch Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {


//         fetchProfile();
//     }, []);

//     const getVerifiedLocation = () => {
//         return new Promise((resolve, reject) => {
//             if (!navigator.geolocation) {
//                 reject("Geolocation not supported by your browser");
//                 return;
//             }

//             navigator.geolocation.getCurrentPosition(
//                 async (pos) => {
//                     try {
//                         const { latitude: lat, longitude: lng } = pos.coords;
//                         const res = await fetch(`/api/get-location?lat=${lat}&lng=${lng}`, {
//                             method: "GET",
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
//                             },
//                         });
//                         const data = await res.json();
//                         const address = data?.address || `Lat: ${lat}, Lng: ${lng}`;
//                         setLocation(address);
//                         resolve(address);
//                     } catch (err) {
//                         reject("Failed to verify location address");
//                     }
//                 },
//                 () => reject("Please enable GPS/Location permissions")
//             );
//         });
//     };

//     // Combined Punch Logic with API and GPS
//     const handlePunch = async () => {
//         setPunchLoading(true);
//         try {
//             const currentAddress = await getVerifiedLocation();
//             const type = isPunchedIn ? "Punch Out" : "Punch In";
//             const endpoint = isPunchedIn ? "/api/attendance/punch-out" : "/api/attendance/punch-in";

//             const res = await fetch(endpoint, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`,
//                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
//                 },
//                 body: JSON.stringify({ location: currentAddress }),
//             });

//             const data = await res.json();

//             if (data.success) {
//                 fetchProfile(); // Refresh profile to get latest attendance
//                 setIsPunchedIn(!isPunchedIn);
//                 // Update local log
//                 setActivityLog((prev) => [
//                     {
//                         type,
//                         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                         address: currentAddress,
//                         setAttendance: data.attendance, // ✅ Update attendance state with latest record
//                     },
//                     ...prev,
//                 ]);
//             } else {
//                 alert(data.message || "Attendance action failed.");
//             }
//         } catch (err) {
//             alert(err);
//         } finally {
//             setPunchLoading(false);
//         }
//     };

//     const handleAction = (type) => {
//         router.push(`/profile?tab=${type}`);
//     };

//     if (loading) return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50">
//             <LottieWelcomeAnimation />
//         </div>
//     );

//     if (!user) return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//             <p className="text-xl font-semibold text-gray-600">Session expired or unauthorized.</p>
//             <button
//                 onClick={() => window.location.href = "/login"}
//                 className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
//             >
//                 Return to Login
//             </button>
//         </div>
//     );

//     return (
//         <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
//             <div className="flex flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl  shadow-sm">
//                 <div className="flex items-center gap-5">
//                     <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-blue-200 shadow-lg">
//                         {user.name?.charAt(0)}
//                     </div>
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
//                         <p className="text-gray-500 text-sm font-medium">
//                             {user.designation || "Staff"} • {user.employeeId || "No ID"}
//                         </p>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
//                     className="p-3 bg-red-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//                     title="Logout"
//                 >
//                     <LogOut size={22} />
//                 </button>
//             </div>

//             <NoticeAlert />
//             {/* 1. TOP BAR / HEADER */}
//             {tab === "overview" || !tab ? (
//                 <>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//                         {/* 2. ATTENDANCE SECTION (The Circle) */}
//                         <div className="bg-white p-8 rounded-3xl  shadow-sm flex flex-col items-center justify-center space-y-6">
//                             {/* <p className="text-xs text-gray-900 p-4 font-bold bg-white rounded-2xl border border-slate-100 text-center">
//                                 {isPunchedIn && attendance?.checkIn
//                                     ? `Punched in at ${new Date(attendance.checkIn).toLocaleTimeString()}`
//                                     : ""}
//                             </p> */}

//                             <div className="text-xs text-gray-700 font-medium space-y-1">
//                                 {attendance?.checkIn && (
//                                     <p>
//                                         🟢 Punch In: {new Date(attendance.checkIn).toLocaleTimeString()}
//                                     </p>
//                                 )}

//                                 {attendance?.checkOut && (
//                                     <p>
//                                         🔴 Punch Out: {new Date(attendance.checkOut).toLocaleTimeString()}
//                                     </p>
//                                 )}

//                                 {!attendance?.checkOut && attendance?.checkIn && (
//                                     <p className="text-green-600 font-bold">
//                                         Currently Working ⏱️
//                                     </p>
//                                 )}
//                             </div>
//                             <div className="text-center">
//                                 <h3 className="font-bold text-gray-800 tracking-tight">Attendance Desk</h3>
//                                 <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1 tracking-widest flex items-center justify-center gap-1">
//                                     <MapPin size={10} /> GPS Verified
//                                 </p>
//                             </div>




//                             {/* Punch Circle */}
//                             <div className="relative group">
//                                 <div className={`absolute -inset-4 rounded-full opacity-20 blur-lg transition-all duration-500 ${isPunchedIn ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
//                                 <button
//                                     onClick={handlePunch}
//                                     disabled={punchLoading}
//                                     className={`relative w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
//                             ${isPunchedIn
//                                             ? 'bg-white border-red-500 text-red-500 hover:bg-red-50'
//                                             : 'bg-white border-green-500 text-green-500 hover:bg-green-50'}`}
//                                 >
//                                     {punchLoading ? (
//                                         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current"></div>
//                                     ) : (
//                                         <>
//                                             {isPunchedIn ? <Square size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
//                                             <span className="mt-2 font-black text-lg uppercase tracking-widest">
//                                                 {isPunchedIn ? "Punch Out" : "Punch In"}
//                                             </span>
//                                         </>
//                                     )}
//                                     <span className="text-[10px] text-gray-400 font-bold mt-1">
//                                         {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </span>
//                                 </button>
//                             </div>

//                             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-center">
//                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Current Location</p>
//                                 <p className="text-xs text-slate-600 font-medium truncate mt-1">
//                                     {location || "Waiting for GPS Signal..."}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* 3. QUICK ACTIONS & STATS */}
//                         <div className="lg:col-span-2 space-y-6">

//                             {/* Action Grid */}
//                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                                 <ActionButton
//                                     icon={<Calendar className="text-blue-500" />}
//                                     label="Apply Leave"
//                                     color="bg-blue-50"
//                                     onClick={() => handleAction('leave')}
//                                 />

//                                 <ActionButton
//                                     icon={<FileText className="text-purple-500" />}
//                                     label="Payslip"
//                                     color="bg-purple-50"
//                                     onClick={() => handleAction('payslip')}
//                                 />

//                                 <ActionButton
//                                     icon={<Clock className="text-orange-500" />}
//                                     label="History"
//                                     color="bg-orange-50"
//                                     onClick={() => handleAction('history')}
//                                 />

//                                 <ActionButton
//                                     icon={<Wallet className="text-emerald-600" />}
//                                     label="Add Expense"
//                                     color="bg-emerald-50"
//                                     onClick={() => handleAction('expenses')}
//                                 />


//                             </div>



//                             {/* User Details & Activity Log */}
//                             <div className="bg-white rounded-3xl  shadow-sm overflow-hidden">
//                                 <div className="p-6 border-b border-b-yellow-200 flex items-center justify-between bg-amber-50">
//                                     <h3 className="font-bold flex items-center gap-2 text-gray-800">
//                                         <Briefcase size={18} className="text-indigo-600" /> Work Profile
//                                     </h3>
//                                 </div>
//                                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
//                                     <DetailRow label="Department" value={user.department?.name || "General"} />
//                                     <DetailRow label="Joining Date" value={user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"} />
//                                     <DetailRow label="Bank Account" value={user.bankDetails?.accountNumber || "Not Linked"} />
//                                     <DetailRow label="Role Status" value={user.status || "Active"} />
//                                 </div>

//                                 {/* Integrated Recent Activity Log */}
//                                 <div className="bg-slate-50/50 p-6 border-t border-slate-200">
//                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</h4>
//                                     <div className="space-y-3">
//                                         {activityLog.length > 0 ? activityLog.map((log, i) => (
//                                             <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className={`w-2 h-2 rounded-full ${log.type === "Punch In" ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
//                                                     <div>
//                                                         <p className="text-xs font-bold text-slate-700">{log.type}</p>
//                                                         <p className="text-[9px] text-slate-400 truncate max-w-[180px]">{log.address}</p>
//                                                     </div>
//                                                 </div>
//                                                 <span className="text-[10px] font-mono font-bold text-slate-500">{log.time}</span>
//                                             </div>
//                                         )) : (
//                                             <p className="text-xs text-slate-400 italic text-center">No punches recorded this session</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Emergency Section */}
//                             <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col sm:flex-row justify-between items-center gap-4">
//                                 <div className="flex items-center gap-4">
//                                     <div className="p-3 bg-white rounded-2xl text-red-600 shadow-sm">
//                                         <ShieldAlert size={24} />
//                                     </div>
//                                     <div>
//                                         <p className="text-red-900 font-bold">Emergency Contact</p>
//                                         <p className="text-red-700 text-sm font-medium">
//                                             {user.emergencyContact?.name || "Not Set"}: {user.emergencyContact?.phone || "N/A"}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <button className="w-full sm:w-auto bg-white text-red-600 px-6 py-2.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-red-600 hover:text-white transition-colors border border-red-200">
//                                     Call Now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                 </>

//             ) : (
//                 <div className="mt-6">
//                     {tab === "leave" && <LeavePage user={user} />}
//                     {tab === "history" && <History user={user} />}
//                     {tab === "expenses" && <Expenses user={user} />}
//                     {tab === "payslip" && <Payslip user={user} />}
//                 </div>
//             )}
//         </div>
//     );
// }

// function ActionButton({ icon, label, color, onClick }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`${color} p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 border border-transparent hover:border-white shadow-sm hover:shadow-md`}
//         >
//             <div className="p-3 bg-white rounded-2xl shadow-sm">
//                 {icon}
//             </div>
//             <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{label}</span>
//         </button>
//     );
// }

// function DetailRow({ label, value }) {
//     return (
//         <div className="space-y-1">
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
//             <p className="font-semibold text-gray-700 truncate">{value || "—"}</p>
//         </div>
//     );
// }











// Added checkout confirmation modal, otherwise code works good 






"use client";
import { useEffect, useState } from "react";
import {
    Mail, Phone, MapPin, Briefcase, Landmark,
    ShieldAlert, LogOut, Calendar, FileText,
    Clock, Play, Square, Wallet
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import LeavePage from "./Leave";
import History from "./History";
import Expenses from "./Expenses";
import Payslip from "./payslip";
import NoticeAlert from "./NoticeAlert";
import LottieWelcomeAnimation from "@/Animations/Welcome";

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tab = searchParams.get("tab") || "overview";

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [punchLoading, setPunchLoading] = useState(false);
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [location, setLocation] = useState("");
    const [activityLog, setActivityLog] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             if (!token) return;

    //             const res = await fetch("/api/profile", {
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                     'x-api-key': process.env.NEXT_PUBLIC_API_KEY
    //                 }
    //             });
    //             const result = await res.json();
    //             if (result.success) setUser(result.data);
    //         } catch (err) {
    //             console.error("Profile Fetch Error:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProfile();
    // }, []);




    // Helper: Get GPS Location and Reverse Geocode
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            const result = await res.json();

            if (result.success) {
                setUser(result.data);

                // ✅ SAVE ATTENDANCE PROPERLY
                setAttendance(result.attendance);

                setIsPunchedIn(result.attendance?.isPunchedIn || false);
            }

        } catch (err) {
            console.error("Profile Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchProfile();
    }, []);

    const getVerifiedLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation not supported by your browser");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        const res = await fetch(`/api/get-location?lat=${lat}&lng=${lng}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
                            },
                        });
                        const data = await res.json();
                        const address = data?.address || `Lat: ${lat}, Lng: ${lng}`;
                        setLocation(address);
                        resolve(address);
                    } catch (err) {
                        reject("Failed to verify location address");
                    }
                },
                () => reject("Please enable GPS/Location permissions")
            );
        });
    };

    // Combined Punch Logic with API and GPS
    const handlePunch = async () => {
        setPunchLoading(true);
        try {
            const currentAddress = await getVerifiedLocation();
            const type = isPunchedIn ? "Punch Out" : "Punch In";
            const endpoint = isPunchedIn ? "/api/attendance/punch-out" : "/api/attendance/punch-in";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                },
                body: JSON.stringify({ location: currentAddress }),
            });

            const data = await res.json();

            if (data.success) {
                fetchProfile(); // Refresh profile to get latest attendance
                setIsPunchedIn(!isPunchedIn);
                // Update local log
                setActivityLog((prev) => [
                    {
                        type,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        address: currentAddress,
                        setAttendance: data.attendance, // ✅ Update attendance state with latest record
                    },
                    ...prev,
                ]);
            } else {
                alert(data.message || "Attendance action failed.");
            }
        } catch (err) {
            alert(err);
        } finally {
            setPunchLoading(false);
        }
    };

    const handleAction = (type) => {
        router.push(`/profile?tab=${type}`);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <LottieWelcomeAnimation />
        </div>
    );

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <p className="text-xl font-semibold text-gray-600">Session expired or unauthorized.</p>
            <button
                onClick={() => window.location.href = "/login"}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
            >
                Return to Login
            </button>
        </div>
    );

    const confirmCheckout = async () => {
        setShowConfirmationModal(false);
        await handlePunch(); // actual punch-out happens here
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl  shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-blue-200 shadow-lg">
                        {user.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500 text-sm font-medium">
                            {user.designation || "Staff"} • {user.employeeId || "No ID"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                    className="p-3 bg-red-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                >
                    <LogOut size={22} />
                </button>
            </div>

            <NoticeAlert />
            {/* 1. TOP BAR / HEADER */}
            {tab === "overview" || !tab ? (
                <>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* 2. ATTENDANCE SECTION (The Circle) */}
                        <div className="bg-white p-8 rounded-3xl  shadow-sm flex flex-col items-center justify-center space-y-6">
                            {/* <p className="text-xs text-gray-900 p-4 font-bold bg-white rounded-2xl border border-slate-100 text-center">
                                {isPunchedIn && attendance?.checkIn
                                    ? `Punched in at ${new Date(attendance.checkIn).toLocaleTimeString()}`
                                    : ""}
                            </p> */}

                            <div className="text-xs text-gray-700 font-medium space-y-1">
                                {attendance?.checkIn && (
                                    <p>
                                        🟢 Punch In: {new Date(attendance.checkIn).toLocaleTimeString()}
                                    </p>
                                )}

                                {attendance?.checkOut && (
                                    <p>
                                        🔴 Punch Out: {new Date(attendance.checkOut).toLocaleTimeString()}
                                    </p>
                                )}

                                {!attendance?.checkOut && attendance?.checkIn && (
                                    <p className="text-green-600 font-bold">
                                        Currently Working ⏱️
                                    </p>
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-800 tracking-tight">Attendance Desk</h3>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1 tracking-widest flex items-center justify-center gap-1">
                                    <MapPin size={10} /> GPS Verified
                                </p>
                            </div>




                            {/* Punch Circle */}
                            <div className="relative group">
                                <div className={`absolute -inset-4 rounded-full opacity-20 blur-lg transition-all duration-500 ${isPunchedIn ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                <button
                                    // onClick={handlePunch}

                                    onClick={() => {
                                        if (isPunchedIn) {
                                            setShowConfirmationModal(true); // open modal before checkout
                                        } else {
                                            handlePunch(); // direct check-in
                                        }
                                    }}
                                    disabled={punchLoading}
                                    className={`relative w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                            ${isPunchedIn
                                            ? 'bg-white border-red-500 text-red-500 hover:bg-red-50'
                                            : 'bg-white border-green-500 text-green-500 hover:bg-green-50'}`}
                                >
                                    {punchLoading ? (
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current"></div>
                                    ) : (
                                        <>
                                            {isPunchedIn ? <Square size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                                            <span className="mt-2 font-black text-lg uppercase tracking-widest">
                                                {isPunchedIn ? "Punch Out" : "Punch In"}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-[10px] text-gray-400 font-bold mt-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </button>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-center">
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Current Location</p>
                                <p className="text-xs text-slate-600 font-medium truncate mt-1">
                                    {location || "Waiting for GPS Signal..."}
                                </p>
                            </div>
                        </div>

                        {/* 3. QUICK ACTIONS & STATS */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Action Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <ActionButton
                                    icon={<Calendar className="text-blue-500" />}
                                    label="Apply Leave"
                                    color="bg-blue-50"
                                    onClick={() => handleAction('leave')}
                                />

                                <ActionButton
                                    icon={<FileText className="text-purple-500" />}
                                    label="Payslip"
                                    color="bg-purple-50"
                                    onClick={() => handleAction('payslip')}
                                />

                                <ActionButton
                                    icon={<Clock className="text-orange-500" />}
                                    label="History"
                                    color="bg-orange-50"
                                    onClick={() => handleAction('history')}
                                />

                                <ActionButton
                                    icon={<Wallet className="text-emerald-600" />}
                                    label="Add Expense"
                                    color="bg-emerald-50"
                                    onClick={() => handleAction('expenses')}
                                />


                            </div>



                            {/* User Details & Activity Log */}
                            <div className="bg-white rounded-3xl  shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-b-yellow-200 flex items-center justify-between bg-amber-50">
                                    <h3 className="font-bold flex items-center gap-2 text-gray-800">
                                        <Briefcase size={18} className="text-indigo-600" /> Work Profile
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    <DetailRow label="Department" value={user.department?.name || "General"} />
                                    <DetailRow label="Joining Date" value={user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"} />
                                    <DetailRow label="Bank Account" value={user.bankDetails?.accountNumber || "Not Linked"} />
                                    <DetailRow label="Role Status" value={user.status || "Active"} />
                                </div>

                                {/* Integrated Recent Activity Log */}
                                <div className="bg-slate-50/50 p-6 border-t border-slate-200">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</h4>
                                    <div className="space-y-3">
                                        {activityLog.length > 0 ? activityLog.map((log, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${log.type === "Punch In" ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">{log.type}</p>
                                                        <p className="text-[9px] text-slate-400 truncate max-w-[180px]">{log.address}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono font-bold text-slate-500">{log.time}</span>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-slate-400 italic text-center">No punches recorded this session</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Section */}
                            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl text-red-600 shadow-sm">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <p className="text-red-900 font-bold">Emergency Contact</p>
                                        <p className="text-red-700 text-sm font-medium">
                                            {user.emergencyContact?.name || "Not Set"}: {user.emergencyContact?.phone || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto bg-white text-red-600 px-6 py-2.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-red-600 hover:text-white transition-colors border border-red-200">
                                    Call Now
                                </button>
                            </div>
                        </div>
                    </div>

                </>

            ) : (
                <div className="mt-6">
                    {tab === "leave" && <LeavePage user={user} />}
                    {tab === "history" && <History user={user} />}
                    {tab === "expenses" && <Expenses user={user} />}
                    {tab === "payslip" && <Payslip user={user} />}
                </div>
            )}



            {showConfirmationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden">
                    {/* Backdrop: Animated fade-in with blur */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setShowConfirmationModal(false)}
                    />

                    {/* Modal: Animated slide-up + scale-in */}
                    <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">



                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Confirm Checkout!
                            </h2>

                            <div className="space-y-3">
                                <p className="text-[15px] text-gray-500 leading-relaxed">
                                    You are about to checkout at:
                                </p>

                                {/* Enhanced Time Badge */}
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50/50 w-fit px-3 py-1.5 rounded-full border border-indigo-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                    <span className="text-sm uppercase tracking-wide">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons: Added haptic-style active states */}
                        <div className="flex flex-col gap-3 mt-10">
                            <button
                                onClick={confirmCheckout}
                                className="w-full py-4 px-4 text-sm font-bold rounded-2xl bg-red-700 text-white hover:bg-red-400 active:scale-[0.96] transition-all shadow-xl shadow-gray-200"
                            >
                                Yes, Punch Out
                            </button>

                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                className="w-full py-3 px-4 text-sm font-semibold rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionButton({ icon, label, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`${color} p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 border border-transparent hover:border-white shadow-sm hover:shadow-md`}
        >
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{label}</span>
        </button>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="font-semibold text-gray-700 truncate">{value || "—"}</p>
        </div>
    );
}