import Image from "next/image";
import KeyPoint from "../../../_components/_svg/KeyPoint";
import CartPoint from "../../../_components/_cards/cardPoint/CartPoint";
import H2 from "../../../_components/_tag/H2";
import Section from "../../../_components/_containers/Section";
import Container from "../../../_components/_containers/Container";
import MainButton from "../../../_components/buttons/MainButton";
import { linkHelper } from "constantes";
import H3 from "../../../_components/_tag/H3";

const carts = [
    {
        title: "Seamless User Experience",
        content:
            "Completely transparent for users navigating your site, ensuring no disruption to their experience",
    },
    {
        title: "Fully Customizable with Pipedrive Settings",
        content:
            "Adapt W2P to your unique Pipedrive setup for a perfectly tailored integration that aligns with your organization’s structure",
    },
    {
        title: "Unlimited Requests",
        content:
            "Unlike other solutions, W2P allows unlimited requests to Pipedrive for seamless, real-time synchronization without constraints",
    },
    {
        title: "Ready to Start",
        content:
            "Pre-configured with default settings for a quick, hassle-free setup, so you can start syncing right away",
    },
    {
        title: "One-Click Historical Sync",
        content:
            "Catch up on past activity with a single click. Instantly synchronize your entire historical data to Pipedrive and bridge any gaps",
    },
];

export default function FeaturesAbstract() {
    return (
        <Section fullWidth={false}>
            <Container className="relative flex flex-col justify-start items-center xl:max-h-[920px] overflow-hidden"
                large={true}
            >
                <div className="z-10">
                    <div className="my-12 xl:my-20">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <KeyPoint outline="black" fill="none" />
                            <H2 className="mt-0">Key Points</H2>
                        </div>
                        <H3>Built for Flexibility: Simple Solutions for Complex Workflows</H3>
                    </div>

                    {/* DEKSTOP */}
                    <div className="xl:block hidden px-8 pb-0 w-full">
                        <div className="top-40 xl:top-72 left-0 absolute px-2 xl:px-36 w-full h-full"
                            style={{
                                background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.1) 50%)'
                            }}>
                            <div className="relative w-full w-max-[1220px]">
                                <div className="left-0 absolute shadow-2xl">
                                    <CartPoint
                                        title={carts[0].title}
                                        content={carts[0].content}
                                        className="w-[460px]"
                                    />
                                </div>
                                <div className="top-[75px] right-0 absolute shadow-2xl">
                                    <CartPoint
                                        title={carts[1].title}
                                        content={carts[1].content}
                                        className="w-[330px]"
                                    />
                                </div>
                                <div className="top-[200px] left-0 absolute shadow-2xl">
                                    <CartPoint
                                        title={carts[2].title}
                                        content={carts[2].content}
                                        className="w-[380px]"
                                    />
                                </div>
                                <div className="top-[300px] right-0 absolute shadow-2xl">
                                    <CartPoint
                                        title={carts[3].title}
                                        content={carts[3].content}
                                        className="w-[480px]"
                                    />
                                </div>
                                <div className="top-[450px] left-0 absolute">
                                    <CartPoint
                                        title={carts[4].title}
                                        content={carts[4].content}
                                        className="w-[500px]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <Image
                                src={'/img/Historical-sync-2.svg'}
                                width={1025}
                                height={747}
                                alt="W2P plugin picture"
                                className="shadow-2xl mx-auto rounded-t-xl"
                            />
                        </div>
                    </div>

                    {/* MOBILE / TABLETE */}
                    <div className="flex flex-col gap-4 xl:hidden px-4 sm:px-4 pb-6 sm:pb-6" aria-hidden="true">
                        {carts.map((cart, index) =>
                            <CartPoint
                                key={index}
                                title={cart.title}
                                content={cart.content}
                                className="shadow-none" />
                        )}
                    </div>
                </div>

                <Image
                    src={"/img/bg-main.jpg"}
                    width={1920}
                    height={1080}
                    alt="beautifull background from woocommerce and pipedrive color"
                    className="top-0 right-0 bottom-0 left-0 absolute w-full h-full"
                    style={{ objectFit: "cover" }}
                />
            </Container>

            <div className="flex justify-center mt-12">
                <MainButton href={linkHelper.features.link} style={2} >Learn More</MainButton>
            </div>
        </Section>
    )
}
