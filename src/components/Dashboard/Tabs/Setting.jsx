"use client";

import { useEffect, useState, useRef } from "react";
import {
    Save,
    Upload,
    Building2,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    Globe,
    FileText
} from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        logo: "",
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [fetching, setFetching] = useState(true);
    const fileInputRef = useRef(null);

    // 💡 CONFIG: Add your Cloudinary details here
    const CLOUD_NAME = "doht9rgen";
    const UPLOAD_PRESET = "hrms_unsigned";

    // GET COMPANY DATA
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 DIRECT UNSIGNED CLOUDINARY UPLOAD (Proper Frontend Method)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "hrms/company-logo");

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            const data = await res.json();

            if (data.secure_url) {
                setForm((prev) => ({
                    ...prev,
                    logo: data.secure_url,
                }));
            } else {
                alert("Upload failed. Verify Cloudinary preset settings.");
            }
        } catch (err) {
            console.error("Cloudinary Error:", err);
            alert("Error connecting to Cloudinary.");
        } finally {
            setUploading(false);
        }
    };

    // SUBMIT (POST or PATCH)
    const handleSubmit = async () => {
        setLoading(true);

        try {
            const url = companyId ? `/api/company/${companyId}` : "/api/company";
            const method = companyId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "no_key"
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                toast.success("Settings saved successfully");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
                <Loader2 className="animate-spin mr-2" /> Loading Organization Setup...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                            <Building2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
                            <p className="text-sm font-medium text-slate-500">Manage your company branding and identity</p>
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* left COLUMN: PREVIEW */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2">Live Brand Preview</h2>

                            {/* PREVIEW CARD */}
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                                <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
                                <div className="px-6 pb-8">
                                    <div className="relative -mt-10 mb-4 inline-block">
                                        <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                                            {form.logo ? (
                                                <img src={form.logo} alt="Brand" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>
                                        {form.logo && (
                                            <div className="absolute -right-2 -top-2 rounded-full bg-green-500 p-1 text-white ring-4 ring-white">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 truncate">
                                        {form.name || "Your Company Name"}
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <FileText className="mt-1 flex-shrink-0 text-slate-400" size={16} />
                                            <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-3">
                                                {form.description || "Your company description will appear here. It helps employees and clients understand your mission."}
                                            </p>
                                        </div>
                                        {/* <div className="flex items-center gap-3">
                                            <Globe className="text-slate-400" size={16} />
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-tight">Public Workspace</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            {/* TIP BOX */}
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                                <div className="flex gap-3">
                                    <div className="text-amber-600 mt-0.5">
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-900">Brand Identity Tip</p>
                                        <p className="mt-1 text-[11px] font-medium leading-normal text-amber-800/70">
                                            Transparent PNG logos work best for professional dashboard headers and document generation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* right COLUMN: FORM */}
                    <div className="space-y-6 lg:col-span-7">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                            <h2 className="mb-6 text-lg font-bold text-slate-800">Basic Information</h2>

                            <div className="space-y-5">
                                {/* Name Input */}
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-400">
                                        Display Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Xyz Corporation"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-400">
                                        About the Company
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe your company's core mission..."
                                        rows={5}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    />
                                </div>

                                {/* Logo Dropzone */}
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-400">
                                        Brand Assets (Logo)
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${uploading ? "bg-slate-100 border-slate-300" : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white"
                                            } p-8`}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            hidden
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin text-indigo-600" />
                                                <span className="text-xs font-bold text-slate-500">Directly pushing to Cloudinary...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center">
                                                <div className="mb-3 rounded-full bg-white p-3 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Upload size={20} className="text-indigo-600" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">Click to upload logo</p>
                                                <p className="text-xs text-slate-400 mt-1 font-medium">PNG, JPG or SVG (Max. 2MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || uploading}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {loading ? "Saving Changes..." : "Save Workspace"}
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}