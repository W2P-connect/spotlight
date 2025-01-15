import { classNames } from '@/app/utils/helpers';
import React, { ReactNode } from 'react';

export default function Section({
    children,
    className,
    style,
    fullWidth = true,
    id
}: {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string
    fullWidth?: boolean
}) {
    return (
        <section
            className={classNames(
                `py-12 sm:py-24`,
                fullWidth ? 'w-full' : "px-4 sm:px-12 md:px-14 lg:px-20",
                className ? className : ''
            )}
            style={style ?? {}}
            id={id}
        >
            {children}
        </section>
    );
}
