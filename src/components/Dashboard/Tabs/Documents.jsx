// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //     Upload,
// //     User,
// //     FileText,
// //     Loader2,
// //     Trash2,
// //     ChevronDown,
// //     ChevronRight,
// //     FolderOpen
// // } from "lucide-react";

// // export default function DocumentsPage() {
// //     const [users, setUsers] = useState([]);
// //     const [docs, setDocs] = useState([]);
// //     const [selectedUser, setSelectedUser] = useState("");
// //     const [title, setTitle] = useState("");
// //     const [file, setFile] = useState(null);
// //     const [uploading, setUploading] = useState(false);
// //     const [loading, setLoading] = useState(true);
// //     const [openUser, setOpenUser] = useState(null);

// //     // ---------------- FETCH USERS ----------------
// //     const fetchUsers = async () => {
// //         try {
// //             const res = await fetch("/api/employees", {
// //                 headers: {
// //                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 },
// //             });
// //             const data = await res.json();
// //             setUsers(Array.isArray(data) ? data : data?.data || []);
// //         } catch {
// //             setUsers([]);
// //         }
// //     };

// //     // ---------------- FETCH DOCS ----------------
// //     const fetchDocs = async () => {
// //         try {
// //             const token = localStorage.getItem("token");

// //             const res = await fetch("/api/documents", {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 },
// //             });

// //             const data = await res.json();
// //             if (data.success) setDocs(data.data);
// //         } catch (err) {
// //             console.log(err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchUsers();
// //         fetchDocs();
// //     }, []);

// //     // ----------------CLOUDINARY ----------------
// //     const uploadToCloudinary = async (file) => {
// //         const sigRes = await fetch("/api/cloudinary/sign", {
// //             headers: {
// //                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //             },
// //         });

// //         const sigData = await sigRes.json();

// //         const formData = new FormData();
// //         formData.append("file", file);
// //         formData.append("api_key", sigData.data.apiKey);
// //         formData.append("timestamp", sigData.data.timestamp);
// //         formData.append("signature", sigData.data.signature);
// //         formData.append("folder", "hrms/documents");

// //         const res = await fetch(
// //             `https://api.cloudinary.com/v1_1/${sigData.data.cloudName}/auto/upload`,
// //             {
// //                 method: "POST",
// //                 body: formData,
// //             }
// //         );

// //         return await res.json();
// //     };

// //     //     const uploadToCloudinary = async (file) => {
// //     //     const sigRes = await fetch("/api/cloudinary/sign", {
// //     //         headers: {
// //     //             "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //     //         },
// //     //     });

// //     //     const sigData = await sigRes.json();

// //     //     const formData = new FormData();
// //     //     formData.append("file", file);
// //     //     formData.append("api_key", sigData.data.apiKey);
// //     //     formData.append("timestamp", sigData.data.timestamp);
// //     //     formData.append("signature", sigData.data.signature);
// //     //     formData.append("folder", "hrms/documents");

// //     //     // 🔥 IMPORTANT: detect type
// //     //     const isImage = file.type.startsWith("image/");
// //     //     const resourceType = isImage ? "image" : "raw";

// //     //     const res = await fetch(
// //     //         `https://api.cloudinary.com/v1_1/${sigData.data.cloudName}/${resourceType}/upload`,
// //     //         {
// //     //             method: "POST",
// //     //             body: formData,
// //     //         }
// //     //     );

// //     //     const data = await res.json();

// //     //     // 🔥 Fix URL (100% safe)
// //     //     const fixedUrl = data.secure_url.replace(
// //     //         "/image/upload/",
// //     //         `/${resourceType}/upload/`
// //     //     );

// //     //     return {
// //     //         ...data,
// //     //         secure_url: fixedUrl,
// //     //         resource_type: resourceType,
// //     //     };
// //     // };

// //     // ---------------- SAVE ----------------
// //     const saveDocument = async (cloudData) => {
// //         const token = localStorage.getItem("token");

