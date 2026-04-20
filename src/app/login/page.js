
// // "use client";

// // import { useState } from "react";
// // import toast, { Toaster } from "react-hot-toast";
// // import {
// //     Mail,
// //     Lock,
// //     ArrowRight,
// //     ShieldCheck,
// //     Eye,
// //     EyeOff,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import ForgotPasswordModal from "./ForgetPasswordModal";

// // export default function Login() {
// //     const router = useRouter();

// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [showPassword, setShowPassword] = useState(false);
// //     const [loading, setLoading] = useState(false);
// //     const [forgotModal, setForgotModal] = useState(false);


// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         if (!email || !password) {
// //             toast.error("Please fill in all fields");
// //             return;
// //         }

// //         setLoading(true);

// //         try {
// //             const res = await fetch("/api/auth/login", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 },
// //                 body: JSON.stringify({ email, password }),
// //             });

// //             const data = await res.json();

// //             if (!res.ok) {
// //                 toast.error(data.error || "Login failed");
// //                 setLoading(false);
// //                 return;
// //             }

// //             localStorage.setItem("token", data.token);

// //             toast.success("Login successful");
// //             router.replace("/");
// //         } catch (error) {
// //             toast.error("Something went wrong");
// //         }

// //         setLoading(false);
// //     };

// //     return (
// //         <div className="h-screen flex">
// //             <Toaster position="top-right" />

// //             {/* LEFT SIDE (IMAGE) */}
// //             <div className="hidden md:flex w-1/2 relative">
// //                 <img
// //                     src="https://i.pinimg.com/736x/6b/f1/da/6bf1da5d0d99397bce79743ae8e289cb.jpg"
// //                     alt="login visual"
// //                     className="w-full h-full object-cover"
// //                 />

// //                 {/* overlay */}
// //                 {/* <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
// //                     <h1 className="text-3xl font-bold mb-2">
// //                         Welcome Back 👋
// //                     </h1>
// //                     <p className="text-sm opacity-90">
// //                         Manage your business, employees and analytics in one place.
// //                     </p>
// //                 </div> */}
// //             </div>

// //             {/* RIGHT SIDE (FORM) */}
// //             <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-950 p-6">
// //                 <div className="w-full max-w-md">

// //                     {/* Card */}
// //                     <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
// //                         <div className="text-center mb-8">
// //                             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 mb-4">
// //                                 <ShieldCheck className="w-7 h-7 text-white" />
// //                             </div>
// //                             <h1 className="text-2xl font-bold text-slate-800">
// //                                 Login
// //                             </h1>
// //                             <p className="text-slate-400 text-sm mt-1">
// //                                 Access your dashboard
// //                             </p>
// //                         </div>

// //                         {/* FORM */}
// //                         <form onSubmit={handleSubmit} className="space-y-5">

// //                             {/* Email */}
// //                             <div>
// //                                 <label className="text-xs font-semibold text-slate-500 uppercase">
// //                                     Email
// //                                 </label>
// //                                 <div className="relative mt-1">
// //                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
// //                                     <input
// //                                         type="email"
// //                                         value={email}
// //                                         onChange={(e) => setEmail(e.target.value)}
// //                                         placeholder="you@example.com"
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-lg outline-none focus:ring-2 focus:ring-sky-200"
// //                                     />
// //                                 </div>
// //                             </div>

// //                             {/* Password */}
// //                             <div>
// //                                 <div className="flex justify-between">
// //                                     <label className="text-xs font-semibold text-slate-500 uppercase">
// //                                         Password
// //                                     </label>
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => setForgotModal(true)}
// //                                         className="text-xs text-sky-500"
// //                                     >
// //                                         Forgot Password?
// //                                     </button>
// //                                 </div>

// //                                 <div className="relative mt-1">
// //                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
// //                                     <input
// //                                         type={showPassword ? "text" : "password"}
// //                                         value={password}
// //                                         onChange={(e) => setPassword(e.target.value)}
// //                                         placeholder="••••••••"
// //                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-lg outline-none focus:ring-2 focus:ring-sky-200"
// //                                     />
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => setShowPassword(!showPassword)}
// //                                         className="absolute right-3 top-1/2 -translate-y-1/2"
// //                                     >
// //                                         {showPassword ? (
// //                                             <EyeOff className="w-4 h-4 text-slate-400" />
// //                                         ) : (
// //                                             <Eye className="w-4 h-4 text-slate-400" />
// //                                         )}
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             {/* Submit */}
// //                             <button
// //                                 type="submit"
// //                                 disabled={loading}
// //                                 className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition
// //                                 ${loading
// //                                         ? "bg-gray-200 text-gray-400"
// //                                         : "bg-sky-500 hover:bg-sky-600 text-white"
// //                                     }`}
// //                             >
// //                                 {loading ? "Signing in..." : "Sign In"}
// //                                 {!loading && <ArrowRight className="w-4 h-4" />}
// //                             </button>
// //                         </form>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Footer */}
// //             {/* <div className="absolute bottom-3 w-full text-center text-xs text-slate-500">
// //                 Developed by <span className="font-semibold">SpiderVision Systems</span>
// //             </div> */}

// //             <ForgotPasswordModal
// //                 isOpen={forgotModal}
// //                 onClose={() => setForgotModal(false)}
// //             />
// //         </div>
// //     );
// // }



// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {
//     Mail,
//     Lock,
//     ArrowRight,
//     ShieldCheck,
//     Eye,
//     EyeOff,
//     Loader2,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import ForgotPasswordModal from "./ForgetPasswordModal";

