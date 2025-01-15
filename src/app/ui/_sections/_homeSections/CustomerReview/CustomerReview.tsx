import Container from '@/app/ui/_components/_containers/Container'
import L_R_SectionContent from '@/app/ui/_components/_containers/L_R_SectionContent'
import Section from '@/app/ui/_components/_containers/Section'
import H2 from '@/app/ui/_components/_tag/H2'
import React from 'react'

export default function CustomerReview() {
    return (
        <Section>
            <Container>
                <H2 className='mb-4 text-center'>What Our Customers Say</H2>
                <div className='mb-12 md:mb-24 h3Style'>Hear from businesses using W2P to streamline their workflow</div>
                <L_R_SectionContent
                    classeName='!items-start !gap-16'
                    left={
                        <div className="">
                            <p className="mb-4 text-gray-800 text-lg italic">
                                I was amazed at how easy it was to connect WooCommerce with Pipedrive using W2P. Even as a non-tech-savvy person, I had everything up and running in minutes. What really stood out to me was the use of primary keys, like email addresses, to detect if a contact already exists in Pipedrive. This feature ensures updates are seamless without creating duplicates, which has been a game-changer compared to other tools like Make or Zapier. Highly recommended!
                            </p>
                            <div className="text-right">
                                <span className="font-semibold">Harold G. CEO </span>
                                from <a className=""
                                    href="https://analyse-llfc.fr/" target="_blank">
                                    analyse-cbd.fr
                                </a>
                            </div>
                        </div>
                    }
                    right={
                        <div className="">
                            <p className="mb-4 text-gray-800 text-lg italic">
                                W2P is truly a comprehensive tool that exceeded my expectations. One feature I particularly appreciated was the ability to send customer connection data directly to Pipedrive, which allowed me to re-engage inactive clients before losing them. Another standout was the option to exclude specific fields from being updated in Pipedrive. This made it easy to enrich client profiles with new information while preserving key fields set by our sales team, such as the lead&apos;s origin (website, trade show, outreach, etc.). It&apos;s a must-have for any business looking to streamline their sales processes!</p>
                            <div className="text-right">
                                <span className="font-semibold">
                                    Lauriane Q. Sales manager</span> from <a className=""
                                        href="https://llfc.fr/" target="_blank">
                                    llfc.fr
                                </a>
                            </div>
                        </div>
                    }
                />
            </Container>
        </Section>
    )
}
