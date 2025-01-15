'use client'

import React, { useState } from 'react';
import MainButton from "@/app/ui/_components/buttons/MainButton"
import { signup } from './action'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Customer } from '@prisma/client';
import FormEmail from '../../_form/email/FormEmail';
import PasswordsSection from '../../_form/passwords/PasswordSection';
import { linkHelper } from 'constantes';

export function RegisterCustomer({ customer }: { customer: Customer }) {

    const searchParams = useSearchParams()
    const currentPath = usePathname()
    const router = useRouter()
    const message = searchParams.get('message')


    const [okSame, setOkSame] = useState<boolean>(true);
    const [validPassword, setValidPassword] = useState<boolean>(true);

    return (
        <div className="max-w-sm lg:max-w-96 px-4 py-4">
            {
                customer
                    ? <form
                        action={async (formData) => {

                            const password = formData.get("password")
                            const password2 = formData.get("password-2")

                            setOkSame(true)

                            if (password && password === password2) {
                                const response = await signup(formData)
                                response.success
                                    ? router.push(linkHelper.account.link)
                                    : router.push(`${currentPath}?message=${response.message}&${searchParams.toString()}`)
                            } else {
                                setOkSame(false)
                            }
                        }}>
                        <div className="mb-6">
                            <FormEmail
                                defaultEmail={customer.email ?? ''}
                                readOnly={customer.email ? true : false}
                                formName='email'
                            />
                        </div>

                        <input
                            name="customer-id"
                            id="customer-id"
                            defaultValue={`${customer.id}`}
                            className="hidden"
                        />
                        <input
                            name="currentPath"
                            id="customer-id"
                            defaultValue={`${customer.id}`}
                            className="hidden"
                        />

                        <PasswordsSection
                            areSamePasswords={okSame}
                            setValidPassword={setValidPassword}
                        />

                        {message
                            ? <p className="py-2 text-red-500 text-sm text-center">
                                {message}
                            </p>
                            : null
                        }

                        < div className="mt-4 w-full">
                            <MainButton
                                type="submit"
                                className="w-full"
                                disabled={!validPassword}
                                style={2}
                            >
                                Register
                            </MainButton>
                        </div>
                    </form>
                    : <div>To complete your registration, we kindly ask that you make a purchase first.</div>
            }
        </div >
    )
}