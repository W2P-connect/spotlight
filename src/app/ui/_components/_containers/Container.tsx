import { classNames } from '@/app/utils/helpers';
import React, { ReactNode } from 'react';

export default function Container({
    children,
    className,
    style,
    large = false,
    id
}: {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    large?: boolean;
    id?: string
}) {
    return (
        <div
            className={classNames(
                large ? "max-w-[1620px]" : "max-w-[1380px]",
                "mx-auto px-4 sm:px-12 md:px-14 lg:px-20",
                "bg-cover rounded-2xl bg-center",
                className ? className : "",
            )}
            style={style ?? {}}
            id={id}
        >
            {children}
        </div>
    );
}
