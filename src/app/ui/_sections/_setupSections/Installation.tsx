import React from 'react'
import H2 from '../../_components/_tag/H2'
import Section from '../../_components/_containers/Section'
import P from '../../_components/_tag/P'
import Link from 'next/link'
import Container from '../../_components/_containers/Container'
import T_B_SectionContent from '../../_components/_containers/T_B_SectionContent'
import { linkHelper } from 'constantes'
import Image from 'next/image'
import YouTubeEmbed from '../../_components/YouTubeEmbed/YouTubeEmbed'

export default function Installation() {

    return (
        <Section
            className="relative flex flex-col justify-center items-center bg-cover bg-center pt-0 pb-0 sm:pb-0 lg:pb-0 overflow-hidden"
        >

            <Container className='z-10 flex-col pt-6 lg:pt-0 pb-24'>
                <H2 className='mb-6 !text-[32px] !text-left md:!text-[54px]'>
                    1. Installation
                </H2>
                <T_B_SectionContent
                    top={<div className='relative shadow-xl rounded-[14px] w-full overflow-hidden' style={{ aspectRatio: '16/9' }}>
                        <YouTubeEmbed videoId='LpV2RxdfQ_w' />
                    </div>}
                    bottom={<div>
                        <P>
                            Begin by installing our Woocommerce to Pipedrive integration plugin. You can download it from <Link className='underline' href={linkHelper.account.link}>your dashboard</Link>. Once installed, retrieve your W2P API key and your Pipedrive API key. These keys allow W2P to <strong>connect and synchronize data from WooCommerce to Pipedrive. </strong>
                            After entering the keys, <strong>load the default settings to set a basic configuration</strong>, providing an essential foundation to start synchronizing data.
                        </P>
                    </div>}
                />
            </Container>

            <Image
                src={"/img/bg-main.jpg"}
                fill
                alt="beautifull background from woocommerce and pipedrive color"
                className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                style={{ objectFit: "cover" }}
            />

            <div className='bottom-0 absolute bg-white w-full h-[75%]'></div>
        </Section >
    )
}
