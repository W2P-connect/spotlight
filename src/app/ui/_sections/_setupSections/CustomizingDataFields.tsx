import React from 'react'
import Section from '../../_components/_containers/Section'
import H2 from '../../_components/_tag/H2'
import P from '../../_components/_tag/P'
import Container from '../../_components/_containers/Container'
import T_B_SectionContent from '../../_components/_containers/T_B_SectionContent'
import Image from 'next/image'
import YouTubeEmbed from '../../_components/YouTubeEmbed/YouTubeEmbed'

export default function CustomizingDataFields() {
    return (
        <Section
            fullWidth={false}
        >
            <Container
                className='relative !px-0 py-12 overflow-hidden'
                large={true}
                style={{
                    backgroundImage: `
                    linear-gradient(transparent 45%, rgba(0, 0, 0, 0.6) 100%),
                  `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container className='relative z-20'>
                    <H2 className='text-shadow-md mb-6 !text-[32px] text-white md:!text-[54px]'>
                        3. Customizing Data Fields and Conditions
                    </H2>
                    <T_B_SectionContent
                        top={<div className='relative shadow-xl rounded-[14px] w-full overflow-hidden' style={{ aspectRatio: '16/9' }}>
                            <YouTubeEmbed videoId='hgEH0zHfYT4' />
                        </div>}
                        bottom={<div>
                            <P className='text-shadow-md mb-2 text-white'>
                                For each event, <strong>define the Pipedrive fields</strong> you want to populate and customize the data based on user information to ensure each synchronization is as precise as possible.
                            </P>
                            <P className='text-shadow-md mb-2 text-white'>
                                You can <strong>set conditions</strong> to prevent overwriting existing data in Pipedrive by updating fields only if they are empty.<br />
                                Additionally, create backup fields for cases where certain values haven’t been provided by the user, ensuring that relevant information is always sent to Pipedrive.
                            </P>
                        </div>
                        }
                    />
                </Container>


                <div className='top-0 right-0 bottom-0 left-0 z-10 absolute w-full h-full'
                    style={{ background: 'linear-gradient(transparent , rgba(0, 0, 0, 0.4) 100%)' }}
                >
                </div>

                <Image
                    src={"/img/bg-purple.jpg"}
                    width={1920}
                    height={1080}
                    alt="beautifull background from woocommerce color"
                    className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                    style={{ objectFit: "cover" }}
                />
            </Container>
        </Section >
    )
}
