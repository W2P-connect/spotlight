'use client'

import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import Checkbox from '@/app/ui/_components/_form/checkbox/Checkbox';


interface FormEmailProps {
    readOnly?: boolean
    formName?: string,
    label?: string,
    setter?: (email: string) => void,
    checkValidity?: boolean,
    setValidPassword?: (valid: boolean) => void,
}

export default function FormPassword({
    readOnly = false,
    formName = 'password',
    label = 'Password',
    checkValidity = false,
    setValidPassword = (valid: boolean) => { },
    setter = (email: string) => { },
}: FormEmailProps) {

    const [password, setPassword] = useState<string>('')
    const [okLength, setOkLength] = useState<boolean>(false);
    const [okSymbol, setOkSymbol] = useState<boolean>(false);
    const [okMaj, setOkMaj] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false)

    // Fonction de validation du mot de passe
    const validatePassword = (password: string) => {
        setOkLength(prv => password.length > 8)
        setOkMaj(prv => (/[A-Z]/.test(password)))
        setOkSymbol(prv => (/[!@#$%^&*(),.?":{}|<>]/.test(password)))
    }

    // Utiliser useEffect pour valider le mot de passe en temps réel
    useEffect(() => {
        if (checkValidity) {
            validatePassword(password);
        }
    }, [password, checkValidity]);

    useEffect(() => {
        setValidPassword(okLength && okSymbol && okMaj)
    }, [okLength, okSymbol, okMaj, setValidPassword])

    const passwordCheck = [
        {
            id: 1,
            value: okLength,
            label: 'At least 8 characters'
        },
        {
            id: 2,
            value: okSymbol,
            label: 'Include a symbol'
        },
        {
            id: 3,
            value: okMaj,
            label: 'Contain one uppercase letter'
        },
    ]
    useEffect(() => {
        setter(password)
    }, [password, setter])

    return (

        <div className='w-full'>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    value={password}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    id="password"
                    name={formName}
                    readOnly={readOnly}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="YouShall_#notPass"
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                <div
                    onClick={_ => setShowPassword(prv => !prv)}
                    className="cursor-pointer z-10 pointer-events-auto absolute inset-y-0 right-3 flex items-center pl-3"
                >
                    {showPassword
                        ? <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        : <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    }
                </div>

            </div>
            {checkValidity
                ? < div className='pt-2'>
                    {passwordCheck.map(check =>
                        <div
                            key={check.id}
                            className='mb-1'
                        >
                            <Checkbox
                                label={<div className='text-gray-400 text-xs'>{check.label}</div>}
                                checked={check.value}
                            />
                        </div>
                    )}
                </div >
                : null
            }
        </div>
    )

}