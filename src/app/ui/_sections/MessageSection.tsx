import { ReactNode } from 'react'
import Logo from '../_components/_branding/Logo'
import MainButton from '../_components/buttons/MainButton'

export default function MessageSection({ message, message_description, logo, callBackButton }: {
    message: string
    message_description?: string
    logo?: boolean
    callBackButton?: ReactNode
}) {
    return (
        <div className="grid min-h-full place-items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {logo
                    ? <Logo />
                    : null
                }
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{message}</h1>

                <p className="mt-6 text-base leading-7 text-gray-600">{
                    message_description
                        ? message_description
                        : null
                }</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    {callBackButton
                        ? callBackButton
                        : <MainButton
                            href="/"
                            style={1}
                        >
                            Go back home
                        </MainButton>
                    }
                </div>
            </div>
        </div>
    )
}