// //         const res = await fetch("/api/cloudinary/save-to-db", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${token}`,
// //                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //             },
// //             body: JSON.stringify({
// //                 user: selectedUser,
// //                 title,
// //                 fileUrl: cloudData.secure_url,
// //                 publicId: cloudData.public_id,
// //                 type: cloudData.resource_type,
// //             }),
// //         });

// //         return await res.json();
// //     };

// //     // ---------------- UPLOAD ----------------
// //     const handleUpload = async () => {
// //         if (!selectedUser || !file || !title) {
// //             alert("Select user, title and file");
// //             return;
// //         }

// //         try {
// //             setUploading(true);

// //             const cloud = await uploadToCloudinary(file);
// //             const db = await saveDocument(cloud);

// //             if (db.success) {
// //                 alert("Uploaded 🚀");

// //                 setTitle("");
// //                 setFile(null);
// //                 setSelectedUser("");

// //                 fetchDocs(); // manual refresh only
// //             }
// //         } catch (err) {
// //             console.log(err);
// //             alert("Upload failed");
// //         } finally {
// //             setUploading(false);
// //         }
// //     };

// //     // ---------------- DELETE ----------------
// //     const handleDelete = async (id) => {
// //         const ok = confirm("Delete this document?");
// //         if (!ok) return;

// //         try {
// //             const token = localStorage.getItem("token");

// //             const res = await fetch(`/api/documents/${id}`, {
// //                 method: "DELETE",
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
// //                 },
// //             });

// //             const data = await res.json();

// //             if (data.success) {
// //                 setDocs((prev) => prev.filter((d) => d._id !== id));
// //             }
// //         } catch (err) {
// //             console.log(err);
// //         }
// //     };

// //     // ---------------- GROUP ----------------
// //     const grouped = docs.reduce((acc, doc) => {
// //         const userId = doc.user?._id;

// //         if (!acc[userId]) {
// //             acc[userId] = {
// //                 user: doc.user,
// //                 documents: [],
// //             };
// //         }

// //         acc[userId].documents.push(doc);
// //         return acc;
// //     }, {});

// //     // ---------------- UI ----------------
// //     return (
// //         <div className="max-w-5xl mx-auto p-6 space-y-8">

// //             {/* UPLOAD */}
// //             <div className="bg-white p-6 rounded-2xl shadow border">
// //                 <h1 className="text-xl font-bold flex gap-2 mb-4">
// //                     <FileText /> Employee Documents
// //                 </h1>

// //                 <select
// //                     value={selectedUser}
// //                     onChange={(e) => setSelectedUser(e.target.value)}
// //                     className="w-full border p-3 rounded-xl mb-3"
// //                 >
// //                     <option value="">Select Employee</option>
// //                     {users.map((u) => (
// //                         <option key={u._id} value={u._id}>
// //                             {u.name} ({u.employeeId})
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <input
// //                     type="text"
// //                     placeholder="Document Title"
// //                     value={title}
// //                     onChange={(e) => setTitle(e.target.value)}
// //                     className="w-full border p-3 rounded-xl mb-3"
// //                 />

// //                 <input
// //                     type="file"
// //                     onChange={(e) => setFile(e.target.files[0])}
// //                     className="w-full border p-3 rounded-xl mb-3"
// //                 />

// //                 <button
// //                     onClick={handleUpload}
// //                     disabled={uploading}
// //                     className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
// //                 >
// //                     {uploading ? (
// //                         <>
// //                             <Loader2 className="animate-spin w-4 h-4" />
// //                             Uploading...
// //                         </>
// //                     ) : (
// //                         <>
// //                             <Upload size={16} />
// //                             Upload Document
// //                         </>
// //                     )}
// //                 </button>
// //             </div>

// //             {/* LIST */}
// //             <div>
// //                 <div className="flex items-center gap-2 mb-4">
// //                     <FolderOpen />
// //                     <h2 className="font-bold">All Documents</h2>
// //                 </div>

