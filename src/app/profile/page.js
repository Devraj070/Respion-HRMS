import React from 'react'
import ProfilePage from './ClientSide'
import { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback="Loading...">
            <ProfilePage />
        </Suspense>
    )
}

export default page