"use client";

import { Button } from "../ui/button";
import { Container } from "../craft";
import Link from "next/link";
import Image from "next/image";
import SecondaryTSTCLogo from "../../../public/secondary-tstc-logo.svg";

export const Footer = () => {
    return (
        <footer className="bg-tstc-dark-100 text-white py-4">
            <Container>
                <div className="mb-10 mt-20 text-7xl">Your better life starts here.</div>
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <Button key="Apply Now" variant="red" size="xl"><Link href="/apply">Apply Now</Link></Button>
                    <Button key="Request More Info" variant="outline" size="xl"><Link href="/request-info">Request More Info</Link></Button>
                    <Button key="Book a Visit" variant="outline" size="xl"><Link href="/book-visit">Book a Visit</Link></Button>
                </div>
                <div>
                    <div id="tstc__information" className="grid grid-cols-1 gap-4">
                        <Image
                            src={SecondaryTSTCLogo}
                            alt="Texas State Technical College Logo"
                            loading="eager"
                            className="mb-4"
                        />
                        <div id="address">
                            3801 Campus Dr. <br />
                            Waco, TX 76705
                        </div>
                        <div id="phone">
                            <a href="tel:800-792-8784">
                                800-792-8784
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}