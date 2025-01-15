import React from 'react'
import Section from '../../_components/_containers/Section'
import Container from '../../_components/_containers/Container'
import H3 from '../../_components/_tag/H3'
import H1 from '../../_components/_tag/H1'
import Image from 'next/image'
import CartFeature from '../../_components/_cards/cardPoint/CartFeature'
import KeyPointDev from '../../_components/_svg/KeyPointDev'
import Checked from '../../_components/_svg/Checked'
import H2 from '../../_components/_tag/H2'

export default function Features() {
    return (
        <Section>
            <Container large={true}>
                <div className='mb-12'>
                    <H2 className='text-center'>Features
                        <div className='h3Style'>Everything you need for a smooth and powerful integration</div>
                    </H2>
                </div>
                <Container
                    style={{
                        backgroundImage: 'url(/img/bg-grey.jpg)'
                    }}
                    large={true}
                    className='px-12 py-4 md:py-6 xl:py-12'
                >
                    {/* DESKTOP */}
                    <div className='xl:block relative hidden h-full'>
                        <div className='top-0 left-0 absolute flex flex-col justify-between h-[calc(100%-50px)] max-h-[530px]'>
                            <div className='flex flex-col gap-6'>
                                <Image
                                    src="/img/pipedrive-logo-1.png"
                                    width={230}
                                    height={145}
                                    alt='logo pipedrive'
                                />
                                <div className='max-w-80'>
                                    <CartFeature
                                        title='Personalized integration with your Pipedrive Setup'
                                    />
                                </div>
                                <div className='max-w-80'>
                                    <CartFeature
                                        title='One-Click Default Settings'
                                    />
                                </div>
                            </div>
                            <div className='max-w-[440px]'>
                                <CartFeature
                                    title='Custom WooCommerce Hooks Integration'
                                    customConent={
                                        <div className='mt-1 font-semibold text-woocommerce'>
                                            <ul className="ml-10 pl-5 list-disc">
                                                <li>Custom variable</li>
                                                <li>Customizable Field Values</li>
                                            </ul>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                        <div className='m-auto p-12 max-w-[80%]'>
                            <Image
                                src="/img/onlineWebSvg.svg"
                                width={1200}
                                height={500}
                                alt='pipeline between Pipedrive and your website.'
                            />
                        </div>
                        <div className='right-0 bottom-0 absolute flex flex-col justify-between h-[calc(100%-100px)] max-h-[530px]'>
                            <div className='flex flex-col gap-6'>
                                <div className='max-w-[300px]'>
                                    <CartFeature
                                        title='Unlimited Requests'
                                    />
                                </div>
                                <div className='max-w-[300px]'>
                                    <CartFeature
                                        title='Conditional Logic for Field Updates'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <Image
                                    src="/img/pipedrive-logo-1.png"
                                    width={230}
                                    height={100}
                                    alt='logo pipedrive'
                                />
                                <div className='flex items-center gap-2'>
                                    <Checked />
                                    <span className='font-bold text-base md:text-lg'>Access to Historical Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE / TAB */}
                    <div className='relative flex flex-col items-center xl:hidden h-full'>
                        <div className='relative bottom-0 z-20 flex lg:flex-row flex-col items-center lg:items-start gap-6'>
                            <div className='z-10 lg:absolute flex flex-col lg:justify-between items-center lg:items-start gap-6 lg:max-w-[44%] h-[calc(100%-50px)]'>
                                <div className='flex flex-col items-center lg:items-start gap-6'>
                                    <div className='sr-only'>Logo Pipedrive</div>
                                    <Image
                                        src="/img/pipedrive-logo-1.png"
                                        width={230}
                                        height={145}
                                        alt='logo pipedrive'
                                        className='backdrop-blur-lg lg:backdrop-blur-0 mb-6 p-2 rounded-2xl'
                                    />
                                    <div className='max-w-80'>
                                        <CartFeature
                                            title='Personalized integration with your Pipedrive Setup'
                                        />
                                    </div>
                                    <div className='max-w-80'>
                                        <CartFeature
                                            title='One-Click Default Settings'
                                        />
                                    </div>
                                </div>
                                <div className='max-w-[380px]'>
                                    <CartFeature
                                        title='Custom WooCommerce Hooks Integration'
                                        customConent={
                                            <div className='mt-1 font-semibold text-woocommerce'>
                                                <ul className="ml-10 pl-5 list-disc">
                                                    <li>Custom variable</li>
                                                    <li>Customizable Field Values</li>
                                                </ul>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                            <div className='z-0 backdrop-blur-lg m-auto max-w-[300px] lg:max-w-[50%]'>
                                <Image
                                    src="/img/onlineWebSvg-whithoutArrow.svg"
                                    width={1200}
                                    height={500}
                                    alt='pipeline between Pipedrive and your website.'
                                />
                            </div>
                            <div className='right-0 bottom-0 z-10 lg:absolute flex flex-col lg:justify-between items-center lg:items-start gap-4 lg:max-w-[40%] h-[calc(100%-75px)]'>
                                <div className='flex flex-col items-center lg:items-start gap-6'>
                                    <div className='max-w-[300px]'>
                                        <CartFeature
                                            title='Unlimited Requests'
                                        />
                                    </div>
                                    <div className='max-w-[300px]'>
                                        <CartFeature
                                            title='Conditional Logic for Field Updates'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col items-center lg:items-start gap-2 backdrop-blur-lg lg:backdrop-blur-0 mt-6 p-2 rounded-2xl'>
                                    <div className='sr-only'>Logo Pipedrive</div>
                                    <Image
                                        src="/img/pipedrive-logo-1.png"
                                        width={230}
                                        height={100}
                                        alt='logo pipedrive'
                                    />
                                    <div className='flex items-center gap-2'>
                                        <Checked />
                                        <span className='font-bold text-base md:text-lg'>Access to Historical Sync</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='z-10 absolute border-gray-500 lg:hidden border-r-2 h-[calc(100%-60px)]'>
                        </div>
                        <div className='relative -top-2 right-1 z-20 lg:hidden mt-6 transform rotate-[-20deg]'>
                            <Image
                                src={'/img/plane.svg'}
                                width={50}
                                height={50}
                                alt='Arrow from Pipedrive to Woocomerce to Pipedrive'
                            />
                        </div>
                    </div>
                </Container>
            </Container>
        </Section>
    )
}
