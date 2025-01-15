'use client'

import React, { useState } from 'react';
import { submitApiKey } from './action';
import MainButton from '../../buttons/MainButton';
import { useRouter } from 'next/navigation';  // Utilisation du router de Next.js pour rediriger
import MessageResponse from '../../_form/MessageResponse';
import { getStatusRedirect } from '@/utils/helpers';
import { License } from 'types';
import Loader from '../../_svg/loader/Loader';

interface AddApiKeyProps {
    license: License;
    userId: string;
}

export default function AddApiKey({ license, userId }: AddApiKeyProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();  // Hook pour la redirection

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const apiKey = await submitApiKey(license);

            if (!apiKey) {
                const url = getStatusRedirect(
                    "/account",  // Vous pouvez ajuster cela selon la logique
                    "error",
                    'createApiKey',
                    'We were unable to create a new API key. You may contact us.'
                );
                router.push(url);
            }
        } catch (error) {
            console.error('Error creating API key:', error);
            setLoading(false);
        } finally {
            router.refresh()
        }
    };

    return (
        license ? (
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name={`${license.target}-id`}
                        readOnly
                        defaultValue={`${license.id}`}
                        className="hidden"
                        placeholder="you@example.com"
                    />
                    <MainButton
                        type="submit"
                        style={2}
                        className="flex !px-4 !py-2 !text-base"
                        disabled={loading}
                    >
                        Create a new API Key
                        {loading
                            ? <div className='ml-2'>
                                <Loader size={25} color='#ffffff' />
                            </div>
                            : null
                        }
                    </MainButton>
                    <MessageResponse formKey="createApiKey" />
                </form>
            </div>
        ) : null
    );
}
