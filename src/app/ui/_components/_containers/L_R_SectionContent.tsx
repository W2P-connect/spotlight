import { classNames } from '@/app/utils/helpers';
import { ReactNode } from "react";

interface SectionContentProps {
    left: ReactNode;
    right: ReactNode;
    classeName?: string;
    classeNameLeft?: string;
    classeNameRight?: string;
    reverseOnWrap?: boolean;
}

export default function L_R_SectionContent({ left, right, reverseOnWrap = false, classeName = "", classeNameLeft = "", classeNameRight = "" }: SectionContentProps) {
    return (
        <div className={`${classeName} flex ${reverseOnWrap ? "flex-col-reverse" : "flex-col"} lg:flex-row items-center gap-4 md:gap-8`}>
            <div className={classNames("w-full lg:w-1/2", classeNameLeft)}>
                {left}
            </div>
            <div className={classNames("w-full lg:w-1/2", classeNameRight)}>
                {right}
            </div>
        </div>
    );
}
