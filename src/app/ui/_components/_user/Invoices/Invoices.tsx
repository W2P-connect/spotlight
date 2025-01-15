"use client"

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import Stripe from 'stripe';
import { callApi, classNames, formatPrice, getURL } from '@/utils/helpers';
import MainButton from '../../buttons/MainButton';
import Skeleton from '../../skeleton/skeleton';
import { GetInvoices } from '@/app/api/v1/invoices/route';
import P from '../../_tag/P';

export default function Invoices() {

    const [custumerInvoices, setCustomerInvoices] = useState<Stripe.Invoice[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    const [hasMore, setHasMore] = useState<boolean>(false)

    const loadMoreInvoices = async () => {
        setLoading(true);

        const data: GetInvoices = {
            per_page: 10,
            starting_after: custumerInvoices[custumerInvoices.length - 1]?.id,
        };
        const invoicesCall = await callApi(`${getURL("/api/v1/invoices")}`, "GET", data);

        if (invoicesCall.success && invoicesCall?.data?.data?.data) {
            setCustomerInvoices((prv) => [
                ...prv,
                ...invoicesCall.data.data.data ?? [],
            ]);

            setHasMore(invoicesCall.data.data.has_more);
        }

        setLoading(false);
    };

    const showState =
        (status: "draft" | "open" | "paid" | "uncollectible" | "void" | null)
            : ReactNode => {
            return <div className={classNames(
                status === "paid"
                    ? "success-label"
                    : status === "open" || "draft"
                        ? "warning-label"
                        : "error-label"
            )}>
                {status}
            </div>
        }

    // Ne pas rajouter loadMoreInvoices en dépendance, boucle infini le cas échéant
    useEffect(() => {
        loadMoreInvoices()
    }, [])

    return (
        <div>
            {
                custumerInvoices.length || loading
                    ?
                    <>
                        <table className="divide-y divide-gray-300 min-w-full">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 sm:pl-0 font-semibold text-gray-900 text-left text-sm">
                                        Number
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 sm:pl-0 font-semibold text-gray-900 text-left text-sm">
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 font-semibold text-gray-900 text-left text-sm lg:table-cell"
                                    >
                                        Date
                                    </th>

                                    <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                                        status
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-4 sm:pr-0 pl-3">
                                        <span className="sr-only">Download</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <>
                                    {custumerInvoices.map((invoice, index) => (
                                        <tr key={invoice.id}>
                                            <td className="py-4 pr-3 pl-4 sm:pl-0 w-full sm:w-auto max-w-0 sm:max-w-none font-medium text-gray-900 text-sm">
                                                {invoice.number}
                                                <dl className="lg:hidden font-normal">
                                                    <dt className="sr-only">Date</dt>
                                                    <dd className="mt-1 text-gray-700 truncate">{
                                                        new Date(invoice.period_start * 1000).toLocaleDateString()
                                                    }</dd>
                                                </dl>
                                            </td>
                                            <td className="px-3 py-4 text-gray-700 text-sm">
                                                {formatPrice(invoice.amount_due, invoice.currency)}
                                            </td>
                                            <td className="hidden px-3 py-4 text-gray-500 text-sm lg:table-cell">{
                                                new Date(invoice.period_start * 1000).toLocaleDateString()
                                            }</td>
                                            <td className="px-3 py-4 text-gray-500 text-sm">{showState(invoice.status)}</td>
                                            <td className="text-right py-4 pr-4 sm:pr-0 pl-3 font-medium text-sm">
                                                {
                                                    invoice.hosted_invoice_url
                                                        ? <a target='_blank' href={invoice.hosted_invoice_url} className="text-primary-600">
                                                            Download<span className="sr-only">, {invoice.number}</span>
                                                        </a>
                                                        : <span>Not yet available</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                    {loading
                                        ? <>
                                            <tr>
                                                <td colSpan={10}>
                                                    <div className='mt-3'>
                                                        <Skeleton width='100%' height='40px' className='opacity-100' />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={10}>
                                                    <div className='mt-3'>
                                                        <Skeleton width='100%' height='40px' className='opacity-80' />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={10}>
                                                    <div className='mt-3'>
                                                        <Skeleton width='100%' height='40px' className='opacity-60' />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={10}>
                                                    <div className='mt-3'>
                                                        <Skeleton width='100%' height='40px' className='opacity-40' />
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                        : null}
                                </>

                            </tbody>
                        </table>

                        {hasMore
                            ? <div className='flex justify-center'>
                                <MainButton
                                    onClick={loadMoreInvoices}
                                    loading={loading}
                                    style={4}
                                    className='mt-6 !px-0 !border-none !text-gray-700 !text-sm'>
                                    Load more
                                </MainButton>
                            </div>
                            : null
                        }
                    </>

                    : <P>There are no invoices to show at this time.</P>
            }
        </div>
    )
}