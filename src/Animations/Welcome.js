"use client";

import Lottie from "lottie-react";
import animationData from "@/lottie/Welcome.json"; // your file

export default function LottieWelcomeAnimation() {
    return (
        <div style={{ width: 300, height: 300 }}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}