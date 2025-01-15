"use client"

import React, { ReactNode, MouseEvent } from 'react'
import './ultimateButton.css'
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

interface Props {
    children: ReactNode;
    type?: "submit" | "button" | "reset" | undefined
    className?: string
    style?: number
    loading?: boolean
    disabled?: boolean
    href: string | Url;
    onClick?: (event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>) => void;
}


export default function UltimateButton({
    href,
    children,
    type = 'submit',
    className = '',
    style = 0,
    loading = false,
    disabled = false,
    onClick
}: Props) {
    return (
        /* From Uiverse.io by ilkhoeri */
        <Link href={href} className={`group bg-woocommerce ultimateButton rounded-[4px] px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold ${className}`}>
            {/* <span className="fold"></span> */}

            <div className="group-hover:block hidden points_wrapper">
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
                <i className="point"></i>
            </div>

            <span className="inner"
            ><svg
                className="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
            >
                    <polyline
                        points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
                    >
                    </polyline>
                </svg>
                {children}
            </span>
        </Link>

    )
}
