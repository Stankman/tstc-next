"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Instructor, FeaturedMedia } from "@/lib/wordpress/wordpress.d";
import { InstructorCard } from "./instructor-card";

interface InstructorsCarouselClientProps {
    instructors: (Instructor & { featuredMedia?: FeaturedMedia })[];
    title: string;
}

export function InstructorsCarouselClient({ 
    instructors, 
    title 
}: InstructorsCarouselClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    // Update items per view based on screen size
    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width < 768) { // md breakpoint
                setItemsPerView(1);
            } else if (width < 1024) { // lg breakpoint
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Reset current index when items per view changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [itemsPerView]);

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, instructors.length - itemsPerView);
            return prev >= maxIndex ? 0 : prev + itemsPerView;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, instructors.length - itemsPerView);
            return prev === 0 ? maxIndex : Math.max(0, prev - itemsPerView);
        });
    };

    const visibleInstructors = instructors.slice(currentIndex, currentIndex + itemsPerView);
    const totalPages = Math.ceil(instructors.length / itemsPerView);
    const hasMultiplePages = totalPages > 1;

    if (instructors.length === 0) {
        return <div>No instructors available</div>;
    }

    return (
        <div className="w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-4xl mb-5 text-tstc-blue-400">{title}</h2>
                {hasMultiplePages && (
                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="p-2 rounded-full hover:bg-tstc-blue-400 hover:text-white border border-tstc-blue-400 text-tstc-blue-400 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 rounded-full hover:bg-tstc-blue-400 hover:text-white border border-tstc-blue-400 text-tstc-blue-400 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Cards */}
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <div className={`grid gap-6 ${
                            itemsPerView === 1 ? 'grid-cols-1' :
                            itemsPerView === 2 ? 'grid-cols-2' :
                            itemsPerView === 3 ? 'grid-cols-3' :
                            'grid-cols-4'
                        }`}>
                            {visibleInstructors.map((instructor) => (
                                <InstructorCard 
                                    key={instructor.id} 
                                    instructor={instructor}
                                    featuredMedia={instructor.featuredMedia}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dots indicator */}
            {hasMultiplePages && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index * itemsPerView)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                Math.floor(currentIndex / itemsPerView) === index
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
