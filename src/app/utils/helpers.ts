import { env } from "process";


export const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
}

/**
 * Formats a price given in cents to a specified currency.
 * 
 * @param {number} amount - The amount in cents.
 * @param {string} currency - The currency code ("EUR" or "USD").
 * @returns {string} - The formatted price string.
 */

export const getURL = (path: string = '') => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL &&
            process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
            ? process.env.NEXT_PUBLIC_SITE_URL
            : process?.env?.NEXT_PUBLIC_VERCEL_URL &&
                process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
                ? process.env.NEXT_PUBLIC_VERCEL_URL
                : 'http://localhost:3000/';

    url = url.replace(/\/+$/, '');
    url = url.includes('http') ? url : `https://${url}`;
    path = path.replace(/^\/+/, '');

    return path ? `${url}/${path}` : url;
};