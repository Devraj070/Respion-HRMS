"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadDocument({ user }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [progressText, setProgressText] = useState("");

    // 🔥 Upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        setProgressText("Getting upload signature...");

        const sigRes = await fetch("/api/cloudinary/sign");
        const sigData = await sigRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.data.apiKey);
        formData.append("timestamp", sigData.data.timestamp);
        formData.append("signature", sigData.data.signature);
        formData.append("folder", "hrms/documents");

        setProgressText("Uploading to Cloudinary...");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${sigData.data.cloudName}/raw/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        return await res.json();
    };

    // 🔥 Save to DB
    const saveToDB = async (cloudData) => {
        setProgressText("Saving document...");

        const token = localStorage.getItem("token");

        const res = await fetch("/api/documents/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                user: user?._id,
                title,
                fileUrl: cloudData.secure_url,
                publicId: cloudData.public_id,
                type: cloudData.resource_type,
            }),
        });

        return await res.json();
    };

    // 🔥 MAIN HANDLER
    const handleUpload = async () => {
        if (!file || !title) {
            alert("Please select file and enter title");
            return;
        }

        try {
            setLoading(true);

            const cloudData = await uploadToCloudinary(file);

            if (!cloudData.secure_url) {
                throw new Error("Upload failed");
            }

            const dbRes = await saveToDB(cloudData);

            if (dbRes.success) {
                alert("Document uploaded successfully 🚀");
                setFile(null);
                setTitle("");
            } else {
                alert("DB save failed");
            }

        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
            setProgressText("");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white border rounded-2xl p-6 shadow-sm">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">
                <FileText className="text-black" />
                <h2 className="text-lg font-bold">Upload Document</h2>
            </div>

            {/* TITLE */}
            <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* FILE INPUT */}
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border p-3 rounded-xl mb-4"
            />

            {/* FILE INFO */}
            {file && (
                <div className="text-sm text-gray-600 mb-3">
                    Selected: <b>{file.name}</b>
                </div>
            )}

            {/* PROGRESS */}
            {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {progressText}
                </div>
            )}

            {/* UPLOAD BUTTON */}
            <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <Upload size={18} />
                {loading ? "Uploading..." : "Upload Document"}
            </button>
        </div>
    );
}