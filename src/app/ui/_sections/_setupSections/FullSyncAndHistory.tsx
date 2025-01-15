import React from 'react'
import Section from '../../_components/_containers/Section'
import H2 from '../../_components/_tag/H2'
import P from '../../_components/_tag/P'
import Container from '../../_components/_containers/Container'
import T_B_SectionContent from '../../_components/_containers/T_B_SectionContent'
import Image from 'next/image'
import YouTubeEmbed from '../../_components/YouTubeEmbed/YouTubeEmbed'

export default function FullSyncAndHistory() {
    return (
        <Section
            className="relative flex flex-col justify-center items-center pb-0 sm:pb-0 lg:pb-0"
        >
            <Container className="z-10 pb-24">
                <H2 className='mb-6 !text-[32px] md:!text-[54px]'>
                    4. Running a Full Sync,
                    Monitoring History
                </H2>
                <T_B_SectionContent
                    bottom={<div>
                        <P>
                            Once your settings are configured, you can initiate a full synchronization to <strong>send all users and orders to Pipedrive</strong> based on the parameters defined in the previous steps.
                        </P>
                        <P className='mt-2'>
                            Use the History tab to <strong>review the data successfully transferred to Pipedrive.</strong> This tab provides a log of all interactions, allowing you to verify that everything is functioning as expected.
                        </P>
                    </div>

                    }
                    top={<div className='relative shadow-xl rounded-[14px] w-full overflow-hidden' style={{ aspectRatio: '16/9' }}>
                        <YouTubeEmbed videoId='Icv7Cf90ML0' />
                    </div>}
                />
            </Container>

            <Image
                src={"/img/bg-grey.jpg"}
                alt="beautifull gray background"
                className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                fill
                style={{ objectFit: "cover" }}
            />
        </Section >
    )
}
