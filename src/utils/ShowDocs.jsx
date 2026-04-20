"use client";

import { useEffect, useState } from "react";
import {
    User,
    FileText,
    ChevronDown,
    ChevronRight,
    Trash2,
    Loader2,
    FolderOpen
} from "lucide-react";

export default function DocumentsList() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openUser, setOpenUser] = useState(null);

    // FETCH ALL DOCUMENTS
    const fetchDocs = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
            });

            const data = await res.json();

            if (data.success) {
                setDocs(data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    // DELETE DOCUMENT
    const handleDelete = async (id) => {
        const confirmDelete = confirm("Delete this document?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`/api/documents/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
        });

        const data = await res.json();

        if (data.success) {
            setDocs((prev) => prev.filter((d) => d._id !== id));
        }
    };

    // GROUP BY USER
    const grouped = docs.reduce((acc, doc) => {
        const userId = doc.user?._id;

        if (!acc[userId]) {
            acc[userId] = {
                user: doc.user,
                documents: [],
            };
        }

        acc[userId].documents.push(doc);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-6 h-6" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-6">
                <FolderOpen />
                <h1 className="text-xl font-bold">Employee Documents</h1>
            </div>

            {/* USERS LIST */}
            <div className="space-y-4">

                {Object.values(grouped).map((group) => (
                    <div
                        key={group.user._id}
                        className="border rounded-xl bg-white shadow-sm"
                    >

                        {/* USER HEADER */}
                        <div
                            onClick={() =>
                                setOpenUser(
                                    openUser === group.user._id
                                        ? null
                                        : group.user._id
                                )
                            }
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <User className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">
                                        {group.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {group.user.employeeId} •{" "}
                                        {group.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {group.documents.length} files
                                </span>

                                {openUser === group.user._id ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}
                            </div>
                        </div>

                        {/* DOCUMENTS */}
                        {openUser === group.user._id && (
                            <div className="border-t p-4 space-y-3 bg-gray-50">

                                {group.documents.map((doc) => (
                                    <div
                                        key={doc._id}
                                        className="flex justify-between items-center bg-white p-3 rounded-lg border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-500" />

                                            <div>
                                                <p className="font-medium">
                                                    {doc.title}
                                                </p>

                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    className="text-xs text-blue-500 underline"
                                                >
                                                    View File
                                                </a>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDelete(doc._id)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
