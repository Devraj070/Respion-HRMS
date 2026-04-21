"use client";
import React, { useEffect, useState } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
);
const ChevronIcon = ({ open }) => (
    <svg className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180 text-indigo-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);
const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SearchIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
    </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLE_STYLES = {
    admin: { badge: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
    hr: { badge: "bg-sky-100 text-sky-700 border-sky-200", dot: "bg-sky-500" },
    employee: { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};
const AVATAR_COLORS = [
    "from-violet-500 to-indigo-600",
    "from-sky-400 to-blue-600",
    "from-emerald-400 to-teal-600",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-600",
];

const initialFormState = {
    name: "", email: "", password: "", role: "employee",
    employeeId: "", designation: "", department: "", phone: "", address: "",
    joiningDate: "",
    emergencyContact: { name: "", phone: "" },
    bankDetails: { accountNumber: "", ifsc: "", bankName: "" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const InputField = ({ label, required, ...props }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
            required={required}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
            {...props}
        />
    </div>
);

const SectionHeading = ({ children }) => (
    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="flex-1 h-px bg-gray-100" />
        {children}
        <span className="flex-1 h-px bg-gray-100" />
    </h3>
);

function ConfirmDialog({ emp, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                    <TrashIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Remove Employee</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-800">{emp.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm font-medium text-white transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function EmployeeModal({ mode, form, departments, onChange, onNestedChange, onSubmit, onClose, isSubmitting }) {
    const title = mode === "add" ? "Add New Employee" : "Edit Employee";
    const btnLabel = mode === "add" ? "Save Employee" : "Update Employee";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-5 sm:px-7 py-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">{mode === "add" ? "New Member" : "Update Record"}</p>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-5 sm:px-7 py-6 space-y-7">
                    <form id="employeeForm" onSubmit={onSubmit}>

                        {/* Personal Info */}
                        <SectionHeading>Personal Information</SectionHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <InputField label="Full Name" name="name" value={form.name} onChange={onChange} required />
                            <InputField label="Email Address" type="email" name="email" value={form.email} onChange={onChange} required />
                            <InputField label="Phone Number" name="phone" value={form.phone} onChange={onChange} />
                            <InputField
                                label="Password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                required={mode === "add"}   // ✅ only required on add
                                placeholder={mode === "edit" ? "Leave blank to keep current password" : ""}
                            />
                            <div className="sm:col-span-2">
                                <InputField label="Residential Address" name="address" value={form.address} onChange={onChange} />
                            </div>
                        </div>

                        {/* Employment */}
                        <div className="mt-7">
                            <SectionHeading>Employment Details</SectionHeading>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <InputField label="Employee ID" name="employeeId" value={form.employeeId} onChange={onChange} required />
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">System Role <span className="text-rose-500">*</span></label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={onChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="hr">HR</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <InputField label="Job Designation" name="designation" value={form.designation} onChange={onChange} />
                                <InputField label="Joining Date" type="date" name="joiningDate" value={form.joiningDate} onChange={onChange} />
                            </div>
                        </div>
                        <div className="mt-7">
                            {/* <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"> */}
                            <SectionHeading>Department</SectionHeading>
                            {/* </label> */}

                            <select
                                name="department"
                                value={form.department || ""}
                                onChange={onChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Department</option>

                                {departments?.length > 0 ? (
                                    departments.map(dep => (
                                        <option key={dep._id} value={dep._id}>
                                            {dep.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No departments found. Create new department in "Department" tab</option>
                                )}
                            </select>
                        </div>
                        {/* Emergency & Bank */}
                        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <SectionHeading>Emergency Contact</SectionHeading>
                                <div className="space-y-4 mt-4">
                                    <InputField
                                        label="Contact Name"
                                        value={form.emergencyContact.name}
                                        onChange={e => onNestedChange("emergencyContact", "name", e.target.value)}
                                    />
                                    <InputField
                                        label="Contact Phone"
                                        value={form.emergencyContact.phone}
                                        onChange={e => onNestedChange("emergencyContact", "phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <SectionHeading>Bank Details</SectionHeading>
                                <div className="space-y-4 mt-4">
                                    <InputField
                                        label="Bank Name"
                                        value={form.bankDetails.bankName}
                                        onChange={e => onNestedChange("bankDetails", "bankName", e.target.value)}
                                    />
                                    <InputField
                                        label="Account Number"
                                        value={form.bankDetails.accountNumber}
                                        onChange={e => onNestedChange("bankDetails", "accountNumber", e.target.value)}
                                    />
                                    <InputField
                                        label="IFSC Code"
                                        // className="uppercase"
                                        value={form.bankDetails.ifsc}
                                        onChange={e => onNestedChange("bankDetails", "ifsc", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50/80 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="employeeForm"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm shadow-indigo-200"
                    >
                        {isSubmitting ? "Saving…" : btnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
    const [form, setForm] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [expandedId, setExpandedId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // emp object
    const [departments, setDepartments] = useState([]);
    // ── API Helpers ──────────────────────────────────────────────────────────
    const apiFetch = (path, opts = {}) =>
        fetch(path, {
            ...opts,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                ...(opts.headers || {}),
            },
        }).then(r => r.json());

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch("/api/employees");
            if (data.success) setEmployees(data.data);
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchDepartments = async () => {
        try {
            const res = await apiFetch("/api/departments");
            if (res.success) setDepartments(res.data);
        } catch (err) {
            console.error("Department fetch failed:", err);
        }
    };

    useEffect(() => { fetchEmployees(); fetchDepartments() }, []);

    // ── Form Handlers ────────────────────────────────────────────────────────
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };
    const handleNested = (cat, field, value) => {
        setForm(p => ({ ...p, [cat]: { ...p[cat], [field]: value } }));
    };

    const openAdd = () => {
        setForm(initialFormState);
        setEditingId(null);
        setModalMode("add");
    };

    const openEdit = (emp, e) => {
        e.stopPropagation();
        setForm({
            name: emp.name || "",
            email: emp.email || "",
            password: "",
            role: emp.role || "employee",
            employeeId: emp.employeeId || "",
            designation: emp.designation || "",
            department: emp.department?._id || emp.department || "",
            phone: emp.phone || "",
            address: emp.address || "",
            joiningDate: emp.joiningDate ? emp.joiningDate.slice(0, 10) : "",
            emergencyContact: emp.emergencyContact || { name: "", phone: "" },
            bankDetails: emp.bankDetails || { accountNumber: "", ifsc: "", bankName: "" },
        });
        setEditingId(emp._id);
        setModalMode("edit");
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const isEdit = modalMode === "edit";
            const payload = { ...form };
            if (isEdit && !payload.password) delete payload.password;

            const data = await apiFetch(
                isEdit ? `/api/employees/${editingId}` : "/api/employees",
                { method: isEdit ? "PUT" : "POST", body: JSON.stringify(payload) }
            );
            if (data.success) {
                setModalMode(null);
                fetchEmployees();
            } else {
                alert(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Submit failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const data = await apiFetch(`/api/employees/${deleteTarget._id}`, { method: "DELETE" });
            if (data.success) {
                setDeleteTarget(null);
                if (expandedId === deleteTarget._id) setExpandedId(null);
                fetchEmployees();
            } else {
                alert(data.message || "Delete failed.");
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    // ── Derived Data ─────────────────────────────────────────────────────────
    const filtered = employees.filter(emp => {
        const matchRole = filterRole === "all" || emp.role === filterRole;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            emp.name.toLowerCase().includes(q) ||
            emp.email.toLowerCase().includes(q) ||
            (emp.designation || "").toLowerCase().includes(q) ||
            (emp.employeeId || "").toLowerCase().includes(q);
        return matchRole && matchSearch;
    });

    const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

    const getRoleStyle = role => ROLE_STYLES[role?.toLowerCase()] || ROLE_STYLES.employee;

    const stats = {
        total: employees.length,
        admin: employees.filter(e => e.role === "admin").length,
        hr: employees.filter(e => e.role === "hr").length,
        employee: employees.filter(e => e.role === "employee").length,
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-9xl mx-auto px-2 ">

                {/* ── Header ── */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your organization's workforce and details.</p>
                </div>
                {/* ── Top Bar (Search + Add) ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-5">

                    {/* Search */}
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchIcon />
                        </span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search employees..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-blue-200 text-sm outline-none transition-all"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={openAdd}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5  font-semibold text-sm transition-all shadow-sm whitespace-nowrap border border-indigo-800"
                    >
                        <PlusIcon />
                        Add Employee
                    </button>

                </div>





                {/* ── Table / Cards ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-blue-950 border-b border-gray-100">
                                <tr>
                                    {["Employee", "ID", "Dept", "Role ", "Contact", "Joining Date", "Status", "Actions"].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-gray-50 uppercase tracking-widest whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                                            <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center text-gray-400 text-sm">
                                            {search || filterRole !== "all" ? "No results match your search." : "No employees yet. Add one to get started."}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(emp => (
                                        <React.Fragment key={emp._id}>
                                            <tr
                                                onClick={() => setExpandedId(expandedId === emp._id ? null : emp._id)}
                                                className={`cursor-pointer transition-colors hover:bg-indigo-50/40 ${expandedId === emp._id ? "bg-indigo-50/60" : ""}`}
                                            >
                                                {/* Employee */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(emp.name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                                            {emp.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
                                                            <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-xs text-gray-950 mt-0.5">{emp.employeeId || "—"}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {emp.department?.name || "—"}
                                                    </p>
                                                </td>
                                                {/* Role / ID */}
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{emp.designation || "—"}</p>

                                                </td>
                                                {/* Contact */}
                                                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{emp.phone || "—"}</td>
                                                {/* Date */}
                                                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                                </td>
                                                {/* Badge */}
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleStyle(emp.role).badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${getRoleStyle(emp.role).dot}`} />
                                                        {emp.role?.toUpperCase()}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                        <button
                                                            onClick={e => openEdit(emp, e)}
                                                            title="Edit"
                                                            className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors bg-amber-200/50"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setDeleteTarget(emp); }}
                                                            title="Delete"
                                                            className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors bg-red-400/10"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 bg-green-200/50" onClick={() => setExpandedId(expandedId === emp._id ? null : emp._id)}>
                                                            <ChevronIcon open={expandedId === emp._id} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Details */}
                                            {expandedId === emp._id && (
                                                <tr className="bg-indigo-50/30">
                                                    <td colSpan="6" className="px-5 pb-5 pt-2">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            {[
                                                                {
                                                                    title: "Address",
                                                                    content: (
                                                                        <p className="text-sm text-gray-700">{emp.address || "No address on record."}</p>
                                                                    )
                                                                },
                                                                {
                                                                    title: "Emergency Contact",
                                                                    content: (
                                                                        <div className="space-y-1 text-sm">
                                                                            <p><span className="text-gray-400">Name: </span><span className="font-medium text-gray-800">{emp.emergencyContact?.name || "—"}</span></p>
                                                                            <p><span className="text-gray-400">Phone: </span><span className="font-medium text-gray-800">{emp.emergencyContact?.phone || "—"}</span></p>
                                                                        </div>
                                                                    )
                                                                },
                                                                {
                                                                    title: "Bank Information",
                                                                    content: (
                                                                        <div className="space-y-1 text-sm">
                                                                            <p><span className="text-gray-400">Bank: </span><span className="font-medium text-gray-800">{emp.bankDetails?.bankName || "—"}</span></p>
                                                                            <p><span className="text-gray-400">A/C: </span><span className="font-medium text-gray-800">{emp.bankDetails?.accountNumber || "—"}</span></p>
                                                                            <p><span className="text-gray-400">IFSC: </span><span className="font-mono font-medium text-gray-800 uppercase">{emp.bankDetails?.ifsc || "—"}</span></p>
                                                                        </div>
                                                                    )
                                                                }
                                                            ].map(card => (
                                                                <div key={card.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">{card.title}</p>
                                                                    {card.content}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-400 animate-pulse text-sm">Loading team data…</div>
                        ) : filtered.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 text-sm">No employees found.</div>
                        ) : (
                            filtered.map(emp => (
                                <div key={emp._id} className="p-4">
                                    {/* Card Header */}
                                    <div className="flex items-start gap-3">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColor(emp.name)} flex items-center justify-center text-white font-bold text-base shrink-0`}>
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{emp.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                                </div>
                                                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleStyle(emp.role).badge}`}>
                                                    {emp.role?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                                                {emp.designation && <p className="text-xs text-gray-500">{emp.designation}</p>}
                                                {emp.phone && <p className="text-xs text-gray-500">{emp.phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={e => openEdit(emp, e)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                            >
                                                <EditIcon /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(emp)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                            >
                                                <TrashIcon /> Delete
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setExpandedId(expandedId === emp._id ? null : emp._id)}
                                            className="flex items-center gap-1 text-xs text-gray-400 font-medium"
                                        >
                                            {expandedId === emp._id ? "Hide" : "More"} <ChevronIcon open={expandedId === emp._id} />
                                        </button>
                                    </div>

                                    {/* Mobile Expanded */}
                                    {expandedId === emp._id && (
                                        <div className="mt-3 grid grid-cols-1 gap-3">
                                            {emp.address && (
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
                                                    <p className="text-sm text-gray-700">{emp.address}</p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Emergency</p>
                                                    <p className="text-xs text-gray-700">{emp.emergencyContact?.name || "—"}</p>
                                                    <p className="text-xs text-gray-500">{emp.emergencyContact?.phone || "—"}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bank</p>
                                                    <p className="text-xs text-gray-700">{emp.bankDetails?.bankName || "—"}</p>
                                                    <p className="text-xs font-mono text-gray-500 uppercase">{emp.bankDetails?.ifsc || "—"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer count */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-blue-950 text-right">
                            Showing {filtered.length} of {employees.length} employees
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}
            {modalMode && (
                <EmployeeModal
                    mode={modalMode}
                    form={form}
                    departments={departments}
                    onChange={handleChange}
                    onNestedChange={handleNested}
                    onSubmit={handleSubmit}
                    onClose={() => setModalMode(null)}
                    isSubmitting={isSubmitting}
                />
            )}
            {deleteTarget && (
                <ConfirmDialog
                    emp={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}