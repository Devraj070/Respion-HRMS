// /models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Auth
    name: String,
    email: { type: String, unique: true },
    password: String,

    // Role System
    role: {
        type: String,
        enum: ["admin", "hr", "employee"],
        default: "employee"
    },

    // Employee Info (for HRMS)
    employeeId: String,

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },

    designation: String,

    joiningDate: Date,

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    // Personal Info
    phone: String,
    address: String,

    emergencyContact: {
        name: String,
        phone: String
    },

    bankDetails: {
        accountNumber: String,
        ifsc: String,
        bankName: String,
        upiId: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);