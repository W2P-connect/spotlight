import { classNames } from '@/app/utils/helpers';
import { ReactNode } from "react";

interface SectionContentProps {
    top: ReactNode;
    bottom: ReactNode;
    classeNameTop?: string;
    classeNameBottom?: string;
}

export default function T_B_SectionContent({ top, bottom, classeNameTop = "", classeNameBottom = "" }: SectionContentProps) {
    return (
        <div className={`flex flex-col items-center gap-4 md:gap-8`}>
            <div className={classNames("w-full", classeNameTop)}>
                {top}
            </div>
            <div className={classNames("w-full", classeNameBottom)}>
                {bottom}
            </div>
        </div>
    );
}
