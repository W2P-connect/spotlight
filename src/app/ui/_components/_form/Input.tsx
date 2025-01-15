'use client'

import { classNames } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';


interface Props {
    readOnly?: boolean
    label?: string
    placeHolder?: string
    formName?: string,
    required?: boolean,
    defaultValue?: string,
    type?: | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'date'
    setter?: (value: string) => void
}

/**
 * 
 * @param readOnly default false 
 * @param formName default 'email' 
 * @param placeHolder default '' 
 * @param defaultEmail default '' 
 * @param required default false 
 * @param type default text
 * @param setter default if you want to catch email value from parent'() => void' 
 * @returns 
 */

export default function Input({
    readOnly = false,
    label = '',
    placeHolder = '',
    formName = '',
    defaultValue = '',
    required = false,
    type = "text",
    setter = (value: string) => { }
}: Props) {

    const [value, setValue] = useState<string>(defaultValue)

    useEffect(() => {
        setter(value)
    }, [value, setter])

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue)
        }
    }, [defaultValue])


    return (
        <div className='w-full'>
            <label htmlFor={formName} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type={type}
                    name={formName}
                    id={formName}
                    readOnly={readOnly}
                    value={value}
                    onChange={e => setValue(_ => e.target.value)}
                    className={classNames(
                        "block w-full rounded-md border-0 py-1.5 pl-2 text-gray-500 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6",
                        readOnly ? 'cursor-not-allowed bg-gray-100' : ''
                    )}
                    required={required}
                    placeholder={placeHolder}
                />
            </div>
        </div>
    )

}