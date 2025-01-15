'use client'

import MainButton from "@/app/ui/_components/buttons/MainButton"
import { signin } from './action'
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import FormEmail from "../../_form/email/FormEmail"
import FormPassword from "../../_form/passwords/FormPassword"
import { linkHelper } from "constantes"

export function SignIn() {

    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    return (
        <div className="px-4 py-4 w-full max-w-sm lg:max-w-96">
            <form
                action={async (formData) => {
                    await signin(formData)
                }}
            >
                <div className="mb-6">
                    <FormEmail
                        readOnly={false}
                        formName="email"
                    />
                </div>

                <div className="mb-6">
                    <FormPassword
                        formName="password"
                    />
                    {message && (
                        <p className="py-2 text-center text-red-500 text-sm">
                            {message}
                        </p>
                    )}
                    <div className="text-right mt-2 text-gray-500 text-xs">
                        <Link href={linkHelper.resetPassword.link}>
                            Forgot password
                        </Link>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <MainButton
                        type="submit"
                        className="w-full"
                        style={2}
                    >
                        Sign in
                    </MainButton>
                </div>
            </form>
        </div>
    )
}