"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";

import PrimaryTSTCLogo from "../../../public/primary-tstc-logo.svg";
import { mainMenu } from "../../../menu.config";
import { Button } from "../ui/button";
import { HeaderProps } from "../../lib/types";

export const Header = ({id, className} : HeaderProps) => {
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if(currentScrollY > lastScrollY && currentScrollY > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    });

    return (
        <header
            className={cn(
                "sticky z-50 top-0 bg-tstc-blue-200 text-white transition-transform duration-300",
                hidden ? "-translate-y-full" : "translate-y-0",
                className
            )}
            id={id}
        >
            <div className="container flex items-center justify-between align-center mx-auto px-4 py-4">
                <Link
                    className=""
                    href="/"
                >
                    <Image
                        src={PrimaryTSTCLogo}
                        alt="Texas State Technical College Logo"
                        loading="eager"
                    />
                </Link>
                <div className="flex items-center gap-2">
                    {Object.entries(mainMenu).map(([key, props]) => (
                        <Button key={key} variant={props.variant} size={props.size} hideMobile={true}>
                            <Link href={props.href}>
                                {props.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </header>
    );
};