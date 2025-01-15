'use client'

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ReactNode, useEffect, useState } from 'react'

export interface Option {
    label: string;
    id: any;
    details?: ReactNode;
    value?: string | number | readonly string[] | undefined;
}

interface DatalistProps {
    options: Option[];
    label?: string | null;
    name?: string | null;
    defaultId?: any | null;
    defaultOption?: Option | null;
    readOnly?: boolean
    required?: boolean
    onSelect?: (option: Option) => void
}
export default function Datalist({
    options,
    label = null,
    defaultId = null,
    defaultOption = null,
    name = null,
    readOnly = false,
    required = false,
    onSelect = (option: Option) => null
}: DatalistProps) {

    const [query, setQuery] = useState<string>('')
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)

    const filteredOptions =
        query === ''
            ? options
            : options.filter((options) => {
                return options.label.toLowerCase().includes(query.toLowerCase())
                    || (
                        options.value
                        && typeof options.value === 'string'
                        && options.value.toLowerCase().includes(query.toLowerCase())
                    )
            })

    useEffect(() => {
        if (defaultId) {
            const defaultOption = options.find(option => option.id === defaultId)
            defaultOption && setSelectedOption(defaultOption)
        }
    }, [defaultId, options])

    useEffect(() => {
        if (defaultOption) {
            setSelectedOption(defaultOption)
        }
    }, [defaultOption])

    return (
        <Combobox
            as="div"
            value={selectedOption}
            onChange={(option) => {
                setQuery('')
                setSelectedOption(option)
                option && onSelect(option)
            }}
        >
            {label
                ? <Label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {label}
                </Label>
                : null
            }
            <div className="relative">
                <ComboboxInput
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-secondary-400 sm:text-sm sm:leading-6"
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery('')}
                    displayValue={(option: Option) => option?.label}
                    readOnly={readOnly}
                    required={required}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {/* Hidden input to send the value */}
                <input type="hidden" name={name ?? ''} value={selectedOption?.value ?? ''} />

                {filteredOptions.length > 0 && (
                    <ComboboxOptions
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                        {filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.id}
                                value={option}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 data-[focus]:bg-secondary-100"
                            >
                                <div className='text-gray-900'>
                                    <span className="block truncate group-data-[selected]:font-semibold">{option.label}</span>

                                    <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-secondary-500 group-data-[selected]:flex">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                </div>
                                {option.details
                                    ? <div>
                                        {option.details}
                                    </div>
                                    : null
                                }
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    )
}
