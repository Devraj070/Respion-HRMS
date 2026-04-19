
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
                toast.error(data.error || "Login failed");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);

            toast.success("Login successful");
            router.replace("/");
        } catch (error) {
            toast.error("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex">
            <Toaster position="top-right" />

            {/* LEFT SIDE (IMAGE) */}
            <div className="hidden md:flex w-1/2 relative">
                <img
                    src="https://i.pinimg.com/736x/2f/43/d7/2f43d7dbdfa9eb3b516528371f798d4b.jpg"
                    alt="login visual"
                    className="w-full h-full object-cover"
                />

                {/* overlay */}
                {/* <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome Back 👋
                    </h1>
                    <p className="text-sm opacity-90">
                        Manage your business, employees and analytics in one place.
                    </p>
                </div> */}
            </div>

            {/* RIGHT SIDE (FORM) */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
                <div className="w-full max-w-md">

                    {/* Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 mb-4">
                                <ShieldCheck className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Login
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Access your dashboard
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Email
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-lg outline-none focus:ring-2 focus:ring-sky-200"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setForgotModal(true)}
                                        className="text-xs text-sky-500"
                                    >
                                        Forgot?
                                    </button>
                                </div>

                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-lg outline-none focus:ring-2 focus:ring-sky-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition
                                ${loading
                                        ? "bg-gray-200 text-gray-400"
                                        : "bg-sky-500 hover:bg-sky-600 text-white"
                                    }`}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <div className="absolute bottom-3 w-full text-center text-xs text-slate-500">
                Developed by <span className="font-semibold">SpiderVision Systems</span>
            </div> */}

            <ForgotPasswordModal
                isOpen={forgotModal}
                onClose={() => setForgotModal(false)}
            />
        </div>
    );
}


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
//                 toast.error(data.error || "Login failed");
//                 setLoading(false);
//                 return;
//             }

//             localStorage.setItem("token", data.token);

//             toast.success("Login successful");
//             router.replace("/");
//         } catch (error) {
//             toast.error("Something went wrong");
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
//             <Toaster position="top-right" />

//             {/* 🔥 Full Screen Background Image */}
//             <img
//                 src="https://i.pinimg.com/736x/2b/a0/db/2ba0dbf21ab24ae36d7ec5aea81dbaa8.jpg"
//                 alt="background"
//                 className="absolute inset-0 w-full h-full object-cover"
//             />

//             {/* 🔥 Dark Overlay for readability */}
//             <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

//             {/* Login Card */}
//             <div className="relative z-10 w-full max-w-md px-4">
//                 <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8">

//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 mb-4">
//                             <ShieldCheck className="w-7 h-7 text-white" />
//                         </div>

//                         <h1 className="text-2xl font-bold text-slate-800">
//                             Sign In
//                         </h1>
//                         <p className="text-slate-500 text-sm mt-1">
//                             Welcome back, please login
//                         </p>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-5">

//                         {/* Email */}
//                         <div>
//                             <label className="text-xs font-semibold text-slate-500 uppercase">
//                                 Email
//                             </label>
//                             <div className="relative mt-1">
//                                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     placeholder="you@example.com"
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <div className="flex justify-between">
//                                 <label className="text-xs font-semibold text-slate-500 uppercase">
//                                     Password
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={() => setForgotModal(true)}
//                                     className="text-xs text-sky-500"
//                                 >
//                                     Forgot?
//                                 </button>
//                             </div>

//                             <div className="relative mt-1">
//                                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     placeholder="••••••••"
//                                     className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff className="w-4 h-4 text-slate-400" />
//                                     ) : (
//                                         <Eye className="w-4 h-4 text-slate-400" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Submit */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition
//                             ${loading
//                                     ? "bg-gray-200 text-gray-400"
//                                     : "bg-sky-500 hover:bg-sky-600 text-white"
//                                 }`}
//                         >
//                             {loading ? "Signing in..." : "Sign In"}
//                             {!loading && <ArrowRight className="w-4 h-4" />}
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="absolute bottom-4 text-xs text-white/70">
//                 Developed by <span className="font-semibold">SpiderVision Systems</span>
//             </div>

//             <ForgotPasswordModal
//                 isOpen={forgotModal}
//                 onClose={() => setForgotModal(false)}
//             />
//         </div>
//     );
// }