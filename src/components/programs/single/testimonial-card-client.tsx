"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Testimonial, FeaturedMedia } from "@/lib/wordpress/wordpress.d";

interface TestimonialCardClientProps {
  testimonial: Testimonial;
  featuredMedia?: FeaturedMedia | null;
}

export function TestimonialCardClient({ testimonial, featuredMedia }: TestimonialCardClientProps) {
  const imageUrl = featuredMedia?.source_url || "/headshot-dummy.jpg";
  const imageAlt = featuredMedia?.alt_text || testimonial.title.rendered || "Student";
  
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
        <div className="block lg:hidden flex mb-4 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 100 }}
          >
            <Image src="/industry-logo-dummy.png" width={250} height={250} alt="Industry Logo" className="object-contain w-[100px] h-[40px] rounded" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <Image src={imageUrl} width={250} height={250} alt={imageAlt} className="object-cover w-[100px] h-[100px] rounded" />
          </motion.div>
        </div>
        <motion.p 
          className="text-tstc-blue-400 text-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          "{testimonial.acf.quote}"
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-tstc-blue-400 text-lg">
            <div className="font-semibold">{testimonial.title.rendered}</div>
            <div className="flex items-center justify-between">
              <span className="flex-1 mr-4 break-words">{testimonial.acf.position}</span>
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 100 }}
                className="hidden lg:block flex-shrink-0"
              >
                <Image src="/industry-logo-dummy.png" width={250} height={250} alt="Industry Logo" className="object-contain w-[100px] h-[40px] rounded" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="hidden lg:block absolute -right-20 top-2/3 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <Image src={imageUrl} width={250} height={250} alt={imageAlt} className="object-cover w-[100px] h-[100px] rounded" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
