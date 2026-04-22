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
                    <div className=" w-fit p-2 lg:p-3 rounded-xl lg:rounded-2xl mb-4 lg:mb-8 flex items-center gap-3 lg:gap-5">
                        <ShieldCheck className="w-8 h-8 lg:w-12 lg:h-12 text-indigo-300" />

                        <h1 className="text-2xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                            Secure Access
                        </h1>
                    </div>

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
                <div className="w-full max-w-md space-y-5 lg:space-y-8">

                    {/* Header for Form */}
                    <div className="bg-blue-50 lg:bg-transparent p-6 lg:p-0 rounded-t-[2rem] shadow-sm lg:shadow-none border-b lg:border-none border-slate-100 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            Sign In
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-blue-50 rounded-b-3xl shadow-3xl lg:shadow-2xl shadow-slate-200/60  lg:rounded-3xl overflow-hidden -mt-5">
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


                </div>
            </div>

            <ForgotPasswordModal
                isOpen={forgotModal}
                onClose={() => setForgotModal(false)}
            />
        </div>
    );
}