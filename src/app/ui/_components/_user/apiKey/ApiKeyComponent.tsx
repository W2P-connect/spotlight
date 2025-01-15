"use client"

import React, { FormEvent, ReactNode, useState } from 'react'
import Select from '../../_form/Select'
import { deleteApiKey } from '@/utils/queries/apiKeys';
import { env } from 'process';
import DeleteApiKey from './DeleteApiKey';
import { usePathname } from 'next/navigation'
import { classNames, getStatusRedirect } from '@/utils/helpers';
import MessageResponse from '../../_form/MessageResponse';
import { submitUpdateApiKey } from './action';
import MainButton from '../../buttons/MainButton';
import ApiKeyValue from './ApiKeyValue';
import { FormatedApiKey, License, LicenseOption } from 'types';
import { ApiKey } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Loader from '../../_svg/loader/Loader';

const getLicenseDetails = (license: License): ReactNode => {
    const availableQuantity: number = license.quantity - license.api_keys.length
    return <div className='text-gray-500 text-sm'>
        From {license.created.toLocaleDateString()}
        - {license.status}
        <div className='text-xs italic'>{availableQuantity >= 0
            ? `${availableQuantity} available quantity`
            : <span className='text-red-700'>{`Waring : ${availableQuantity * -1} surplus API keys`}</span>
        }
        </div>
    </div>
}

interface Props {
    apiKey: FormatedApiKey,
    availableLicense: LicenseOption[]
    edit: boolean
}

export default function ApiKeyComponent({ apiKey, availableLicense, edit }: Props) {


    console.log(availableLicense);

    

    const currentPath = usePathname();
    const router = useRouter()
    const [deleting, setDeleting] = useState<boolean>(false)

    const validateURL = (url: string): boolean => {
        const urlRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return urlRegex.test(url);
    };
    const handleDelete = async (event: FormEvent) => {
        event.preventDefault(); // Empêche le rechargement de la page
        let url = '';
        setDeleting(true);
        try {
            if (apiKey.id) {
                const success = await deleteApiKey(apiKey.id);
                url = success
                    ? currentPath
                    : getStatusRedirect(
                        currentPath,
                        'error',
                        `${apiKey.id}`,
                        'Something went wrong while removing your API key'
                    );
            } else {
                url = getStatusRedirect(
                    currentPath,
                    'error',
                    `${apiKey.id}`,
                    'API key is missing'
                );
            }
        } catch (error) {
            url = getStatusRedirect(
                currentPath,
                'error',
                `${apiKey.id}`,
                'Unexpected error occurred'
            );
            setDeleting(false);
        } finally {
            router.refresh()
        }
    };




    return (
        <div>
            <form action={async (formData) => {
                const start = performance.now()
                let url = ''
                const license_id = formData.get(`license-id`) as string
                const domain = formData.get("domain") as string

                const okURL = validateURL(domain)
                if (okURL) {
                    const target = license_id.startsWith('sub') ? 'subscription' : 'one_time_payment'
                    const data: Partial<ApiKey> & { id: number } = {
                        id: apiKey.id,
                        domain: domain,
                    };

                    if (target === "subscription") {
                        data.subscription_id = license_id
                        data.one_time_payment_id = null
                    }
                    if (target === 'one_time_payment') {
                        data.subscription_id = null
                        data.one_time_payment_id = license_id
                    }

                    const state = await submitUpdateApiKey(data)
                    url = state
                        ? getStatusRedirect(currentPath, "success", `apiKey-${apiKey.id}`, 'ApiKey successfully updated !')
                        : getStatusRedirect(currentPath, "error", `apiKey-${apiKey.id}`, 'Something went wrong')

                } else {
                    url = getStatusRedirect(
                        currentPath,
                        "error",
                        `apiKey-${apiKey.id}`,
                        'Invalid domain format. Please enter a valid URL like example.com'
                    )
                }

                const duration = performance.now() - start;
                env.ENVIRONMENT === "DEV" && console.log(`---> Temps de mise à jour apiKey : ${duration.toFixed(2)}ms`);
                router.refresh()
            }}
            >
                <div className='border-1 border-primary-100 shadow-lg p-2 border rounded-md'>
                    <div className='flex flex-wrap items-end gap-5'>
                        <ApiKeyValue apiKey={apiKey.apiKey} />
                        <div>
                            <label htmlFor="domain" className="block font-medium text-gray-900 text-sm leading-6">
                                Plugin installation site domain
                            </label>
                            <div className="flex shadow-sm mt-2 rounded-md">
                                <span className="inline-flex items-center border-gray-300 px-3 border border-r-0 rounded-l-md text-gray-500 sm:text-sm">
                                    http://
                                </span>
                                <input
                                    defaultValue={apiKey.domain ?? ''}
                                    readOnly={!edit}
                                    type="text"
                                    name="domain"
                                    id="domain"
                                    className="block border-0 py-1.5 pl-3 rounded-r-md ring-1 ring-gray-300 focus:ring-1 focus:ring-primary-600 ring-inset focus:ring-inset w-full text-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    placeholder="mywebsite.com"
                                />
                            </div>
                        </div>

                        <div id='submit-apiKey-button'>
                            <MainButton
                                type='submit'
                                style={1}
                                className='!px-4 !py-2 !text-base !self-end'
                                loading={false}
                            >
                                Save
                            </MainButton>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-end gap-5 mt-4'>
                        <div className='self-start'>
                            <div className='block font-medium text-gray-900 text-sm leading-6'>
                                State
                            </div>
                            <div className={classNames(
                                'mt-2',
                                apiKey.isActive
                                    ? "success-label"
                                    : "error-label"
                            )}>
                                {apiKey.isActive ? 'active' : 'inactive'}
                            </div>
                        </div>
                        <Select
                            name={`license-id`}
                            options={availableLicense}
                            defaultOption={apiKey.license
                                ? {
                                    id: apiKey.license.id,
                                    label: apiKey.license.formated_name,
                                    value: apiKey.license?.id,
                                    details: getLicenseDetails(apiKey.license)
                                }
                                : {
                                    id: 1,
                                    label: "Subscription deleted",
                                    value: '',
                                }}

                            label={"License"}
                            readOnly={true}
                        />
                    </div>
                    <div className='mt-2'>
                    </div>
                    <MessageResponse formKey={`apiKey-${apiKey.id}`} />
                </div>
            </form >
            <form
                id={`deleteApiKey-${apiKey.id}`}
                onSubmit={e => handleDelete(e)}
                className='flex justify-end'
            >
                <div className='flex items-center'>
                    <DeleteApiKey formId={`deleteApiKey-${apiKey.id}`} />
                    {deleting ? <Loader size={25} color='#b91c1c' /> : null}
                </div>
            </form>
        </div >
    )
}
