import React from 'react'
import Section from '../../_components/_containers/Section'
import H2 from '../../_components/_tag/H2'
import P from '../../_components/_tag/P'
import Container from '../../_components/_containers/Container'
import T_B_SectionContent from '../../_components/_containers/T_B_SectionContent'
import Image from 'next/image'
import Link from 'next/link'
import { linkHelper } from 'constantes'

export default function GrabACoffee() {
    return (
        <Section
            fullWidth={false}
        >
            <Container
                className='relative !px-0 py-12 overflow-hidden'
                large={true}
            >
                <Container className='relative z-10'>
                    <H2 className='mb-6 !text-[32px] md:!text-[54px]'>
                        5. Grab a Coffee and Relax
                    </H2>
                    <T_B_SectionContent
                        top={
                            <div>
                                <Image
                                    className='flex-shrink-0 shadow-xl rounded-[14px]'
                                    width={1220}
                                    height={530}
                                    src={'/img/_sections/features/grab a coffee.jpg'}
                                    alt='Someone grab a Coffee'
                                />
                            </div>
                        }
                        bottom={<div>
                            <P className='mb-2'>
                                Congratulations! Your W2P setup is complete. Now sit back, grab a coffee, and let W2P handle the heavy lifting. With everything running smoothly in the background, you can focus on what matters most—growing your business.
                            </P>
                            <P className='mt-4'>Need assistance with the setup? <Link className='!font-semibold underline' href={linkHelper.contact.link}>We&apos;re here to help</Link></P>
                        </div>
                        }
                    />

                </Container>
                <Image
                    src={"/img/bg-green.jpg"}
                    width={1920}
                    height={1080}
                    alt="beautifull background from pipedrive color"
                    className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                    style={{ objectFit: "cover" }}
                />
            </Container>
        </Section >
    )
}
