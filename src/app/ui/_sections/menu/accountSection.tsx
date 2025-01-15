import Link from 'next/link';
import React from 'react'
import MainButton from '@/app/ui/_components/buttons/MainButton';
import { User } from '@supabase/supabase-js';
import UltimateButton from '../../_components/buttons/UltimateButton';

interface accountSectionProps {
    user: User | null
    type?: 'desktop' | 'mobile'
}

export default function AccountSection({ user = null, type = 'desktop' }: accountSectionProps) {

    return (
        type === 'desktop'
            ? user?.email
                ? <div className="flex lg:flex lg:flex-1 lg:justify-end items-center">
                    <MainButton
                        href="/account"
                        style={2}
                    >
                        My account
                    </MainButton>
                </div>
                : <div className="flex lg:flex lg:flex-1 lg:justify-end items-center gap-3">
                    <MainButton
                        href="/signin"
                        className="!border-woocommerce border-2 !bg-white !px-4 lg:!px-6 !py-[6px] lg:!py-3 !text-woocommerce"
                    >
                        Log in
                    </MainButton>
                    <UltimateButton
                        href={"/#pricing"}
                        // className='!px-4 lg:!px-6 !py-2 lg:!py-4'
                    >
                        Start Syncing
                    </UltimateButton>
                </div>
            : user?.email
                ? <MainButton
                    href="/account"
                    style={2}
                >
                    My account
                </MainButton>
                : <>
                    <div className="py-6">
                        <Link
                            href="/signin"
                            className="mr-6 font-semibold text-gray-900 text-sm leading-6"
                        // onClick={() => setMobileMenuOpen(false)}
                        >
                            Log in
                        </Link>
                    </div>
                    <UltimateButton
                        href="/#pricing"
                    >
                        Start Syncing
                    </UltimateButton>
                </>
    )
}
