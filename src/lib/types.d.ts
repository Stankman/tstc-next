import { Url } from "url";
import { buttonVariants } from "../components/ui/button";

type NavProps = {
    id?: string;
    className?: string;
    children?: React.ReactNode;
};

type HeaderProps = {
    id? : string;
    className?: string;
}

type MainMenu = {
    [key: string]: MenuItem;
};

type MenuItem = {
    href: string | UrlObject;
    label?: string;
    variant?: "outline" | "default" | "red" | "ghost" | null | undefined;
    size?: "default" | "xs" | "sm" | "base" | "lg" | "xl" | null | undefined;
    hideMobile?: boolean;
};