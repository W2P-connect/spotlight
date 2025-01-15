'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ReactNode, useEffect, useState } from 'react'

export interface Option {
    label: string;
    id: any;
    details?: ReactNode;
    value?: string | number | readonly string[] | undefined;
}

interface SelectProps {
    options: Option[];
    label?: string | null;
    name?: string | null;
    defaultId?: any | null;
    defaultOption?: Option | null;
    required?: boolean
    readOnly?: boolean
    onSelect?: (option: Option) => void
}

export default function Select({
    options,
    label = null,
    defaultId = null,
    defaultOption = null,
    name = null,
    required = false,
    readOnly = false,
    onSelect = (_: Option) => null
}: SelectProps) {

    const [selectedOption, setSelectedOption] = useState<Option | null>(null)

    useEffect(() => {
        if (defaultId) {
            const defaultOption = options.find(option => option.id === defaultId)
            defaultOption && setSelectedOption(defaultOption)
        }
    }, [])

    useEffect(() => {
        if (defaultOption) {
            setSelectedOption(defaultOption)
        }
    }, [defaultOption])

    const handleSelect = (option: Option) => {
        setSelectedOption(option)
        onSelect(option)
    }

    return (
        <div>
            <Listbox value={selectedOption} onChange={handleSelect}>
                {label && (
                    <Label className="block mb-2 font-medium text-gray-900 text-sm leading-6">
                        {label}
                    </Label>
                )}
                <div className="relative">
                    <ListboxButton
                        className="relative z-10 bg-white shadow-sm py-1.5 pr-10 pl-3 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-primary-600 ring-inset w-full text-gray-900 text-left sm:text-sm sm:leading-6 cursor-default focus:outline-none"
                    >
                        <span className="block truncate">{selectedOption?.label || "Select an option"}</span>
                        <span className="right-0 absolute inset-y-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon aria-hidden="true" className="w-5 h-5 text-gray-400" />
                        </span>
                    </ListboxButton>

                    <input
                        type="hidden"
                        name={name ?? ''}
                        value={selectedOption?.value ?? ''}
                        required={required}
                        className='top-0 left-0 absolute opacity-0 w-0 h-full'
                        readOnly={true}
                    />

                    <ListboxOptions
                        className="z-50 absolute bg-white ring-opacity-5 shadow-lg mt-1 py-1 rounded-md ring-1 ring-black w-full max-h-60 text-base sm:text-sm overflow-auto focus:outline-none"
                    >
                        {options.map((option) => (
                            <ListboxOption
                                key={option.id}
                                value={option}
                                className="relative data-[focus]:bg-secondary-100 py-2 pr-9 pl-3 text-gray-900 cursor-pointer select-none group"
                            >
                                <span className="group-data-[selected]:font-semibold block font-normal truncate">{option.label}</span>
                                <span className="">{option.details}</span>

                                <span className="right-0 absolute inset-y-0 flex items-center [.group:not([data-selected])_&]:hidden pr-4 text-primary-600">
                                    <CheckIcon aria-hidden="true" className="w-5 h-5" />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    )
}
