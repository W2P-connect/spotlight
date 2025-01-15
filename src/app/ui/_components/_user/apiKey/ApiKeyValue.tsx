"use client"

import { classNames } from '@/utils/helpers';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

export default function ApiKeyValue({ apiKey }: { apiKey: string }) {

    const [tooltipVisible, setTooltipVisible] = useState(false);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey).then(function () {
            setTooltipVisible(true);
            setTimeout(() => {
                setTooltipVisible(false);
            }, 2000);
        }).catch(function (err) {
            setTooltipVisible(true);
        });

    }

    return (
        <div className='lg:w-[400px] w-[360px] max-w-[90%]'>
            <label className="block text-sm font-medium leading-6 text-gray-900">
                Api key
            </label>
            <div className="mt-2 flex rounded-md shadow-sm relative">
                <div onClick={() => {
                    "use client"
                    copyToClipboard()
                }}>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <ClipboardDocumentCheckIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className='hidden lg:block'>
                            Copy
                        </span>
                    </button>
                </div>
                <input
                    type="text"
                    name="apiKey"
                    readOnly={true}
                    defaultValue={apiKey}
                    className='w-full rounded-r-md border-0 py-1.5 text-sm pl-3 bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 cursor-not-allowed'
                />
                <div className={classNames(
                    "absolute opacity-0 -z-10 left-12 top-3 px-2 py-1 text-xs text-white bg-black rounded-md shadow-md transition duration-150 ease-out cursor-default",
                    tooltipVisible ? "opacity-80 z-10" : ""
                )}>
                    Copied!
                </div>
            </div>
        </div>
    )
}
