'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const ressetPassword = async (code: string | null, newPassword: string, redirectPath: string) => {

    const errorMessage = {
        message: "",
        description: '',
    }

    const supabase = createClient()

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            if (error?.status && (error.status === 422 || error.status === 404)) {
                errorMessage.message = 'Invalid code.'
                errorMessage.description = "Your code has expired."
            } else {
                errorMessage.message = 'An error occurred.';
                errorMessage.description = 'Your password reset code does not appear to be valid.';
            }
        }
    }

    const { error, data } = await supabase.auth.updateUser({ password: newPassword })


    if (error) {
        redirect(`${redirectPath}?error=${error.message ?? "Password update failed"}`)
    } else {
        redirect(`${redirectPath}?message=Password updated&message_description=You can now access to your account`)
    }
}