// export default function Login() {
//     const router = useRouter();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [forgotModal, setForgotModal] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             toast.error("Please fill in all fields");
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await fetch("/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 toast.error(data.error || "Invalid credentials");
//                 setLoading(false);
//                 return;
//             }

//             localStorage.setItem("token", data.token);
//             toast.success("Welcome back!");
//             router.replace("/");
//         } catch (error) {
//             toast.error("Network error. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex bg-slate-50 font-sans">
//             <Toaster position="top-center" reverseOrder={false} />

//             {/* LEFT SIDE: Visual/Branding */}
//             <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
//                 {/* <img
//                     src="https://i.pinimg.com/736x/6b/f1/da/6bf1da5d0d99397bce79743ae8e289cb.jpg"
//                     alt="Workplace"
//                     className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
//                 /> */}
//                 <div className="relative z-10 flex flex-col justify-center p-16 text-white">
//                     <div className="bg-white/10 backdrop-blur-md w-fit p-3 rounded-2xl mb-8">
//                         <ShieldCheck className="w-10 h-10 text-indigo-300" />
//                     </div>
//                     <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
//                         Secure Access for <br /> Modern Teams.
//                     </h1>
//                     <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
//                         The all-in-one platform to manage your business operations,
//                         employee engagement, and real-time analytics.
//                     </p>
//                 </div>
//                 {/* Decorative blob */}
//                 <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20" />
//             </div>

//             {/* RIGHT SIDE: Form */}
//             <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white lg:bg-slate-50">
//                 <div className="w-full max-w-md space-y-8">

//                     <div className="text-center lg:text-left">
//                         <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
//                             Sign In
//                         </h2>
//                         <p className="text-slate-500 mt-2">
//                             Enter your details to access your account
//                         </p>
//                     </div>

//                     <div className="bg-white lg:shadow-2xl lg:shadow-slate-200/60 rounded-[2rem] p-2 sm:p-1">
//                         <form onSubmit={handleSubmit} className="p-2 sm:p-6 space-y-6">

//                             {/* Email Field */}
//                             <div className="space-y-2">
//                                 <label className="text-sm font-medium text-slate-700 ml-1">
//                                     Email Address
//                                 </label>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
//                                         placeholder="name@company.com"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Password Field */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between px-1">
//                                     <label className="text-sm font-medium text-slate-700">
//                                         Password
//                                     </label>
//                                     <button
//                                         type="button"
//                                         onClick={() => setForgotModal(true)}
//                                         className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
//                                     >
//                                         Forgot?
//                                     </button>
//                                 </div>
//                                 <div className="relative group">
//                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//                                     </div>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
//                                         placeholder="••••••••"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
//                                     >
//                                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
//                             >
//                                 {loading ? (
//                                     <Loader2 className="h-5 w-5 animate-spin" />
//                                 ) : (
//                                     <>
//                                         <span>Sign In to Dashboard</span>
//                                         <ArrowRight className="h-5 w-5" />
//                                     </>
//                                 )}
//                             </button>
//                         </form>
//                     </div>

//                     <p className="text-center text-slate-500 text-sm">
//                         Don't have an account?{" "}
//                         <button className="font-bold text-indigo-600 hover:underline">Contact Admin</button>
//                     </p>
//                 </div>
//             </div>

//             <ForgotPasswordModal
//                 isOpen={forgotModal}
//                 onClose={() => setForgotModal(false)}
//             />
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "./ForgetPasswordModal";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotModal, setForgotModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Invalid credentials");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            toast.success("Welcome back!");
            router.replace("/");
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
            <Toaster position="top-center" />

            {/* PART 1: VISUAL SECTION (Now visible on all screens) */}
            <div className="relative w-full h-64 lg:h-auto lg:w-1/2 bg-indigo-900 overflow-hidden shrink-0">
                {/* <img
                    src="https://i.pinimg.com/736x/2f/43/d7/2f43d7dbdfa9eb3b516528371f798d4b.jpg"
                    alt="Workplace"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                /> */}

                {/* Content inside the image section */}
                <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-16 text-white">
                    <div className="bg-white/10 backdrop-blur-md w-fit p-2 lg:p-3 rounded-xl lg:rounded-2xl mb-4 lg:mb-8">
                        <ShieldCheck className="w-6 h-6 lg:w-10 lg:h-10 text-indigo-300" />
                    </div>
                    <h1 className="text-2xl lg:text-5xl font-extrabold tracking-tight mb-2 lg:mb-6 leading-tight">
                        Secure Access
                    </h1>
                    <p className="text-indigo-100 text-sm lg:text-lg max-w-md  sm:block opacity-90">
                        The all-in-one platform to manage your business operations,
                        employee engagement, and real-time analytics.
                    </p>
                </div>

                {/* Decorative blob (Visible on desktop only for clean mobile look) */}
                <div className="hidden lg:block absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20" />
            </div>

            {/* PART 2: FORM SECTION */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 -mt-10 lg:mt-0 relative z-20">
                <div className="w-full max-w-md space-y-6 lg:space-y-8">

                    {/* Header for Form */}
                    <div className="bg-blue-100 lg:bg-transparent p-6 lg:p-0 rounded-t-[2rem] shadow-sm lg:shadow-none border-b lg:border-none border-slate-100 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            Sign In
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-blue-100 shadow-3xl lg:shadow-2xl shadow-slate-200/60  lg:rounded-3xl overflow-hidden -mt-5">
                        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setForgotModal(true)}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-2 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-slate-400 text-xs">
                        Developed by <span className="font-bold text-slate-600">SpiderVision Systems</span>
                    </p>
                </div>
            </div>

            <ForgotPasswordModal
                isOpen={forgotModal}
                onClose={() => setForgotModal(false)}
            />
        </div>
    );
}