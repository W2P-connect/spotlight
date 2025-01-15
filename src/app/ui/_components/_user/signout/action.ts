'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {

    const supabase = createClient()

    const response = await supabase.auth.signOut()

    if (!response.error) {
        redirect('/')
    }

}