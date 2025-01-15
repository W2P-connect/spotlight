'use client'

import React from 'react'
import { logout } from './action'

export default function LogoutButon({ className }: { className: string }) {
    return (
        <button
            onClick={_ => {
                'use serveur'
                logout()
            }}
            className={className}
        >
            Logout
        </button>
    )
}
