'use client'

import React, { useState } from 'react';
import MainButton from '@/app/ui/_components/buttons/MainButton';
import { FormatedUser, SubscriptionWithDetails } from 'types';
import { isActiveSubscription, isWarningSubscription } from '@/utils/stripe/helpers';
import { redirect, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createStripePortal } from '@/utils/stripe/server';
import MessageResponse from '@/app/ui/_components/_form/MessageResponse';
import { getStatusRedirect } from '@/utils/helpers';


export default function ManagePlan({ subscription, user }: { subscription: SubscriptionWithDetails, user: FormatedUser }) {

    const currentPath = usePathname();
    const router = useRouter();

    const [loading, setLoading] = useState(false)

    console.log(subscription.status);
    

    const getSubscriptionLabel = (subscription: SubscriptionWithDetails): string => {
        return isActiveSubscription(subscription.status)
            ? isWarningSubscription(subscription.status)
                ? 'warning-label'
                : 'success-label'
            : 'error-label'
    }

    const handleSelectPlan = async () => {
        setLoading(_ => true)
        await manageUserPlan()
        setLoading(_ => false)
    }

    const manageUserPlan = async () => {
        if (user?.customer_id) {
            try {
                const url = await createStripePortal(user.customer_id, currentPath)
                return router.push(url);

            } catch (error) {
                if (error instanceof Error) {
                    const url = getStatusRedirect(
                        currentPath,
                        "error",
                        `manage-subscription-${subscription.id}`,
                        error.message
                    )
                    return router.push(url);
                }
                const url = getStatusRedirect(
                    currentPath,
                    "error",
                    `manage-subscription-${subscription.id}`,
                    'An unknown error occurred.'
                )
                return router.push(url);
            }
        }
    }

    return (
        <>
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className='flex gap-3 items-center'>
                        <div className={getSubscriptionLabel(subscription)}>{subscription.status}</div>
                        <h3 className="text-lg font-bold leading-6 text-gray-900">
                            {subscription.Price?.Product?.name} - ({subscription.Price?.currency?.toUpperCase()})
                        </h3>
                    </div>
                    <div className="mt-4 sm:flex sm:items-start sm:justify-between">
                        <div className="max-w-xl text-sm text-gray-600 space-y-2">
                            <p>You can modify the quantity or cancel your plan using the &#39;Manage Plan&#39; button</p>
                            <p className="font-medium">Quantity: <span className="font-normal">{subscription.quantity ?? 0}</span></p>
                            <p className="font-medium">From: <span className="font-normal">{new Date(subscription.current_period_start).toLocaleDateString()}</span></p>
                            {subscription.trial_end && (
                                <p className="font-medium">Trial ends on: <span className="font-normal">{new Date(subscription.trial_end).toLocaleDateString()}</span></p>
                            )}
                            {subscription.cancel_at && (
                                <p className="font-medium text-red-700">Plan will be canceled on: <span className="font-normal">{new Date(subscription.cancel_at).toLocaleDateString()}</span></p>
                            )}
                        </div>
                        <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                            <MainButton
                                type="button"
                                style={2}
                                onClick={() => handleSelectPlan()}
                                loading={loading}
                            >
                                Manage Plan
                            </MainButton>
                        </div>
                    </div>
                </div>
            </div>
            <MessageResponse formKey={`manage-subscription-${subscription.id}`} />
        </>
    );
}
