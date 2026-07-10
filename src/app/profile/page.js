import React from 'react'
import ProfilePage from './ClientSide'
import { Suspense } from 'react'
import { LayoutSkeleton } from '@/components/Skeleton'

const page = () => {
    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <ProfilePage />
        </Suspense>
    )
}

export default page