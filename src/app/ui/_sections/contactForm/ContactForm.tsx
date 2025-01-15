import React from "react";
import FormEmail from "../../_components/_form/email/FormEmail";
import { getCurrentUser } from "@/utils/queries/users";
import MainButton from "@/app/ui/_components/buttons/MainButton";
import Input from "@/app/ui/_components/_form/Input";
import Select from "../../_components/_form/Select";
import PrivacyPolicyLink from "@/app/(page)/privacy-policy/PrivacyPolicyLink";
import TermsAndConditionsLink from "@/app/(page)/terms-and-conditions/TermsAndConditionsLink";
import { getStatusRedirect } from "@/utils/helpers";
import MessageResponse from "../../_components/_form/MessageResponse";
import P from "../../_components/_tag/P";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { formatMail, sendMail } from "@/utils/mail";

// Schéma de validation avec Zod
const contactFormSchema = z.object({
    subject: z.string().nonempty('Subject is required'),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
});

const cleanInput = (input: string) => {
    return sanitizeHtml(input, {
        allowedTags: [], // Aucun tag HTML autorisé
        allowedAttributes: {}, // Aucune attribut HTML autorisé
    });
};


export default async function ContactForm() {
    const user = await getCurrentUser();
    const requestHeaders = headers();
    const currentPath = requestHeaders.get('x-current-path') ?? '/contact';
    const formkey = 'contactForm';

    return (
        <form
            action={async (formData) => {
                'use server';
                let url = '';

                try {
                    // Récupération et validation des données du formulaire
                    const formValues = {
                        subject: cleanInput(formData.get('subject') as string),
                        name: cleanInput(formData.get('name') as string),
                        email: cleanInput(formData.get('email') as string),
                        message: cleanInput(formData.get('message') as string),
                    };

                    // Validation avec Zod
                    const validatedData = contactFormSchema.parse(formValues);

                    // Création de l'entrée dans la base de données
                    const newContactForm = await prisma?.contactForm.create({
                        data: {
                            ...validatedData,
                            user_id: user?.id ?? null,
                            state: 'TODO',
                        },
                    });

                    if (newContactForm) {
                        url = getStatusRedirect(
                            currentPath,
                            'success',
                            formkey,
                            'Thank you! Your contact form has been submitted. We will respond to you soon.'
                        );

                        await sendMail({
                            to: "woocomerce2pipedrive@gmail.com",
                            subject: "Nouveau formulaire de contact",
                            html: await formatMail(
                                `<div>
                                    Contact: ${formValues.name}<br />
                                    Email: ${formValues.name}<br />
                                    Subject: ${formValues.subject}<br />
                                    Message: <br />
                                    <div>${formValues.message}</div>
                                </div>`
                            )
                        })

                    } else {
                        url = getStatusRedirect(
                            currentPath,
                            'error',
                            formkey,
                            'An error occurred while submitting your contact form'
                        );
                    }
                } catch (error) {
                    console.error('Contact form submission error:', error);
                    url = getStatusRedirect(
                        currentPath,
                        'error',
                        formkey,
                        'An unknown error occurred while submitting your contact form, try later'
                    );
                }

                // Validation de la redirection
                if (!url.startsWith('/') && !url.startsWith(currentPath)) {
                    url = currentPath;
                }

                redirect(url);
            }}
            className="max-w-xl"
        >
            <div className="flex gap-3 w-full">
                <Input
                    label="Name"
                    placeHolder="John Doe"
                    required={true}
                    formName="name"
                />

                <FormEmail
                    readOnly={false}
                    formName="email"
                    defaultEmail={user?.email}
                    required={true}
                />
            </div>

            <div className="mt-3">
                <Select
                    required={true}
                    name="subject"
                    label="Subject"
                    options={[
                        { id: 1, value: 'General information', label: 'General information' },
                        { id: 2, value: 'Support Request', label: 'Support Request' },
                        { id: 3, value: 'Feedback', label: 'Feedback' },
                        { id: 4, value: 'Other', label: 'Other' },
                    ]}
                />
            </div>

            <div className="mt-3">
                <label htmlFor="message" className="block font-medium text-gray-900 text-sm leading-6">
                    Add your message
                </label>
                <div className="mt-2">
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Please enter your message here. Provide as much detail as possible so we can assist you effectively"
                        className="block border-0 shadow-sm p-1.5 rounded-md ring-1 ring-gray-300 focus:ring-1 focus:ring-primary-600 ring-inset focus:ring-inset w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        defaultValue=""
                        required={true}
                    />
                </div>
            </div>

            <P className="mt-3 text-xs">
                By submitting this form, you agree to our <TermsAndConditionsLink /> and <PrivacyPolicyLink />.
            </P>

            <div className="mt-3">
                <MainButton type="submit" style={2}>
                    Send
                </MainButton>
            </div>

            <div className="mt-3">
                <MessageResponse formKey={formkey} />
            </div>
        </form>
    );
}
