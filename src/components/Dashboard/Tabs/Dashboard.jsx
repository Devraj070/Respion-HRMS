'use client';
import { useState } from "react";
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    IndianRupee,
    Plus,
    Calendar,
    ChevronRight
} from "lucide-react";

export default function Dashboard() {
    const [showMore, setShowMore] = useState(false);

    const stats = {
        totalEmployees: 120,
        present: 95,
        absent: 15,
        leave: 10,
        payroll: 450000
    };

    const employees = [
        { name: "Rahul Sharma", role: "Developer", status: "Present" },
        { name: "Priya Das", role: "HR", status: "Leave" },
        { name: "Amit Kumar", role: "Designer", status: "Absent" },
        { name: "Sneha Patra", role: "Manager", status: "Present" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">HRMS Dashboard</h1>

                <div className="flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow">
                        <Plus size={16} /> Add Employee
                    </button>

                    <button className="bg-white border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                        <Calendar size={16} /> Mark Attendance
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-5 gap-4 mb-8">
                <Card icon={<Users />} title="Employees" value={stats.totalEmployees} />
                <Card icon={<CheckCircle />} title="Present" value={stats.present} color="text-green-600" />
                <Card icon={<XCircle />} title="Absent" value={stats.absent} color="text-red-600" />
                <Card icon={<Clock />} title="On Leave" value={stats.leave} color="text-yellow-600" />
                <Card icon={<IndianRupee />} title="Payroll" value={`₹${stats.payroll}`} />
            </div>

            {/* Main Section */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Attendance */}
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-medium mb-4">Today's Attendance</h2>

                    <div className="space-y-3">
                        {employees.map((emp, i) => (
                            <div key={i} className="flex justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{emp.name}</p>
                                    <p className="text-xs text-gray-500">{emp.role}</p>
                                </div>

                                <span className={`text-sm font-medium ${emp.status === "Present"
                                        ? "text-green-600"
                                        : emp.status === "Absent"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                    }`}>
                                    {emp.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="mt-4 text-sm text-blue-600 flex items-center gap-1"
                    >
                        View More <ChevronRight size={16} />
                    </button>
                </div>

                {/* Analytics */}
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-medium mb-4">Attendance Overview</h2>

                    <Progress label="Present" value={80} color="bg-green-500" />
                    <Progress label="Absent" value={12} color="bg-red-500" />
                    <Progress label="Leave" value={8} color="bg-yellow-500" />
                </div>
            </div>

            {/* Expand */}
            {showMore && (
                <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-medium mb-4">Detailed Records</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                                Employee #{i + 1} - Present
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Card({ icon, title, value, color }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
                {icon} {title}
            </div>
            <h2 className={`text-2xl font-bold ${color || ""}`}>{value}</h2>
        </div>
    );
}

function Progress({ label, value, color }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded">
                <div className={`${color} h-2 rounded`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}