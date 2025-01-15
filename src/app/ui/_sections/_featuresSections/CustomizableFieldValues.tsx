import React from 'react'
import Section from '../../_components/_containers/Section'
import Container from '../../_components/_containers/Container'
import H3 from '../../_components/_tag/H3'
import H1 from '../../_components/_tag/H1'
import QuatuorPoints from '../../_components/_svg/QuatuorPoints'
import P from '../../_components/_tag/P'
import MetaKeyCarrousesel from '../../_components/MetaKeyCaroussell/metaKeyCaroussell'
import Image from 'next/image'
import ConditionMaker from '../../_components/_features/conditionMaker/ConditionMaker'
import HookField from '../../_components/_features/hookField/HookField'
import ArrowToLeft from '../../_components/_svg/ArrowToLeft'
import KeyPointsettings from '../../_components/_svg/KeyPointsettings'
import H2 from '../../_components/_tag/H2'

export default function CustomizableFieldValues() {
    return (
        <Section style={{
            background: "linear-gradient(208deg, #FFF 0%, #DEFFEF 100%)"
        }}>
            <Container large={false}>
                <div className='mb-12 lg:mb-20'>
                    <H2 className='text-center'>Customizable Field Values</H2>
                    <H3>Easily customize field values for precise data mapping to Pipedrive</H3>
                </div>

                <P className='mt-12 !font-semibold'>
                    W2P allows you to customize field values for precise and efficient data mapping to Pipedrive.
                </P>
                <P className='mt-2 !font-semibold'>
                    Use predefined WooCommerce variables like billing names, emails, and shipping details, or use your own custom website meta data.
                </P>
                <P className='mt-2 mb-20 !font-semibold'>
                    Add fallback values and use conditional settings to ensure your data syncs perfectly, even when some variables are missing.
                </P>

                <div>
                    <div className='flex gap-4 max-w-[480px]'>
                        <div className='flex-shrink-0 mt-1.5'>
                            <QuatuorPoints />
                        </div>
                        <div className='font-semibold text-base md:text-lg lg:text-xl'>Choose from dozens of predefined variables or use your own custom ones</div>
                    </div>
                    <MetaKeyCarrousesel />
                </div>

                <div className='flex gap-4 mt-20 mb-6 max-w-[363px]'>
                    <div className='flex-shrink-0 mt-1.5'>
                        <QuatuorPoints />
                    </div>
                    <div className='font-semibold text-base md:text-lg lg:text-xl'>Use them to send data seamlessly to Pipedrive.</div>
                </div>

                {/* DESKTOP */}
                <div className='relative xl:flex hidden'>
                    <div className='bg-white shadow-xl p-4 rounded-xl w-[55%]'>
                        <HookField />
                    </div>
                    <div className='flex gap-6'>
                        <div className='top-4 left-60 absolute flex flex-col w-[60%]'>
                            <div className='flex gap-4'>
                                <Image
                                    src='img/assets/rounded-arrow.svg'
                                    width={450}
                                    height={282}
                                    alt='arrow'
                                />
                                <P className='mt-2 !font-semibold'>Edit any Pipedrive Field</P>
                            </div>
                            <div className='relative left-[150px] flex items-center gap-4 mt-10'>
                                <ArrowToLeft width={300} />
                                <P className='!font-semibold'>Define custom field values for Pipedrive
                                    <br />based on the customer account </P>
                            </div>
                            <div className='relative left-[200px] flex items-center gap-4 mt-[65px]'>
                                <ArrowToLeft width={250} />
                                <P className='!font-semibold'>Define fallback
                                    <br />values if customer variables are invalid or missing
                                </P>
                            </div>

                        </div>
                    </div>
                </div>

                {/* MOBILE / TAB  */}
                <div className='flex lg:flex-row flex-col items-center gap-6 xl:hidden'>
                    <div className='bg-white shadow-xl p-4 rounded-xl w-full'>
                        <HookField />
                    </div>
                    <div className='flex flex-col gap-4 lg:gap-6 w-full'>
                        <div className='flex items-center gap-4'>
                            <div className='flex-shrink-0'>
                                <KeyPointsettings />
                            </div>
                            <P className='mt-2 !font-semibold'>Edit any Pipedrive Field</P>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex-shrink-0'>
                                <KeyPointsettings />
                            </div>
                            <P className='!font-semibold'>Define custom field values for Pipedrive based on the customer account</P>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex-shrink-0'>
                                <KeyPointsettings />
                            </div>
                            <P className='!font-semibold'>Define fallback values if customer variables are invalid or missing</P>
                        </div>
                    </div>
                </div>

                <div className='mt-20'>
                    <div className='flex gap-4 max-w-[480px]'>
                        <div className='flex-shrink-0 mt-1.5'>
                            <QuatuorPoints />
                        </div>
                        <div className='font-semibold text-base md:text-lg lg:text-xl'>Use condition and additional settings to perfectly match your specific needs</div>
                    </div>

                    <div className='bg-white shadow-xl mt-2 p-4 rounded-xl'>
                        <div className='mb-4 font-semibold text-xl'>
                            Condition
                        </div>
                        <div className='flex flex-col -2 gap'>
                            <div className='mb-2'>
                                <ConditionMaker />
                            </div>

                            <div>
                                <label className='flex items-start gap-2 cursor-pointer'>
                                    <input className='mt-1.5' type='checkbox' defaultChecked />
                                    Do not update if there is already a value for this field on Pipedrive
                                </label>
                            </div>

                            <div>
                                {
                                    <label className='flex items-start gap-2'>
                                        <input className='mt-1.5' type='checkbox' defaultChecked />
                                        If a person in Pipedrive already has this value for this field, link their WooCommerce account to that person. (only if it&apos;s not already linked).
                                    </label>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    )
}
