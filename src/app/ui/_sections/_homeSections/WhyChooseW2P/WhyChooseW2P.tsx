import React from 'react'
import KeyPointsettings from '../../../_components/_svg/KeyPointsettings'
import Section from '../../../_components/_containers/Section'
import Container from '../../../_components/_containers/Container'
import H3 from '../../../_components/_tag/H3'
import H2 from '../../../_components/_tag/H2'
import OnOffCheckbox from '../../../_components/_form/checkbox/OnOffCheckbox/OnOffCheckbox'
import P from '../../../_components/_tag/P'
import UltimateButton from '../../../_components/buttons/UltimateButton'

export default function WhyChooseW2P() {

    const comparativeFeatures = [
        {
            label: "Unlimited Requests",
            id: 1,
            w2p: true,
            online: false,
            plugin: true,
        },
        {
            label: "Field Customization",
            id: 2,
            w2p: true,
            online: true,
            plugin: true,
        },
        {
            label: "One click setup",
            id: 3,
            w2p: true,
            online: false,
            plugin: false,
        },
        {
            label: "One-Click Historical Sync",
            id: 4,
            w2p: true,
            online: false,
            plugin: true,
        },
        {
            label: "WooCommerce and Pipedrive Data Conditions",
            id: 5,
            w2p: true,
            online: false,
            plugin: false,
        },
        {
            label: "Full Pipedrive Structure Import for Field Mapping",
            id: 6,
            w2p: true,
            online: true,
            plugin: false,
        },
    ]
    return (
        <Section
            style={{
                background: 'var(--Linear, linear-gradient(208deg, #FFF 0%, #DEFFEF 100%))'
            }}
        >
            <Container>
                <div className="mb-12">
                    <H2 className='mb-4 pt-4 text-left'>
                        <div className="flex justify-center items-center gap-4">
                            <KeyPointsettings width={35} height={35} />
                            <div>Why Choose W2P</div>
                        </div>
                    </H2>
                    <H3>The Best WooCommerce to Pipedrive Integration of two world for Seamless Data Synchronization.</H3>
                </div>


                <div className="inline-block align-middle">
                    {/* DEKSTOP / TABLET */}
                    <table className="md:block hidden min-w-full">
                        <thead>
                            <tr>
                                <th scope="col">
                                </th>
                                <th scope="col" className="align-bottom px-4 py-3.5 font-semibold text-base text-center text-darkPurple">
                                    W2P (Our Plugin)
                                </th>
                                <th scope="col" className="align-bottom px-4 py-3.5 font-semibold text-base text-center text-darkPurple">
                                    Online Automation<br />Platforms
                                </th>
                                <th scope="col" className="align-bottom py-3.5 pr-4 sm:pr-0 pl-4 font-semibold text-base text-center text-darkPurple">
                                    Plugin-Based Tools
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparativeFeatures.map(feature =>
                                <tr className='divide-x divide-gray-200' key={feature.id}>
                                    <td className='text-right py-3.5 pr-6'>{feature.label}</td>
                                    <td>
                                        <div className='flex justify-center'>
                                            <OnOffCheckbox checked={feature.w2p} readOnly={true} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='flex justify-center'>
                                            <OnOffCheckbox checked={feature.online} readOnly={true} />
                                        </div>
                                    </td>
                                    <td >
                                        <div className='flex justify-center'>
                                            <OnOffCheckbox checked={feature.plugin} readOnly={true} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* MOBILE */}
                    <table className="block md:hidden min-w-full" aria-hidden="true">
                        <thead>
                            <tr>
                                <th scope="col" className="align-bottom px-4 py-3.5 font-semibold text-base text-center text-darkPurple">
                                    W2P (Our Plugin)
                                </th>
                                <th scope="col" className="align-bottom px-4 py-3.5 font-semibold text-base text-center text-darkPurple">
                                    Online Automation<br />Platforms
                                </th>
                                <th scope="col" className="align-bottom py-3.5 pr-4 sm:pr-0 pl-4 font-semibold text-base text-center text-darkPurple">
                                    Plugin-Based Tools
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparativeFeatures.map(feature =>
                                <React.Fragment key={feature.id}>
                                    <tr>
                                        <td colSpan={3} className='p-3.5 font-semibold text-center'>{feature.label}</td>
                                    </tr>
                                    <tr className='border-gray-200 border-b'>
                                        <td>
                                            <div className='flex justify-center p-2'>
                                                <OnOffCheckbox checked={feature.w2p} readOnly={true} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='flex justify-center p-2'>
                                                <OnOffCheckbox checked={feature.online} readOnly={true} />
                                            </div>
                                        </td>
                                        <td >
                                            <div className='flex justify-center p-2'>
                                                <OnOffCheckbox checked={feature.plugin} readOnly={true} />
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )}
                        </tbody >
                    </table>
                </div>

                <P className='mt-20 text-center'>
                    Our solution combines the best of both worlds: the flexibility and adaptability of online automation platforms and the reliability and simplicity of plugin-based tools.
                </P>
                <P className='mt-2 text-center'>
                    By bridging these approaches, we offer a <strong>powerful integration </strong>that is both easy to set up and highly customizable, ensuring it adapts seamlessly to your business needs while maintaining the robust performance you expect.
                </P>

                <div className='flex justify-center mt-12'>
                    <UltimateButton
                        href={"/#pricing"}
                        className='!bg-pipedrive'
                    >
                        Start Syncing
                    </UltimateButton>
                </div>

            </Container>
        </Section >
    )
}