// //                 {loading ? (
// //                     <div className="flex justify-center">
// //                         <Loader2 className="animate-spin" />
// //                     </div>
// //                 ) : (
// //                     <div className="space-y-4">
// //                         {Object.values(grouped).map((group) => (
// //                             <div
// //                                 key={group.user._id}
// //                                 className="border rounded-xl bg-white"
// //                             >
// //                                 {/* USER */}
// //                                 <div
// //                                     onClick={() =>
// //                                         setOpenUser(
// //                                             openUser === group.user._id
// //                                                 ? null
// //                                                 : group.user._id
// //                                         )
// //                                     }
// //                                     className="flex justify-between p-4 cursor-pointer hover:bg-gray-50"
// //                                 >
// //                                     <div className="flex gap-3">
// //                                         <User />
// //                                         <div>
// //                                             <p className="font-semibold">
// //                                                 {group.user.name}
// //                                             </p>
// //                                             <p className="text-xs text-gray-500">
// //                                                 {group.user.employeeId}
// //                                             </p>
// //                                         </div>
// //                                     </div>

// //                                     {openUser === group.user._id ? (
// //                                         <ChevronDown />
// //                                     ) : (
// //                                         <ChevronRight />
// //                                     )}
// //                                 </div>

// //                                 {/* DOCS */}
// //                                 {openUser === group.user._id && (
// //                                     <div className="border-t p-4 space-y-3 bg-gray-50">
// //                                         {group.documents.map((doc) => (
// //                                             <div
// //                                                 key={doc._id}
// //                                                 className="flex justify-between bg-white p-3 rounded"
// //                                             >
// //                                                 <div>
// //                                                     <p className="font-medium">
// //                                                         {doc.title}
// //                                                     </p>
// //                                                     <a
// //                                                         href={doc.fileUrl}
// //                                                         target="_blank"
// //                                                         className="text-xs text-blue-500 underline"
// //                                                     >
// //                                                         View File
// //                                                     </a>
// //                                                 </div>

// //                                                 <button
// //                                                     onClick={() =>
// //                                                         handleDelete(doc._id)
// //                                                     }
// //                                                     className="text-red-500"
// //                                                 >
// //                                                     <Trash2 size={16} />
// //                                                 </button>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import {
//     Upload,
//     User,
//     FileText,
//     Loader2,
//     Trash2,
//     ChevronDown,
//     ChevronRight,
//     FolderOpen,
//     FilePlus,
//     Search
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// export default function DocumentsPage() {
//     const [users, setUsers] = useState([]);
//     const [docs, setDocs] = useState([]);
//     const [selectedUser, setSelectedUser] = useState("");
//     const [title, setTitle] = useState("");
//     const [file, setFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [openUser, setOpenUser] = useState(null);

//     // ---------------- FETCH DATA ----------------
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//             };

//             const [userRes, docRes] = await Promise.all([
//                 fetch("/api/employees", { headers }),
//                 fetch("/api/documents", { headers })
//             ]);

//             const userData = await userRes.json();
//             const docData = await docRes.json();

//             setUsers(Array.isArray(userData) ? userData : userData?.data || []);
//             if (docData.success) setDocs(docData.data);
//         } catch (err) {
//             toast.error("Failed to sync data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // ---------------- CLOUDINARY ----------------
//     const uploadToCloudinary = async (file) => {
//         const sigRes = await fetch("/api/cloudinary/sign", {
//             headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
//         });
//         const sigData = await sigRes.json();

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("api_key", sigData.data.apiKey);
//         formData.append("timestamp", sigData.data.timestamp);
//         formData.append("signature", sigData.data.signature);
//         formData.append("folder", "hrms/documents");

//         const res = await fetch(
//             `https://api.cloudinary.com/v1_1/${sigData.data.cloudName}/auto/upload`,
//             { method: "POST", body: formData }
//         );
//         return await res.json();
//     };

