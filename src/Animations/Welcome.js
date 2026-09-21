"use client";

export default function LottieWelcomeAnimation() {
    return (
        <div className="flex flex-col items-center justify-center select-none">
            <style>{`
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50%       { opacity: 1;   transform: scale(1.2); }
                }
                .welcome-word {
                    display: inline-block;
                    animation: fadeInUp 0.7s ease forwards;
                    opacity: 0;
                }
                .welcome-word:nth-child(1) { animation-delay: 0.1s; }
                .welcome-word:nth-child(2) { animation-delay: 0.4s; }
                .welcome-word:nth-child(3) { animation-delay: 0.7s; }

                .respion-text {
                    background: linear-gradient(
                        90deg,
                        #1e40af 0%,
                        #3b82f6 30%,
                        #93c5fd 50%,
                        #3b82f6 70%,
                        #1e40af 100%
                    );
                    background-size: 800px 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: fadeInUp 0.7s ease 0.7s forwards, shimmer 2.2s linear 1.2s infinite;
                    opacity: 0;
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #3b82f6;
                    animation: pulse-dot 1.2s ease-in-out infinite;
                }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>

            {/* Animated text */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-gray-800 flex gap-2 sm:gap-3 flex-wrap justify-center px-4 text-center">
                <span className="welcome-word">Welcome</span>
                <span className="welcome-word">To</span>
                <span className="welcome-word respion-text">RESPION</span>
            </h1>

            {/* Bouncing dots loader */}
            <div className="flex gap-2 mt-6">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
            </div>
        </div>
    );
}