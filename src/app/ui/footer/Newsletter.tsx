'use client'

import React from 'react'
import MainButton from '../_components/buttons/MainButton'

export default function Newsletter() {
    return (
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
            <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Subscribe to our newsletter</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                    The latest news, articles, and resources, sent to your inbox weekly.
                </p>
            </div>
            <form onSubmit={e => { e.preventDefault() }} className="mt-6 sm:flex sm:max-w-md lg:mt-0">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="w-full mr-4 min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:w-56 sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                />
                <MainButton
                    type="submit"
                >
                    Subscribe
                </MainButton>
            </form>
        </div>
    )
}
