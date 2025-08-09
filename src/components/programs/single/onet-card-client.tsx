"use client";

import { formatCurrency } from "@/lib/pricing";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { OnetData } from "@/lib/onet/onet.client";

interface OnetCardClientProps {
  onetData: OnetData;
  onetUrl?: string;
}

export function OnetCardClient({ onetData, onetUrl }: OnetCardClientProps) {
    // Parse the annual median to a number for formatting
    const medianSalary = parseInt(onetData.annualMedian.replace(/[^0-9]/g, ''));
    
    return (
        <motion.div 
            className="w-full bg-tstc-blue-300 text-white flex flex-col justify-between p-6 rounded min-h-[300px] md:min-h-[250px] md:max-w-[300px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div 
                className="border-b-white/40 border-b space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div 
                    id="title"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {onetData.occupation}
                </motion.div>
                <motion.div 
                    id="median" 
                    className="text-5xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                >
                    {formatCurrency(medianSalary)}
                </motion.div>
                <motion.div 
                    id="median-label" 
                    className="text-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Median Salary
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Link 
                    href={onetUrl || `https://www.onetonline.org/link/localwages/${onetData.fullSerieId}?st=TX`} 
                    target="_blank" 
                    className="hover:underline"
                >
                    Job Analysis Details <MoveUpRight className="inline" size={16} />
                </Link>
            </motion.div>
        </motion.div>
    )
}
