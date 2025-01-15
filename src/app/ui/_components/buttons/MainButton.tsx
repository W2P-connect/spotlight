"use client"

import { classNames } from '@/utils/helpers';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link'
import React, { ReactNode, MouseEvent } from 'react'
import { useFormStatus } from 'react-dom';

interface MainButtonProps {
    children: ReactNode;
    href?: string | Url;
    type?: "submit" | "button" | "reset" | undefined
    className?: string
    style?: number
    loading?: boolean
    disabled?: boolean
    target?: string
    onClick?: (event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * 
 * @param children,
   @param href default '',
    @param type ex:'submit',
    @param className default'',
    @param style button style between 1 and 4. default 1,
    @param loading = false,
    @param disabled = false,
    @param onClick 
 * @returns ReactNode 
 */

export default function MainButton({
    children,
    href = '',
    type = 'submit',
    className = '',
    style = 0,
    loading = false,
    disabled = false,
    target = '',
    onClick
}: MainButtonProps) {

    const getClasseFromStyle = (style: number) => {
        switch (style) {
            case 1:
                return "bg-pipedrive border-2 border-pipedrive text-white"
            case 2:
                return "bg-woocommerce border-2 border-woocommerce text-white"
            case 3:
                return "!text-darkPurple bg-white border-2 border-darkPurple"
            case 4:
                return "bg-white border-2 border-pipedrive text-pipedrive";
            default:
                return ""
        }
    }

    const { pending } = useFormStatus()

    let defaultClassName = "rounded-[4px] px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold block text-center"
    defaultClassName += " relative transform hover:shadow-inner-md hover:scale-[0.98] active:scale-95 active:shadow-inner transition-scale duration-200"

    return (
        href
            ? <Link
                href={href}
                target={target}
                className={classNames(
                    defaultClassName,
                    getClasseFromStyle(style),
                    loading || pending ? '!cursor-wait' : '',
                    disabled ? 'opacity-90 cursor-not-allowed' : '',
                    className
                )}
            >
                {children}
            </Link>
            : <button
                type={type}
                className={classNames(
                    defaultClassName,
                    getClasseFromStyle(style),
                    loading || pending ? 'cursor-wait' : '',
                    disabled ? 'opacity-90 cursor-not-allowed' : '',
                    className
                )}
                disabled={disabled || loading || pending}
                onClick={e => onClick && onClick(e)}
            >
                {children}
            </button>
    )
}