//     // ---------------- ACTIONS ----------------
//     const handleUpload = async () => {
//         if (!selectedUser || !file || !title) {
//             toast.error("Please fill all fields");
//             return;
//         }

//         const toastId = toast.loading("Uploading document...");
//         try {
//             setUploading(true);
//             const cloud = await uploadToCloudinary(file);

//             const token = localStorage.getItem("token");
//             const dbRes = await fetch("/api/cloudinary/save-to-db", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 },
//                 body: JSON.stringify({
//                     user: selectedUser,
//                     title,
//                     fileUrl: cloud.secure_url,
//                     publicId: cloud.public_id,
//                     type: cloud.resource_type,
//                 }),
//             });

//             const db = await dbRes.json();

//             if (db.success) {
//                 toast.success("Document stored successfully!", { id: toastId });
//                 // Reset Fields
//                 setTitle("");
//                 setFile(null);
//                 setSelectedUser("");
//                 fetchData();
//             }
//         } catch (err) {
//             toast.error("Upload failed", { id: toastId });
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this file?")) return;

//         try {
//             const token = localStorage.getItem("token");
//             const res = await fetch(`/api/documents/${id}`, {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//                 },
//             });

//             if ((await res.json()).success) {
//                 setDocs((prev) => prev.filter((d) => d._id !== id));
//                 toast.success("File deleted");
//             }
//         } catch (err) {
//             toast.error("Delete failed");
//         }
//     };

//     // ---------------- LOGIC ----------------
//     const grouped = docs.reduce((acc, doc) => {
//         const userId = doc.user?._id;
//         if (!userId) return acc;
//         if (!acc[userId]) acc[userId] = { user: doc.user, documents: [] };
//         acc[userId].documents.push(doc);
//         return acc;
//     }, {});

//     return (
//         <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 font-sans text-slate-900">
//             <Toaster position="top-right" />

//             <div className="max-w-5xl mx-auto space-y-6">

//                 {/* HEADER & STATS */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//                     <div>
//                         <h1 className="text-2xl font-bold tracking-tight">Vault</h1>
//                         <p className="text-sm text-slate-500 font-medium">Manage and organize employee records.</p>
//                     </div>
//                     <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-lg shadow-slate-200">
//                         <FolderOpen size={20} className="opacity-70" />
//                         <div>
//                             <p className="text-[10px] uppercase font-black tracking-widest leading-none opacity-60">System Total</p>
//                             <p className="text-lg font-bold leading-none mt-1">{docs.length} Files</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//                     {/* UPLOAD PANEL */}
//                     <div className="lg:col-span-5">
//                         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
//                             <div className="flex items-center gap-2 mb-6 text-slate-800">
//                                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                                     <FilePlus size={20} />
//                                 </div>
//                                 <h2 className="font-bold">New Upload</h2>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="space-y-1.5">
//                                     <label className="text-xs font-bold text-slate-500 ml-1">Select Employee</label>
//                                     <select
//                                         value={selectedUser}
//                                         onChange={(e) => setSelectedUser(e.target.value)}
//                                         className="w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
//                                     >
//                                         <option value="">Choose...</option>
//                                         {users.map((u) => (
//                                             <option key={u._id} value={u._id}>{u.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="space-y-1.5">
//                                     <label className="text-xs font-bold text-slate-500 ml-1">Document Title</label>
//                                     <input
//                                         type="text"
//                                         placeholder="e.g. Identity Proof"
//                                         value={title}
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         className="w-full bg-slate-50 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
//                                     />
//                                 </div>

