import React from 'react'
import Section from '../../_components/_containers/Section'
import Container from '../../_components/_containers/Container'
import H3 from '../../_components/_tag/H3'
import H1 from '../../_components/_tag/H1'
import HookCard from '../../_components/_cards/HookCard/HookCard'
import { hooks } from 'constantes'
import { randomInt } from 'crypto'
import P from '../../_components/_tag/P'
import H2 from '../../_components/_tag/H2'

export default function HooksIntegration() {
    return (
        <Section style={{
            backgroundImage: 'url(/img/bg-grey.jpg)'
        }}
            className='bg-cover bg-center'
        >
            <Container large={false}>
                <div className='mb-12 lg:mb-20'>
                    <H2 className='text-center'>WooCommerce Hooks Integration</H2>
                    <H3>Trigger and configure various user actions to send data to Pipedrive</H3>
                </div>

                <div className='items-stretch gap-4 lg:gap-y-7 lg:gap-x-6 grid grid-cols-2 lg:grid-cols-3'>
                    {hooks
                        .filter((_, index) => index < 8)
                        .map((hook, index) =>
                            <div
                                key={index}
                            >
                                <HookCard
                                    title={hook.label}
                                    descritpion={hook.description}
                                    classNames={"h-full"}
                                    activated={randomInt(2) === 1 ? true : false}
                                />
                            </div>
                        )}
                    <HookCard
                        title={"And many more"}
                        descritpion={"We are continuously adding new hooks to enhance the synchronization of your data."}
                        classNames={"h-full !bg-green-100"}
                        activated={randomInt(2) === 1 ? true : false}
                    />
                </div>
                <P className='mt-16 !font-semibold text-center'>
                    Take advantage of WooCommerce hooks to trigger data transfers based on specific user or order actions.
                </P>
                <P className='mt-2 !font-semibold text-center'>
                    From user registration, cart updates, and new orders to changes in order status, W2P ensures your Pipedrive data stays up-to-date in real time.
                </P>
                <P className='mt-2 !font-semibold text-center'>
                    With continuous updates, more hooks are added to further enhance your integration flexibility.
                </P>
            </Container>
        </Section>
    )
}
