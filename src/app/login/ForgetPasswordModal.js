"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Mail,
    Lock,
    KeyRound,
    ArrowRight,
    ArrowLeft,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(180);
    const [email, setEmail] = useState("");

    const validatePasswordStrength = (password) => {
        const checks = [
            { id: 'minLength', label: '8+ characters', valid: password.length >= 8 },
            { id: 'upperCase', label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
            { id: 'lowerCase', label: 'Lowercase letter', valid: /[a-z]/.test(password) },
            { id: 'digits', label: 'One number', valid: /\d/.test(password) },
            { id: 'specialChar', label: 'Special character', valid: /[!@#$%^&*]/.test(password) },
        ];
        return {
            isValid: checks.every(c => c.valid),
            checks
        };
    };

    const strength = validatePasswordStrength(newPassword);

    useEffect(() => {
        let timer;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = async () => {
        setError({});
        setMessage("");
        setLoading(true);

        try {
            if (step === 1) {
                if (!email) throw new Error("Please enter your email.");
                const res = await fetch("/api/auth/forget-password", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                    headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to send OTP");

                setMessage("Verification code sent to your email");
                setStep(2);
                setCountdown(180);
            }
            else if (step === 2) {
                const res = await fetch("/api/auth/forget-password", {
                    method: "PUT",
                    body: JSON.stringify({ email, otp }),
                    headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Invalid OTP");

                setStep(3);
                setOtp('');
            }
            else if (step === 3) {
                if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
                if (!strength.isValid) throw new Error("Please meet all password requirements");

                const res = await fetch("/api/auth/forget-password", {
                    method: "PATCH",
                    body: JSON.stringify({ email, newPassword }),
                    headers: { "Content-Type": "application/json", 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
                });
                if (!res.ok) throw new Error("Failed to reset password");

                toast.success("Password updated successfully!");
                handleClose();
            }
        } catch (err) {
            setError({ server: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setError({});
        setMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 lg:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mb-4">
                            {step === 1 && <Mail className="w-8 h-8" />}
                            {step === 2 && <KeyRound className="w-8 h-8" />}
                            {step === 3 && <Lock className="w-8 h-8" />}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {step === 1 && "Forgot Password?"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </h2>
                        <p className="text-slate-500 text-sm mt-2">
                            {step === 1 && "No worries, we'll send you reset instructions."}
                            {step === 2 && `We've sent a code to ${email}`}
                            {step === 3 && "Please choose a strong new password."}
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {error.server && (
                        <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-2xl">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error.server}
                        </div>
                    )}
                    {message && (
                        <div className="flex items-center gap-2 p-4 mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {message}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {step === 1 && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[1em] bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500">
                                        Resend code in <span className="font-bold text-indigo-600">{formatTime(countdown)}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                {/* Real-time Password Strength Check */}
                                <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    {strength.checks.map((check) => (
                                        <div key={check.id} className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${check.valid ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <span className={`text-[11px] font-medium ${check.valid ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                {check.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                    onClick={() => setStep(step - 1)}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            )}
                            <button
                                type="button"
                                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                onClick={handleNext}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        {step === 3 ? "Update Password" : "Continue"}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;