import React from 'react'
import ProfilePage from './ClientSide'
import { Suspense } from 'react'
import LottieWelcomeAnimation from '@/Animations/Welcome'

const page = () => {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gray-100">
                    <LottieWelcomeAnimation />
                </div>
            }
        >
            <ProfilePage />
        </Suspense>
    )
}

export default page