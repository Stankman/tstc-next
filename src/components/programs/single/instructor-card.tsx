import { FeaturedMedia, Instructor } from "@/lib/wordpress/wordpress.d";
import { motion } from "motion/react";
import Image from "next/image";

interface InstructorCardProps {
    instructor: Instructor;
    featuredMedia : FeaturedMedia | undefined;
}

export function InstructorCard({ instructor, featuredMedia }: InstructorCardProps) {
    return (
        <motion.div 
            className="p-8 min-h-[300px] md:min-h-[500px] space-y-4 border rounded border-gray-200"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div 
                id="instructor-image"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {featuredMedia?.source_url ? (
                    <Image 
                        src={featuredMedia.source_url} 
                        alt={featuredMedia.alt_text || instructor.title?.rendered || "Instructor"} 
                        width={250} 
                        height={250} 
                        className="object-cover w-[100px] h-[100px] h-48 rounded" 
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
            </motion.div>
            <motion.div 
                id="instructor-information" 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <h2 className="text-2xl text-tstc-blue-400">{instructor.title?.rendered || "Unknown Instructor"}</h2>
                <h3 className="text-lg text-gray-600 mb-4">{instructor.acf?.course_title || "Instructor"}</h3>
            </motion.div>
            <motion.div 
                id="instructor-desc"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p>{instructor.acf?.description || "Experienced instructor dedicated to student success."}</p>
            </motion.div>
        </motion.div>
    );
}