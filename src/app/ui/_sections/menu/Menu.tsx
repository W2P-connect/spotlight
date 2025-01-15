'use client'

import { User } from '@supabase/supabase-js'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogPanel,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import AccountSection from './accountSection'
import { classNames } from '@/utils/helpers'
import Logo from '../../_components/_branding/Logo'
import { menu } from 'constantes'
import Image from 'next/image'


export default function Menu({ user }: { user: User | null }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
    const [showMenu, setShowMenu] = useState<boolean>(true)

    useEffect(() => {
        let lastScrollY = window.scrollY;


        const handleScroll = () => {

            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setShowMenu(_ => false);
            } else {
                setShowMenu(_ => true);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <header
            className={classNames(
                "sticky w-full isolate z-50 transition-all duration-500 shadow-sm bg-center bg-cover",
                showMenu ? 'top-0' : '-top-[120px]'
            )}

        >
            <nav className="relative z-10 flex justify-between items-center gap-x-4 mx-auto lg:px-8 p-4 max-w-7xl" aria-label="Global">
                <div className="md:flex hidden">
                    <span className="sr-only">W2P logo</span>
                    <Logo
                        width={125}
                        height={25}
                        className='max-w-24 lg:max-w-full'
                    />
                </div>
                <div className="flex md:hidden">
                    <button
                        type="button"
                        className="inline-flex justify-center items-center -m-2.5 p-2.5 rounded-md text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="md:flex gap-x-6 lg:gap-x-12 hidden">
                    {
                        menu.map((menu, index) =>
                            <Link
                                href={menu.link}
                                key={index}
                                className="font-semibold text-darkPurple text-lg"
                            >
                                {menu.label}
                            </Link>

                        )
                    }
                </div>
                <div className='flex-shrink-0'>
                    <AccountSection user={user} />
                </div>
            </nav>

            <div className="top-0 absolute w-full h-full">
                <Image
                    src="/img/bg-grey.jpg"
                    fill
                    alt="beautiful gray background"
                />
            </div>
            <Dialog className="relative z-50 md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="z-30 fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
                <DialogPanel className="right-0 z-40 fixed inset-y-0 bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10 w-full sm:max-w-sm overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 rounded-md text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="flex flex-col gap-y-6 py-6">
                                <Link
                                    href="/"
                                    className="font-semibold text-darkPurple text-lg cursor-pointer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    W2P Solutions
                                </Link>
                                {
                                    menu.map((menu, index) =>
                                        <Link
                                            href={menu.link}
                                            key={index}
                                            className="font-semibold text-darkPurple text-lg cursor-pointer"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {menu.label}
                                        </Link>

                                    )
                                }
                            </div>
                            <div onClick={() => setMobileMenuOpen(false)}>
                                <AccountSection user={user} type='mobile' />
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
