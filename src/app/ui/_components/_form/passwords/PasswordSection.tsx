'use client'

import React from 'react';
import FormPassword from './FormPassword';

interface PasswordSectionProps {
    areSamePasswords?: boolean | null
    setValidPassword: (valide: boolean) => void
}

export default function PasswordsSection({
    areSamePasswords = null,
    setValidPassword = (valide: boolean) => { },
}: PasswordSectionProps) {

    return (

        <>
            <div className="mb-6">
                <FormPassword
                    checkValidity={true}
                    setValidPassword={setValidPassword}
                    label='New Password'
                />
            </div>

            <div className="mb-6">

                <FormPassword
                    label={'Verify password'}
                    formName='password-2'
                />

                <div>
                    {areSamePasswords !== null
                        ? areSamePasswords
                            ? null
                            : <p className='py-2 text-red-500 text-sm'>Passwords do not match</p>
                        : null
                    }
                </div>
            </div>
        </>

    )

}