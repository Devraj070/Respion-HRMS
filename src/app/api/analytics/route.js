import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Attendance from "@/models/Attendance";
import Expense from "@/models/Expense";

export async function GET() {
    await connectToDatabase();

    try {
        // =========================
        // 📅 DATE SETUP
        // =========================

        // TODAY
        const startToday = new Date();
        startToday.setHours(0, 0, 0, 0);

        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);

        // YESTERDAY
        const startYesterday = new Date();
        startYesterday.setDate(startYesterday.getDate() - 1);
        startYesterday.setHours(0, 0, 0, 0);

        const endYesterday = new Date();
        endYesterday.setDate(endYesterday.getDate() - 1);
        endYesterday.setHours(23, 59, 59, 999);

        // =========================
        // 🕒 ATTENDANCE - TODAY
        // =========================
        const todayAttendance = await Attendance.find({
            date: { $gte: startToday, $lte: endToday }
        });

        const todayStats = {
            total: todayAttendance.length,
            present: todayAttendance.filter(a => a.status === "present").length,
            absent: todayAttendance.filter(a => a.status === "absent").length,
            halfDay: todayAttendance.filter(a => a.status === "half-day").length,
            late: todayAttendance.filter(a => a.isLate).length,
        };

        // =========================
        // 🕒 ATTENDANCE - YESTERDAY
        // =========================
        const yesterdayAttendance = await Attendance.find({
            date: { $gte: startYesterday, $lte: endYesterday }
        });

        const yesterdayStats = {
            total: yesterdayAttendance.length,
            present: yesterdayAttendance.filter(a => a.status === "present").length,
            absent: yesterdayAttendance.filter(a => a.status === "absent").length,
            halfDay: yesterdayAttendance.filter(a => a.status === "half-day").length,
            late: yesterdayAttendance.filter(a => a.isLate).length,
        };

        // =========================
        // 📊 ATTENDANCE - OVERALL
        // =========================
        const allAttendance = await Attendance.find();

        const overallStats = {
            total: allAttendance.length,
            present: allAttendance.filter(a => a.status === "present").length,
            absent: allAttendance.filter(a => a.status === "absent").length,
            halfDay: allAttendance.filter(a => a.status === "half-day").length,
            late: allAttendance.filter(a => a.isLate).length,
        };

        // =========================
        // 💰 EXPENSES - TODAY
        // =========================
        const todayExpenses = await Expense.find({
            date: { $gte: startToday, $lte: endToday }
        });

        const todayExpenseStats = {
            total: todayExpenses.length,
            totalAmount: todayExpenses.reduce((s, e) => s + (e.amount || 0), 0),
            pending: todayExpenses.filter(e => e.status === "pending").length,
            approved: todayExpenses.filter(e => e.status === "approved").length,
            rejected: todayExpenses.filter(e => e.status === "rejected").length,
            paid: todayExpenses.filter(e => e.status === "paid").length,
        };

        // =========================
        // 💰 EXPENSES - YESTERDAY
        // =========================
        const yesterdayExpenses = await Expense.find({
            date: { $gte: startYesterday, $lte: endYesterday }
        });

        const yesterdayExpenseStats = {
            total: yesterdayExpenses.length,
            totalAmount: yesterdayExpenses.reduce((s, e) => s + (e.amount || 0), 0),
            pending: yesterdayExpenses.filter(e => e.status === "pending").length,
            approved: yesterdayExpenses.filter(e => e.status === "approved").length,
            rejected: yesterdayExpenses.filter(e => e.status === "rejected").length,
            paid: yesterdayExpenses.filter(e => e.status === "paid").length,
        };

        // =========================
        // 💰 EXPENSES - OVERALL
        // =========================
        const allExpenses = await Expense.find();

        const overallExpenseStats = {
            total: allExpenses.length,
            totalAmount: allExpenses.reduce((s, e) => s + (e.amount || 0), 0),
        };

        // =========================
        // 🚀 RESPONSE
        // =========================
        return NextResponse.json({
            attendance: {
                today: todayStats,
                yesterday: yesterdayStats,
                overall: overallStats,
            },
            expenses: {
                today: todayExpenseStats,
                yesterday: yesterdayExpenseStats,
                overall: overallExpenseStats,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}