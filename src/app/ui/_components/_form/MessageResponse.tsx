'use client'
import { classNames } from '@/utils/helpers'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function MessageResponse({ formKey }: { formKey: string }) {

    const params = useSearchParams()

    const status = params.get("status") === "success"
        ? true
        : false
    const status_description = params.get("status_description")
    const key = params.get("key")

    return formKey === key
        ? (
            <div className={
                classNames(
                    "block text-sm font-medium leading-6",
                    status ? "text-darkPurple" : "text-red-700"
                )
            }>
                {status_description}
            </div>
        )
        : null
}
