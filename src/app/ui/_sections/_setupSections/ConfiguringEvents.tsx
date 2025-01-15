import React from 'react'
import Section from '../../_components/_containers/Section'
import H2 from '../../_components/_tag/H2'
import P from '../../_components/_tag/P'
import Container from '../../_components/_containers/Container'
import T_B_SectionContent from '../../_components/_containers/T_B_SectionContent'
import Image from 'next/image'
import YouTubeEmbed from '../../_components/YouTubeEmbed/YouTubeEmbed'

export default function ConfiguringEvents() {
    return (
        <Section
            className="relative flex flex-col justify-center items-center pb-0 sm:pb-0 lg:pb-0"
        >
            <Container
                className='z-10 pb-24'
            >
                <H2 className='mb-6 !text-[32px] md:!text-[54px]'>
                    2. Configuring Events
                </H2>
                <T_B_SectionContent
                    bottom={<div>
                        <P className='mb-2'>
                            With W2P, you can <strong>select specific WooCommerce hooks for each Pipedrive category</strong> (Deal, Organization, and Person) to trigger actions.
                            Different events, like a user profile update or an order confirmation, can be set to activate whenever a customer interacts on your WooCommerce site.
                        </P>
                        <P>
                            Each user&apos;s event is fully customizable, allowing you to <strong>specify which Pipedrive fields should be sent. </strong>
                            You have complete control over the data sent, with the flexibility to select specific details,
                            such as the first name in the billing address, the user&apos;s email, the customer&apos;s last name,
                            or even custom meta fields you wish to include.
                        </P>
                    </div>

                    }
                    top={
                        <div className='relative shadow-xl rounded-[14px] w-full overflow-hidden' style={{ aspectRatio: '16/9' }}>
                            <YouTubeEmbed videoId='0vD3OyNifhE' />
                        </div>}
                />

            </Container>

            <Image
                src={"/img/bg-grey.jpg"}
                alt="beautifull gray background"
                className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                fill
            />
        </Section >
    )
}
