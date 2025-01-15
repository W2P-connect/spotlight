import MainButton from "../../../_components/buttons/MainButton";
import H1 from "@/app/ui/_components/_tag/H1";
import H2 from "../../../_components/_tag/H2";
import Section from "../../../_components/_containers/Section";
import Workflow from "../../../_components/_svg/Workflow";
import Image from "next/image";
import P from "../../../_components/_tag/P";
import Container from "../../../_components/_containers/Container";
import { linkHelper } from "constantes";
import H3 from "../../../_components/_tag/H3";

export default function BetterWorkflowSection() {
    return (
        <Section
            className="bg-cover bg-center"
            style={{
                backgroundImage: "url('/img/bg-grey.jpg')",
            }}
        >
            <Container>
                <div className="mb-12 sm:mb-24">
                    <H2 className='mb-4 pt-4 text-center'>
                        <div className="flex justify-center items-center gap-4">
                            <div className="md:block hidden" >
                                <Workflow />
                            </div>
                            <div className="md:whitespace-nowrap">Seamless Integration</div>
                        </div>
                    </H2>

                    <div className="h3Style">W2P is a WordPress plugin that integrates directly with your WooCommerce store, syncing its activities with Pipedrive for streamlined business management.</div>
                </div>

                <div className='flex justify-center'>
                    <div className="relative flex md:flex-row flex-col justify-between items-stretch gap-y-36 w-full max-w-[950px]">
                        <div className="relative z-10 bg-gradient-to-br from-white to-[#EFE5FF] shadow-[8px_10px_24px_rgba(25,13,48,0.14)] px-4 py-4 md:py-6 rounded-lg w-full md:max-w-[33%] 4">
                            <div className="flex justify-center pb-2 md:pb-4 border-b">
                                <Image
                                    src='/img/woocommerce-logo-1.png'
                                    width={260}
                                    height={100}
                                    alt="woocommerce logo"
                                    className="md:w-full max-w-[180px] h-auto object-contain"
                                />
                            </div>
                            <div className="pt-4">
                                <P className="!font-medium text-center md:text-left">W2P operates seamlessly in the background, ensuring a smooth experience for your customers without interrupting their journey on your site.</P>
                                <P className="!font-medium text-center md:text-left">Every interaction, from browsing to purchasing, remains uninterrupted, allowing your customers to engage with confidence.</P>
                            </div>
                        </div>
                        <div className="top-1/2 left-1/2 z-0 absolute flex justify-center items-center mx-auto w-full max-w-[630px] md:max-w-[630px] h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none md:rotate-0 rotate-90">
                            <Image
                                src="/img/plugin-1.png"
                                alt="connection between WooCommerce and Pipedrive"
                                className="sm:w-[60%] md:w-full h-auto object-contain"
                                width={630}
                                height={300}
                            />
                        </div>
                        <div className="relative z-10 bg-gradient-to-br from-white to-[#DEFFEF] shadow-[8px_10px_24px_rgba(25,13,48,0.14)] px-4 py-4 md:py-6 rounded-lg w-full md:max-w-[33%]">
                            <div className="flex justify-center pb-2 md:pb-4 border-b">
                                <Image
                                    src='/img/pipedrive-logo-1.png'
                                    width={260}
                                    height={100}
                                    className="md:w-full max-w-[180px] h-auto object-contain"
                                    alt="Pipedrive logo"
                                />
                            </div>
                            <div className="pt-4">
                                <P className="!font-medium text-center md:text-left">Effortlessly load your Pipedrive configurations to tailor your settings perfectly to your organization’s needs. </P>
                                <P className="!font-medium text-center md:text-left">With flexible options, you can match W2P to your unique sales process, creating a unified experience that enhances your workflow. </P>
                            </div>
                        </div>
                    </div>
                </div>

                <P className='!mt-12 !font-medium !text-center'>
                    Our plugin seamlessly <strong>adapts to your unique WooCommerce and Pipedrive settings</strong>, ensuring the perfect configuration for your business needs. <br />
                </P>
                <P className="mt-2 !font-medium !text-center">
                    Unlike other solutions, W2P offers <strong>unmatched customization</strong>, providing flexibility you won’t find anywhere else.
                </P>
                <div className='flex justify-center gap-2 mt-8 mb-12'>
                    <MainButton
                        href={linkHelper.setupGuide.link}
                        style={2}
                    >
                        Setup guide
                    </MainButton>
                </div>
            </Container>
        </Section >
    )
}
