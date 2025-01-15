"use server"

import React, { ReactNode } from 'react'
import { ApiKey as FormatedApiKey } from '@prisma/client';
import { ApiKeyModel } from '@/models/ApiKeyModel';
import { getCurrentUser } from '@/utils/queries/users';
import { License, LicenseOption, } from 'types';
import ApiKeyComponent from './ApiKeyComponent';
import { removeDuplicates, removeDuplicatesByKey } from '@/utils/helpers';

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

export default async function ApiKey({ apiKey, edit = true }: {
    apiKey: FormatedApiKey
    edit?: boolean
}) {

    const [apiKeyModel, user] = await Promise.all([
        ApiKeyModel.getApiKey(apiKey.id),
        await getCurrentUser()
    ])

    const formatedApiKey = await apiKeyModel?.getData()

    // console.log(formatedApiKey);
    // console.log(user, user);

    const availableLicense: LicenseOption[] = user?.available_license
        ? removeDuplicatesByKey(
            "id",
            user.available_license
                .map(license => {
                    return {
                        value: license.id,
                        label: license.formated_name,
                        id: license.id,
                        details: getLicenseDetails(license)
                    }
                })
                .concat(formatedApiKey?.license
                    ? [{
                        value: formatedApiKey.license.id,
                        label: formatedApiKey.license.formated_name,
                        id: formatedApiKey.license.id,
                        details: getLicenseDetails(formatedApiKey.license)
                    }]
                    : []
                )
        )
        : [{
            id: "1",
            label: "No available subscription",
            value: '',
        }]

    return (
        formatedApiKey && !formatedApiKey.archived
            ? <ApiKeyComponent apiKey={formatedApiKey} availableLicense={availableLicense} edit={edit} />
            : null
    )
}