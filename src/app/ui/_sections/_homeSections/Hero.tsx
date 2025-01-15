import Image from 'next/image';
import MainButton from '../../_components/buttons/MainButton';
import Section from '../../_components/_containers/Section';
import KeyPoint from '../../_components/_svg/KeyPoint';
import P from '../../_components/_tag/P';
import { linkHelper } from 'constantes';
import H2 from '../../_components/_tag/H2';

export default function Hero() {

    return (
        <Section
            className="relative flex flex-col justify-center items-center !pt-8 pb-0 sm:pb-0 lg:pb-0 h-full overflow-hidden">
            <div className='relative z-10 flex flex-col md:justify-between px-4 sm:px-6 h-full'>
                <div className='flex justify-center items-center h-full'>
                    <div>
                        <H2 className='!mt-2 mb-6 text-center'>
                            <div>The Best Way to Sync</div>
                            <div className='sm:mt-2 lg:mt-2'>
                                <span className='font-black text-woocommerce'>WooCommerce </span>
                                with
                                <span className='font-black text-pipedrive'> Pipedrive</span>
                            </div>
                        </H2>
                        <P className='mt-10 mb-10 !font-semibold text-center text-darkPurple text-lg md:text-[24px] tracking-tight'>
                            W2P is the data-sync plugin you’ve been looking for to effortlessly connect WooCommerce with Pipedrive. <br />
                            It offers a quick and easy setup with real-time syncing, giving you the peace of mind you need
                        </P>

                        <div className='flex justify-center gap-2 mt-8 mb-0'>
                            <MainButton
                                style={4}
                                href={linkHelper.features.link}
                            >
                                See What’s Inside
                            </MainButton>
                            <MainButton
                                href="/#pricing"
                                style={1}
                            >
                                Try for 15 DAYS FREE
                            </MainButton>
                        </div>
                    </div>
                </div>

                {/* DESKTOP */}
                <div className='relative lg:flex justify-center hidden px-40 2xl:px-28 w-full'>
                    <div className='top-2/3 -left-0 absolute backdrop-blur-lg lg:backdrop-blur-0 px-1 max-w-56'>
                        <P className='!font-semibold'>Customize exactly which data you want to sync—limitless possibilities.</P>
                    </div>
                    <div className='w-[88%]'>
                        <Image
                            src={"/img/hero dekstop.png"}
                            width={1300}
                            height={400}
                            alt='application screenshot'
                        />
                    </div>
                    <div className='right-0 bottom-1/4 absolute backdrop-blur-lg lg:backdrop-blur-0 px-1 max-w-56'>
                        <P className='!font-semibold'>Track in real-time everything sent to Pipedrive, allowing you to fine-tune your settings for optimal results.</P>
                    </div>
                    <div className='sr-only'>Plugin screenshot</div>
                </div>

                {/* MOBILE / TAB */}
                <div className='lg:hidden mt-12 w-full' aria-hidden="true">
                    <div className='flex flex-col gap-2 mb-6'>
                        <P className='flex items-center gap-2 !font-semibold'>
                            <span className="flex-shrink-0" >
                                <KeyPoint width={25} />
                            </span>
                            Customize exactly which data you want to sync—limitless possibilities
                        </P>
                        <P className='flex items-center gap-2 !font-semibold'>
                            <span className="flex-shrink-0" >
                                <KeyPoint width={25} />
                            </span>
                            Track in real-time everything sent to Pipedrive, allowing you to fine-tune your settings for optimal results.
                        </P>
                    </div>
                    <Image
                        src={"/img/hero-mobile.png"}
                        width={800}
                        height={177}
                        alt='application screenshot'
                        className='mx-auto'
                    />
                </div>
            </div>
            <div className='bottom-0 z-0 absolute w-full h-full lg:h-[46.5%]'>
                <Image
                    src={'/img/bg-main.jpg'}
                    width={10000}
                    height={5000}
                    alt='beatifull background'
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
            </div>
        </Section >
    )
}
