'use client'

import React, { useState } from 'react';
import FormEmail from '../../_form/email/FormEmail';
import PasswordsSection from '../../_form/passwords/PasswordSection';
import { User } from '@supabase/supabase-js';
import { ressetPassword } from './actions';
import MainButton from '../../buttons/MainButton';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ResetPassword() {

    const [okSame, setOkSame] = useState<boolean>(true);
    const [validPassword, setValidPassword] = useState<boolean>(true);

    const currentPath = usePathname()
    const searchParams = useSearchParams()

    const code = searchParams.get("code")

    return (
        <form
            className="mx-auto my-30 px-4 py-24 w-full lg:w-96 max-w-sm"
            action={async (formData) => {

                const password = formData.get("password") as string
                const password2 = formData.get("password-2") as string
                setOkSame(true)

                if (password && password === password2) {
                    await ressetPassword(code, password, currentPath)
                } else {
                    setOkSame(false)
                }
            }}
        >
            <PasswordsSection
                setValidPassword={setValidPassword}
                areSamePasswords={okSame}
            />

            <div className="mt-4 w-full">
                <MainButton
                    type="submit"
                    className="w-full"
                    disabled={!validPassword}
                >
                    Reset password
                </MainButton>
            </div>
        </form>
    )

}