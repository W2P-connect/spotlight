'use client'

import { classNames } from '@/utils/helpers';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';


interface FormEmailProps {
    readOnly?: boolean
    formName?: string,
    placeholder?: string,
    label?: string,
    defaultEmail?: string,
    required?: boolean,
    setter?: (email: string) => void
}

/**
 * 
 * @param readOnly default false 
 * @param formName default 'email' 
 * @param defaultEmail default '' 
 * @param required default false 
 * @param setter default if you want to catch email value from parent'() => void' 
 * @returns 
 */

export default function FormEmail({
    readOnly = false,
    formName = 'email',
    label = 'Email',
    defaultEmail = '',
    placeholder = 'you@example.com',
    required = false,
    setter = (email: string) => { }
}: FormEmailProps) {

    const [email, setEmail] = useState<string>(defaultEmail)

    useEffect(() => {
        setter(email)
    }, [email, setter])

    useEffect(() => {
        if (defaultEmail) {
            setEmail(defaultEmail)
        }
    }, [defaultEmail])


    return (

        <div className='w-full'>
            {label
                ? <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
                : null
            }
            <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="email"
                    name={formName}
                    id="email"
                    readOnly={readOnly}
                    onChange={e => setEmail(_ => e.target.value)}
                    value={email}
                    className={classNames(
                        "block w-full rounded-md border-0 py-1.5 pl-10 text-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                        readOnly ? 'cursor-not-allowed bg-gray-100' : ''
                    )}
                    required={required}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )

}