'use server'

import { createClient } from '@/utils/supabase/server'
import { createOrRetrieveCustomer } from '@/utils/supabase/admin'
import { logError } from '@/lib/logger'
import { linkHelper } from 'constantes'

export async function signup(formData: FormData) {


    try {

        const response = {
            success: true,
            message: "Success",
        }
        const supabase = createClient()
        const customerId = formData.get('customer-id') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        console.log(customerId, email, password);

        const toSend = {
            email: email,
            password: password,
        }

        const { data, error } = await supabase.auth.signUp(toSend)

        await createOrRetrieveCustomer(customerId, email, data.user?.id)

        if (error) {
            response.success = false
            response.message = getMessageFromCode(error?.code)
        } else {
            response.success = true
            response.message = "User signed Up !"
        }
        return response

    } catch (error: unknown) {
        if (error instanceof Error) {
            await logError({
                error,
                component: 'signup',
                user_id: null,
                metadata: {
                    formData,
                }
            });
        }
        console.error('signup', error);
        return {
            success: false,
            message: "Unknow error, you may contact us !"
        }
    }
}

interface MessageMap {
    [code: string]: string;
}

const getMessageFromCode = (code: string | undefined): string => {


    const messageFromCode: MessageMap = {
        'weak_password': "Your passeword is not strong enough",
        "user_already_exists": `This email is already in use, try signing`
    }

    if (code && !messageFromCode[code]) {
        console.log("-> Uknown code", code);
    }
    return code
        ? messageFromCode[code]
            ? messageFromCode[code]
            : "Uknown error"
        : "Uknown error"
}