//                                 <div className="space-y-1.5">
//                                     <label className="text-xs font-bold text-slate-500 ml-1">File Attachment</label>
//                                     <div className="relative group">
//                                         <input
//                                             type="file"
//                                             onChange={(e) => setFile(e.target.files[0])}
//                                             className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
//                                         />
//                                         <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center gap-2 group-hover:border-blue-400 transition-colors">
//                                             <Upload className="text-slate-400 group-hover:text-blue-500" size={24} />
//                                             <p className="text-sm font-medium text-slate-500">
//                                                 {file ? file.name : "Click to browse file"}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={handleUpload}
//                                     disabled={uploading}
//                                     className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
//                                 >
//                                     {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={18} />}
//                                     {uploading ? "Uploading..." : "Save to Vault"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* DIRECTORY LIST */}
//                     <div className="lg:col-span-7 space-y-4">
//                         <div className="flex items-center justify-between px-2">
//                             <h2 className="font-bold flex items-center gap-2 text-slate-700">
//                                 <Search size={16} /> Directory
//                             </h2>
//                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
//                                 {Object.keys(grouped).length} Active Folders
//                             </span>
//                         </div>

//                         {loading ? (
//                             <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={40} /></div>
//                         ) : (
//                             <div className="space-y-3">
//                                 {Object.values(grouped).map((group) => (
//                                     <div key={group.user._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
//                                         <div
//                                             onClick={() => setOpenUser(openUser === group.user._id ? null : group.user._id)}
//                                             className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
//                                         >
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
//                                                     {group.user.name.charAt(0)}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-bold text-slate-800 leading-tight">{group.user.name}</p>
//                                                     <p className="text-[11px] font-semibold text-slate-400 tracking-tight uppercase">{group.user.employeeId}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-3">
//                                                 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{group.documents.length} Files</span>
//                                                 {openUser === group.user._id ? <ChevronDown size={20} className="text-slate-300" /> : <ChevronRight size={20} className="text-slate-300" />}
//                                             </div>
//                                         </div>

