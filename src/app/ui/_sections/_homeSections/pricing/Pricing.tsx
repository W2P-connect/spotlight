import { Suspense } from 'react'
import Section from '../../../_components/_containers/Section';
import ChoosePlanFallback from '../../../_components/products/ChoosePlanFallback';
import H2 from '../../../_components/_tag/H2';
import H3 from '../../../_components/_tag/H3';
import Dollards from '../../../_components/_svg/Dollards';
import Container from '../../../_components/_containers/Container';
import ChoosePlanLoader from '../../../_components/products/ChoosePlanLoader';
import Image from 'next/image';
import P from '../../../_components/_tag/P';
import { linkHelper } from 'constantes';
import Link from 'next/link';

export default async function Pricing() {

    // const user = getCurrentUser()

    // const products = prisma.product.findMany({
    //     where: {
    //         active: true
    //     },
    //     include: {
    //         Prices: true,
    //     },
    // })

    return (
        <Section
            className="relative flex flex-col justify-center items-center bg-cover bg-center px-6"
            id='pricing'
        >

            <Container
                className='relative z-10'
                large={true}
            >
                <div className='my-8'>
                    <div className='flex justify-center items-center gap-4'>
                        <Dollards width={28} height={28} />
                        <div className='font-bold text-4xl text-pipedrive'>Pricing</div>
                    </div>
                    <H2 className='mt-4 text-center'>Choose the right plan for you</H2>
                    <H3 className='mt-4 font-semibold'>Flexible plans to fit your business needs and budget</H3>
                </div>
                <Suspense fallback={<ChoosePlanFallback />}>
                    <ChoosePlanLoader />
                </Suspense>

                <P className='mt-12'>Have any questions? <Link className='!font-semibold underline' href={linkHelper.contact.link}>We&apos;re here to help</Link></P>

            </Container>

            <div className="top-0 absolute w-full h-full">
                <Image
                    src="/img/bg-grey.jpg"
                    style={{ objectFit: "cover" }}
                    alt="beautiful gray background"
                    fill
                />
            </div>
        </Section>

    )
}
