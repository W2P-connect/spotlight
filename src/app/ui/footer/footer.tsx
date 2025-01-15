import { menu, menu2 } from "constantes"
import Logo from "../_components/_branding/Logo"
import Container from "../_components/_containers/Container"
import Newsletter from "./Newsletter"
import Logo2 from "@/app/ui/_components/_branding/Logo2"
import Link from "next/link"
import Image from "next/image"

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
const navigation = {
    solutions: [
        { name: 'Marketing', href: '#' },
        { name: 'Analytics', href: '#' },
        { name: 'Commerce', href: '#' },
        { name: 'Insights', href: '#' },
    ],
    support: [
        { name: 'Pricing', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Guides', href: '#' },
        { name: 'API Status', href: '#' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Jobs', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Partners', href: '#' },
    ],
    legal: [
        { name: 'Claim', href: '#' },
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer
            className="relative bg-cover bg-center"
            aria-labelledby="footer-heading"
        >
            <div className="sr-only">Footer</div>
            <Container className="relative z-10 py-12">
                <div className="flex sm:flex-row flex-col justify-around items-center sm:items-start gap-4">
                    <Logo />
                    <div className="flex flex-col sm:justify-center gap-y-2">
                        {
                            menu.map((item, index) =>
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="font-medium text-base text-center sm:text-left lg:text-lg"
                                >
                                    {item.label}
                                </Link>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-y-2">
                        {
                            menu2.map((item, index) =>
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="font-medium text-base text-center sm:text-left lg:text-lg"
                                >
                                    {item.label}
                                </Link>
                            )
                        }
                    </div>
                </div>
            </Container>
            <div className="top-0 z-0 absolute w-full h-full">
                <Image
                    src="/img/bg-grey-2.jpg"
                    fill
                    style={{ objectFit: "cover" }}
                    alt="beautiful gray background"
                />
            </div>
        </footer >
    )
}
