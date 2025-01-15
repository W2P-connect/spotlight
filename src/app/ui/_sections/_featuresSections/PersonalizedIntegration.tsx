import React from 'react'
import Section from '../../_components/_containers/Section'
import Container from '../../_components/_containers/Container'
import H3 from '../../_components/_tag/H3'
import H1 from '../../_components/_tag/H1'
import Image from 'next/image'
import CartFeature from '../../_components/_cards/cardPoint/CartFeature'
import KeyPointDev from '../../_components/_svg/KeyPointDev'
import Checked from '../../_components/_svg/Checked'
import P from '../../_components/_tag/P'
import H2 from '../../_components/_tag/H2'

export default function PersonalizedIntegration() {
    return (
        <Section>
            <Container large={true}>
                <div className='mb-12'>
                    <H2 className='text-center'>Personalized integration with your Pipedrive setup</H2>
                    <H3>Load your Pipedrive environment for a fully customized integration experience</H3>
                </div>
                <Container
                    style={{
                        backgroundImage: 'url(/img/pg-purplue-gradient.jpg)'
                    }}
                    large={true}
                    className='!px-6 py-12'
                >
                    {/* DESKTOP */}
                    <div className='relative lg:flex flex-col items-center hidden h-full'>
                        <div className='absolute flex flex-col justify-between items-center max-w-[290px] h-full'>
                            <div>
                                <CartFeature title='Organization fields' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Deal fields' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Person fields' icon='settings' />
                            </div>
                            <div className='lg:block hidden my-4'>
                                <P className='text-center'>Load many options in <span className='font-semibold'>W2P</span> from <span className='font-semibold'>Pipedrive</span></P>
                            </div>
                            <div>
                                <CartFeature title=' Stages Pipedrive' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Users Pipedrive' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='And many more...' icon='settings' />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-10'>
                            <div>
                                <div className='sr-only'>Logo Pipedrive</div>
                                <Image
                                    src="/img/pipedrive-logo-1.png"
                                    width={230}
                                    height={100}
                                    alt='logo pipedrive'
                                />
                            </div>
                            <div>
                                <Image
                                    src={'/img/gradientWord.svg'}
                                    width={626}
                                    height={528}
                                    alt='Available Pipedrive Integration for WooCommerce W2P plugin parameters'
                                />
                            </div>
                            <div>
                                <div className='sr-only'>Logo Woocommerce</div>
                                <Image
                                    src="/img/woocommerce-logo-1.png"
                                    width={230}
                                    height={100}
                                    alt='logo pipedrive'
                                />
                            </div>
                        </div>
                    </div>

                    {/* MOBILE / TAB */}
                    <div className='relative flex flex-col justify-center items-center lg:hidden h-full'>
                        <div className='z-10 absolute flex flex-wrap justify-center items-center gap-2'>
                            <div>
                                <CartFeature title='Organization fields' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Deal fields' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Person fields' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Stages Pipedrive' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='Users Pipedrive' icon='settings' />
                            </div>
                            <div>
                                <CartFeature title='And many more...' icon='settings' />
                            </div>
                            <div className='backdrop-blur-lg mt-4'>
                                <P className='text-center'>Load many options in <span className='font-semibold'>W2P</span> from <span className='font-semibold'>Pipedrive</span></P>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between items-center gap-10'>
                            <div className='mb-12'>
                                <div className='sr-only'>Logo Pipedrive</div>
                                <Image
                                    src="/img/pipedrive-logo-1.png"
                                    width={230}
                                    height={100}
                                    alt='logo pipedrive'
                                />
                            </div>
                            <div>
                                <Image
                                    src={'/img/gradientWord.svg'}
                                    width={626}
                                    className='rotate-90'
                                    height={528}
                                    alt='Available Pipedrive Integration for WooCommerce W2P plugin parameters'
                                />
                            </div>
                            <div className='mt-12'>
                                <div className='sr-only'>Logo Woocommerce</div>
                                <Image
                                    src="/img/woocommerce-logo-1.png"
                                    width={230}
                                    height={100}
                                    alt='logo pipedrive'
                                />
                            </div>
                        </div>
                    </div>

                    <P className='mt-16 !font-semibold text-center'>
                        W2P delivers a fully customizable integration experience, perfectly tailored to your Pipedrive environment.
                    </P>
                    <P className='mt-2 !font-semibold text-center'>
                        Load your deal stages, custom fields, Pipedrive users, and many other elements of your setup with a single click. Effortlessly map WooCommerce data to your Pipedrive fields.
                    </P>
                    <P className='mt-2 !font-semibold text-center'>
                        Synchronize deal stages, user labels, and any other settings needed to seamlessly align Pipedrive with your Woocommerce workflow, giving you total control over your data.
                    </P>
                </Container>
            </Container>
        </Section>
    )
}
