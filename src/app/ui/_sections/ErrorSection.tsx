import MainButton from '../_components/buttons/MainButton'
import Link from 'next/link'

export default function ErrorSection({ error, error_description }: {
    error: string
    error_description?: string
}) {
    return (
        <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-primary-600">Oups...</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{error}</h1>

                <p className="mt-6 text-base leading-7 text-gray-600">{
                    error_description
                        ? error_description
                        : "We encountered an unknown error. Please try again later."
                }</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <MainButton
                        href="/"
                        style={1}
                    >
                        Go back home
                    </MainButton>
                </div>
            </div>
        </div>
    )
}
