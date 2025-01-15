import React from 'react'
import Section from '../../_components/_containers/Section'
import Container from '../../_components/_containers/Container'
import H1 from '../../_components/_tag/H1'
import H3 from '../../_components/_tag/H3'
import Image from 'next/image'
import L_R_SectionContent from '../../_components/_containers/L_R_SectionContent'
import KeyPointDev from '../../_components/_svg/KeyPointDev'
import P from '../../_components/_tag/P'
import KeyPoint from '../../_components/_svg/KeyPoint'
import H2 from '../../_components/_tag/H2'

export default function HistoricalSync() {
    return (
        <Section>
            <Container large={true} >

                <div className='mb-12 lg:mb-20'>
                    <H2 className='text-center'>Access to Historical Sync</H2>
                    <H3>Access past sync to verify data integrity and adjust settings</H3>
                </div>

                {/* DESKTOP */}
                <div className='xl:block hidden'>
                    <div className='relative mt-16'>
                        <div className='flex justify-between items-start gap-2 px-[180px] 2xl:px-[250px] w-full'>
                            <div className='flex-1 font-semibold'>Event fired <br />on your website</div>
                            <div className='flex-1'>
                                <div className='font-semibold'>Pipedrive category</div>
                                <div className='font-medium'>(deal, organization, person)</div>
                            </div>
                            <div className='flex-1'>
                                <div className='font-semibold'>Source that triggered the event
                                    <span className='font-medium'> (order, user)</span></div>
                            </div>
                            <div className='flex-1 font-semibold'>Pipedrive target id</div>
                        </div>

                        <div className='mx-auto mt-4 px-[150px] 2xl:px-[180px] w-full'>
                            <Image
                                width={10000}
                                height={785}
                                src='/img/historical-sync.svg'
                                alt="Plugin screenshot whowing hystorical data-sync"
                            />
                        </div>

                        <div className='top-[30%] 2xl:top-[29%] left-0 absolute flex flex-col gap-6 2xl:gap-10 w-[150px] font-semibold'>
                            <div>Review the data sent to Pipedrive fields.</div>
                            <div>View the products added to Pipedrive deals.</div>
                        </div>

                        <div className='top-[40%] 2xl:top-[37%] right-0 text-right absolute flex flex-col gap-10 w-[176px] 2xl:w-[190px] font-semibold'>
                            <div>Traceback feature to review all interactions with Pipedrive in detail, based on your parameters</div>
                        </div>
                    </div>
                    <div className='ml-[180px] w-[250px] font-semibold'>Syncs run automatically, <br />but can be triggered manually for faster updates</div>
                </div>

                {/* MOBILE / TAB */}
                <div className='block relative xl:hidden'>
                    <div className='mx-auto w-full'>
                        <L_R_SectionContent

                            left={
                                <Image
                                    width={10000}
                                    height={785}
                                    src='/img/historical-sync-phone.svg'
                                    alt="Plugin screenshot whowing hystorical data-sync"
                                />
                            }
                            right={
                                <div className='flex flex-col gap-4'>
                                    <div className='flex gap-2'>
                                        <div className='flex-shrink-0'>
                                            <KeyPoint width={30} />
                                        </div>
                                        <P className='!font-semibold'>
                                            Consult every event triggered on your website, their Pipedrive category (deal, organization, person), source (user, order), and Pipedrive target ID.
                                        </P>
                                    </div>
                                    <div className='flex gap-2'>
                                        <div className='flex-shrink-0'>
                                            <KeyPoint width={30} />
                                        </div>
                                        <P className='!font-semibold'>
                                            Review the data sent to Pipedrive fields and view the products added to Pipedrive deals.
                                        </P>
                                    </div>
                                    <div className='flex gap-2'>
                                        <div className='flex-shrink-0'>
                                            <KeyPoint width={30} />
                                        </div>
                                        <P className='!font-semibold'>
                                            Use the traceback feature to review all interactions with Pipedrive in detail, based on your parameters.
                                        </P>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>

                <P className='mt-16 !font-semibold text-center'>
                    Easily review past sync data to verify accuracy and adjust your settings.
                </P>
                <P className='mt-2 !font-semibold text-center'>
                    W2P provides detailed logs of every event, including its source (order, user) and Pipedrive target (deal, organization, or person).
                </P>
                <P className='mt-2 !font-semibold text-center'>
                    Use the traceback feature to audit interactions and syncs, and manually trigger updates for immediate results.
                </P>
            </Container>
        </Section>
    )
}
