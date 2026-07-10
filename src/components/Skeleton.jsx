import React from "react";

export const SidebarSkeleton = () => (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-5 space-y-6 shrink-0 h-screen">
        <div className="h-10 bg-slate-800 rounded-xl w-3/4 animate-pulse"></div>
        <div className="space-y-3 flex-1">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-800 rounded-xl w-full animate-pulse"></div>
            ))}
        </div>
    </div>
);

export const TopbarSkeleton = () => (
    <div className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between w-full">
        <div className="h-5 bg-slate-100 rounded-full w-24 animate-pulse"></div>
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded-full w-20 animate-pulse"></div>
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="p-4 md:p-8 space-y-8 bg-[#FDFDFF] min-h-screen">
        {/* Sticky Header Skeleton */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-24 animate-pulse"></div>
                </div>
            </div>
            <div className="h-9 bg-slate-100 rounded-xl w-28 animate-pulse"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 p-4 md:p-5 rounded-2xl md:rounded-3xl space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse"></div>
                        <div className="h-6 bg-slate-200 rounded-full w-10 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full w-16 animate-pulse"></div>
                </div>
            ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
            </div>
            <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2 border-b border-slate-50 last:border-none last:pb-0">
                        <div className="flex items-center gap-3 w-full md:w-1/3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                            <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                        <div className="space-y-1.5 w-full md:w-1/4">
                            <div className="h-4 bg-slate-200 rounded-md w-20 animate-pulse"></div>
                            <div className="h-3 bg-slate-100 rounded-md w-32 animate-pulse"></div>
                        </div>
                        <div className="space-y-1.5 w-full md:w-1/4">
                            <div className="h-4 bg-slate-200 rounded-md w-20 animate-pulse"></div>
                            <div className="h-3 bg-slate-100 rounded-md w-32 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const LayoutSkeleton = () => (
    <div className="flex min-h-screen bg-gray-100 w-full">
        <SidebarSkeleton />
        <main className="flex-1 flex flex-col">
            <TopbarSkeleton />
            <div className="flex-1 overflow-y-auto">
                <DashboardSkeleton />
            </div>
        </main>
    </div>
);

export const LoginSkeleton = () => (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans w-full">
        {/* Left Visual Section */}
        <div className="relative w-full h-64 lg:h-auto lg:w-1/2 bg-indigo-900 flex flex-col justify-center p-8 lg:p-16">
            <div className="h-10 bg-indigo-800 rounded-xl w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-indigo-800 rounded-full w-72 animate-pulse"></div>
        </div>
        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-20">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center lg:text-left">
                    <div className="h-8 bg-slate-200 rounded-md w-32 mx-auto lg:mx-0 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded-md w-48 mx-auto lg:mx-0 animate-pulse"></div>
                </div>
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full w-20 animate-pulse"></div>
                        <div className="h-12 bg-slate-50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full w-20 animate-pulse"></div>
                        <div className="h-12 bg-slate-50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                    <div className="h-12 bg-slate-200 rounded-2xl w-full animate-pulse pt-2"></div>
                </div>
            </div>
        </div>
    </div>
);

export const ProfileOverviewSkeleton = () => (
    <div className="max-w-full mx-auto p-0 md:p-0 space-y-8 bg-gray-50 min-h-screen">
        {/* Profile Header */}
        <div className="flex flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-b-3xl shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-300 rounded-md w-32 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-24 animate-pulse"></div>
                </div>
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 pb-8">
            {/* Notice Alert */}
            <div className="h-12 bg-white rounded-2xl w-full animate-pulse border border-slate-100"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attendance Circle */}
                <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center space-y-6">
                    <div className="h-4 bg-slate-200 rounded-md w-28 animate-pulse"></div>
                    <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                        <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-slate-50 h-12 rounded-xl w-full animate-pulse"></div>
                </div>

                {/* Quick Actions & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3 animate-pulse">
                                <div className="h-10 w-10 bg-slate-200 rounded-2xl"></div>
                                <div className="h-3 bg-slate-200 rounded-full w-16"></div>
                            </div>
                        ))}
                    </div>

                    {/* Details Panel */}
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-6 space-y-6 border border-slate-100">
                        <div className="h-4 bg-slate-300 rounded-md w-32 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-2.5 bg-slate-200 rounded-full w-20 animate-pulse"></div>
                                    <div className="h-4 bg-slate-300 rounded-md w-40 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="w-full">
        {/* Desktop View */}
        <div className="hidden md:block bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/10">
                            {[...Array(5)].map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className="h-3 bg-slate-300 rounded-full w-20 animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {[...Array(rows)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col space-y-2">
                                        <div className="h-4 bg-slate-200 rounded-md w-28 animate-pulse"></div>
                                        <div className="h-3 bg-slate-100 rounded-md w-24 animate-pulse"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-slate-200 rounded-md w-20 animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <div className="h-4 bg-slate-200 rounded-md w-12 animate-pulse"></div>
                                        <div className="h-4 bg-slate-200 rounded-md w-12 animate-pulse"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-slate-200 rounded-md w-24 animate-pulse"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded-md w-28"></div>
                            <div className="h-3 bg-slate-150 rounded-md w-16"></div>
                        </div>
                        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded-full w-12"></div>
                            <div className="h-4 bg-slate-300 rounded-md w-16"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded-full w-12"></div>
                            <div className="h-4 bg-slate-300 rounded-md w-16"></div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
                        <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const CardListSkeleton = ({ count = 3 }) => (
    <div className="space-y-3 w-full">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center justify-between gap-4 animate-pulse shadow-sm">
                <div className="flex items-center gap-4 w-3/4">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0"></div>
                    <div className="space-y-2 w-full">
                        <div className="h-4 bg-slate-300 rounded-md w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-12 bg-slate-100 rounded-full"></div>
                </div>
            </div>
        ))}
    </div>
);

export const FormSkeleton = () => (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 w-full">
        {/* Preview Panel Skeleton */}
        <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-slate-200 rounded-md w-32 animate-pulse"></div>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-24 bg-slate-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                    <div className="w-20 h-20 bg-slate-300 rounded-2xl border-4 border-white -mt-16 animate-pulse"></div>
                    <div className="h-5 bg-slate-300 rounded-md w-40 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded-full w-full animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded-full w-2/3 animate-pulse"></div>
                </div>
            </div>
        </div>
        {/* Form Panel Skeleton */}
        <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="h-5 bg-slate-300 rounded-md w-36 animate-pulse"></div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full w-24 animate-pulse"></div>
                        <div className="h-11 bg-slate-50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full w-24 animate-pulse"></div>
                        <div className="h-24 bg-slate-50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                    <div className="h-11 bg-slate-200 rounded-2xl w-32 animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
);
