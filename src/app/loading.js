"use client";

import LottieWelcomeAnimation from "@/Animations/Welcome";

export default function Loader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <LottieWelcomeAnimation />
        </div>
    );
}
