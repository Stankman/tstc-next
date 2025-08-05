import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import React from "react";
import { motion } from "motion/react";

const buttonVariants = cva(
    "px-5 py-2.5 transition-colors duration-300",
    {
        variants: {
            variant: {
                default: "",
                outline: "border rounded-full hover:border-tstc-color-100",
                red: "bg-tstc-red-200 text-white rounded-full",
                ghost: ""
            },
            size: {
                default: "text-base font-medium",
                xs: "text-xs font-medium",
                sm: "text-sm font-medium",
                base: "text-base font-medium",
                lg: "text-lg font-medium",
                xl: "text-xl font-medium"
            },
            hideMobile: {
                false: null,
                true: "hidden md:inline-block"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            hideMobile: false
        }
    }
);

//Also do treat this as Link component if href is provided
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant,
    size,
    hideMobile,
    children,
    onClick,
    disabled,
    type,
    ...props
}, ref) => {
    return (
        <motion.button
            className={cn(buttonVariants({ variant, size, hideMobile, className }))}
            ref={ref}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </motion.button>
    )
});

Button.displayName = "Button";

export { Button, buttonVariants };