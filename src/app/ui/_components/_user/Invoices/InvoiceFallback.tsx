import React from 'react'
import Skeleton from '../../skeleton/skeleton'

export default async function InvoicesFallback() {

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Number
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Date
                        </th>

                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Download</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                        <td colSpan={10}>
                            <div className='mt-3'>
                                <Skeleton width='100%' height='40px' />
                            </div>
                        </td>
                    </tr>


                </tbody>
            </table>
        </div>
    )
}
