"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function TestimonialCard() {
  return (
    <motion.div 
      className="relative min-h-[300px] max-w-auto md:max-w-[500px] flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <motion.div 
          className="bg-white p-8 rounded border border-gray-200 flex flex-col flex-1 justify-between relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >   
            <div className="block md:hidden flex mb-4 items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
                >
                  <Image src="/headshot-dummy.jpg" width={250} height={250} alt="Dummy" className="object-cover w-[100px] h-[100px] rounded" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 100 }}
                >
                  <Image src="/industry-logo-dummy.png" width={250} height={250} alt="Dummy" className="w-[100px] h-[40px] rounded" />
                </motion.div>
            </div>
            <motion.p 
              className="text-tstc-blue-400 text-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              "I learned that the program was close to home, family-oriented, and I wanted to be a part of that while I studied for a nursing career."
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
                <span id="name" className="text-tstc-blue-400 text-xl">Bryan Rodriguez</span>
                <div id="position" className="flex justify-between">
                    <span id="title" className="text-gray-500">Nursing Student</span>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image src="/industry-logo-dummy.png" width={250} height={250} alt="Dummy" className="hidden md:block w-[80px]" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
        <motion.div
          className="hidden md:block absolute bottom-1/4 -right-20"
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
        >
          <Image src="/headshot-dummy.jpg" width={250} height={250} alt="Dummy" className="object-cover w-[100px] h-[100px] rounded" />
        </motion.div>
    </motion.div>
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="relative min-h-[300px] max-w-auto md:max-w-[500px] flex flex-col">
        <div className="bg-white p-8 rounded border border-gray-200 flex flex-col flex-1 justify-between relative">
            <div className="block md:hidden flex justify-between items-center">
                <div className="bg-gray-200 w-[100px] h-[100px] rounded animate-pulse"></div>
                <div className="bg-gray-200 w-[100px] h-[50px] rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
        </div>
        <div className="hidden md:block absolute bottom-1/4 -right-20 bg-gray-200 w-[100px] h-[100px] rounded animate-pulse"></div>
    </div>
  );
}