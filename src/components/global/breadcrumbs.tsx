"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { motion } from "motion/react";

type BreadcrumbsProps = {
  labels?: Record<string, string>;
};

export const Breadcrumbs : FC<BreadcrumbsProps> = ({ labels = {} }) => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        
        // Check if we have a custom label for this path
        // First check direct href match: labels['/programs'] = 'Programs'
        let label = labels[href];
        
        // If not found, check if any label value matches this href
        // This handles: labels['Programs'] = '/programs'
        if (!label) {
            const matchingEntry = Object.entries(labels).find(([key, value]) => value === href);
            if (matchingEntry) {
                label = matchingEntry[0]; // Use the key as the label
            }
        }
        
        // If still no label, format the segment
        if (!label) {
            label = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        return {href, label};
    });

    const previousCrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

    return (
        <motion.nav 
            className="py-8" 
            aria-label="breadcrumb"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ol className="flex items-center space-x-2 text-sm text-white">
                {/* Desktop: Full breadcrumb trail */}
                <motion.li 
                    className="hidden md:flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                <Link href="/" className="hover:underline transition-all duration-200 hover:text-white/80">Home</Link>
                </motion.li>
                {breadcrumbs.map((crumb, idx) => (
                <motion.li
                    key={crumb.href}
                    className={`hidden md:flex items-center space-x-2 ${idx === 0 ? 'md:flex' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (idx + 1) * 0.1 }}
                >
                    <span>/</span>
                    {idx === breadcrumbs.length - 1 ? (
                    <span className="font-semibold capitalize text-white/60">{crumb.label}</span>
                    ) : (
                    <Link href={crumb.href} className="hover:underline transition-all duration-200 hover:text-white/80">{crumb.label}</Link>
                    )}
                </motion.li>
                ))}

                {/* Mobile: Show Back Link to Previous Crumb */}
                {previousCrumb && (
                <motion.li 
                    className="flex md:hidden items-center space-x-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link href={previousCrumb.href} className="flex items-center hover:underline transition-all duration-200 hover:text-white/80">
                    ← {previousCrumb.label}
                    </Link>
                </motion.li>
                )}
            </ol>
        </motion.nav>
    );
}