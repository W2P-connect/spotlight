"use client"
import React, { useState } from 'react'
import MainButton from '../../buttons/MainButton'
import ModalWarning from '../../modalDialog/ModalWarning'



export default function DeleteApiKey({ formId }: { formId: string }) {

    const [open, setOpen] = useState<boolean>(false)

    const openModal = () => setOpen(_ => true)
    const closeModal = () => setOpen(false)

    return (
        <>
            <MainButton
                className='!text-red-700 !bg-transparent'
                onClick={openModal}
                type='button'
            >
                Delete
            </MainButton>

            <ModalWarning
                onClose={closeModal}
                open={open}
                callBackButtonText='Delete'
                title="Delete Api Key"
                formId={formId}
                content="Are you sure you want to delete this API key? Your access using this key will be revoked, and it will no longer function. This action is irreversible."
            />
        </>
    )
}