//                                         {openUser === group.user._id && (
//                                             <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-2">
//                                                 {group.documents.map((doc) => (
//                                                     <div key={doc._id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 group shadow-sm hover:shadow-md transition-shadow">
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
//                                                                 <FileText size={16} />
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-sm font-bold text-slate-700 leading-none">{doc.title}</p>
//                                                                 <a href={doc.fileUrl} target="_blank" className="text-[11px] font-bold text-blue-500 hover:underline mt-1 inline-block">View Full File</a>
//                                                             </div>
//                                                         </div>
//                                                         <button
//                                                             onClick={() => handleDelete(doc._id)}
//                                                             className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//                                                         >
//                                                             <Trash2 size={16} />
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    Upload,
    User,
    FileText,
    Loader2,
    Trash2,
    ChevronDown,
    ChevronRight,
    FolderOpen,
    FilePlus,
    Search
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function DocumentsPage() {
    const [users, setUsers] = useState([]);
    const [docs, setDocs] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openUser, setOpenUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null); // Track deletion progress
    const [deleteId, setDeleteId] = useState(null);


    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            };

            const [userRes, docRes] = await Promise.all([
                fetch("/api/employees", { headers }),
                fetch("/api/documents", { headers })
            ]);

            const userData = await userRes.json();
            const docData = await docRes.json();

            setUsers(Array.isArray(userData) ? userData : userData?.data || []);
            if (docData.success) setDocs(docData.data);
        } catch (err) {
            toast.error("Failed to sync data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uploadToCloudinary = async (file) => {
        const sigRes = await fetch("/api/cloudinary/sign", {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        });
        const sigData = await sigRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.data.apiKey);
        formData.append("timestamp", sigData.data.timestamp);
        formData.append("signature", sigData.data.signature);
        formData.append("folder", "hrms/documents");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${sigData.data.cloudName}/auto/upload`,
            { method: "POST", body: formData }
        );
        return await res.json();
    };

    const handleUpload = async () => {
        if (!selectedUser || !file || !title) {
            toast.error("Please fill all fields");
            return;
        }

        const toastId = toast.loading("Uploading document...");
        try {
            setUploading(true);
            const cloud = await uploadToCloudinary(file);

            const token = localStorage.getItem("token");
            const dbRes = await fetch("/api/cloudinary/save-to-db", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({
                    user: selectedUser,
                    title,
                    fileUrl: cloud.secure_url,
                    publicId: cloud.public_id,
                    type: cloud.resource_type,
                }),
            });

            const db = await dbRes.json();

            if (db.success) {
                toast.success("Document stored successfully!", { id: toastId });

                // Auto-expand the user's folder after upload
                setOpenUser(selectedUser);

                // Reset Fields
                setTitle("");
                setFile(null);
                setSelectedUser("");
                fetchData();
            }
        } catch (err) {
            toast.error("Upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, userId) => {
        // if (!confirm("Are you sure you want to delete this file?")) return;
        setDeleteId(null);

        try {
            setDeletingId(id); // Start progress
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
                setOpenUser(userId); // Ensure folder stays expanded
                toast.success("File deleted");
            }
        } catch (err) {
            toast.error("Delete failed");
        } finally {
            setDeletingId(null); // End progress
        }
    };

    const grouped = docs.reduce((acc, doc) => {
        const userId = doc.user?._id;
        if (!userId) return acc;
        if (!acc[userId]) acc[userId] = { user: doc.user, documents: [] };
        acc[userId].documents.push(doc);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 text-slate-900">
            <Toaster position="top-right" />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* STATS HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Document Vault</h1>
                        <p className="text-sm text-slate-500">Employee records and certifications.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl">
                        <FolderOpen size={20} className="opacity-70" />
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Stored Files</p>
                            <p className="text-lg font-bold leading-none mt-1">{docs.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* UPLOAD FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-800">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FilePlus size={20} />
                                </div>
                                <h2 className="font-bold">Upload Center</h2>
                            </div>

                            <div className="space-y-4">
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                >
                                    <option value="">Choose Employee</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.employeeId})</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Document Title (e.g. Aadhar Card)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 border-slate-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />

                                <div className="relative group border-2 border-dashed border-slate-200 p-6 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="text-slate-400" size={24} />
                                    <p className="text-xs font-bold text-slate-500">
                                        {file ? file.name : "Select File"}
                                    </p>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={18} />}
                                    {uploading ? "Uploading..." : "Save Document"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DIRECTORY */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="font-bold flex items-center gap-2 text-slate-700">
                                <Search size={16} /> Directory
                            </h2>
                        </div>

                        {loading ? (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-200" size={40} /></div>
                        ) : (
                            <div className="space-y-3">
                                {Object.values(grouped).map((group) => (
                                    <div key={group.user._id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                                        <div
                                            onClick={() => setOpenUser(openUser === group.user._id ? null : group.user._id)}
                                            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                                                    {group.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 leading-none">{group.user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{group.user.employeeId}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <span className="text-[10px] font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">{group.documents.length} Files</span>
                                                {openUser === group.user._id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                        </div>

                                        {openUser === group.user._id && (
                                            <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-2">
                                                {group.documents.map((doc) => (
                                                    <div key={doc._id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                                                <FileText size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700 leading-none">{doc.title}</p>
                                                                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-500 hover:underline mt-1 inline-block">Open Document</a>
                                                            </div>
                                                        </div>

                                                        {/* DELETE WITH PROGRESS */}
                                                        <button
                                                            onClick={() => setDeleteId({ id: doc._id, userId: group.user._id })}
                                                            disabled={deletingId === doc._id}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                                        >
                                                            {deletingId === doc._id ? (
                                                                <Loader2 className="animate-spin" size={16} />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {deleteId && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
                >
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">

                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                            Delete Document?
                        </h2>

                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete this document? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDelete(deleteId.id, deleteId.userId);
                                    setDeleteId(null); // ✅ CLOSE MODAL AFTER DELETE
                                }}
                                className="px-4 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                            >
                                Yes, Delete
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}