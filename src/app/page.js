
"use client";

import React, { Suspense, useState } from "react";
import AdminPage from "./MainClient";
import LottieWelcomeAnimation from "@/Animations/Welcome";
import PWAInstallModal from "@/lib/PWAInstallModal";

export default function Page() {
  const [installed, setInstalled] = useState(false);

  return (
    <>
      {!installed && (
        <PWAInstallModal onInstalled={() => setInstalled(true)} />
      )}

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <LottieWelcomeAnimation />
          </div>
        }
      >
        <AdminPage />
      </Suspense>
    </>
  );
}