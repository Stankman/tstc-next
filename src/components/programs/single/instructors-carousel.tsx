import { getInstructorById } from "@/lib/wordpress/instructors/wp-instructors";
import { getFeaturedMediaById } from "@/lib/wordpress/media/wp-media";
import { InstructorsCarouselClient } from "./instructors-carousel-client";

interface InstructorsCarouselProps {
    instructors: number[];
    title?: string;
}

export default async function InstructorsCarousel({ 
    instructors, 
    title = "Expert Instructors" 
}: InstructorsCarouselProps) {
    const instructorData = await Promise.all(
        instructors.map(async (id) => {
            const instructor = await getInstructorById(id);
            if (!instructor) return null;
            
            const featuredMedia = instructor.featured_media 
                ? await getFeaturedMediaById(instructor.featured_media)
                : null;
            
            return {
                ...instructor,
                featuredMedia: featuredMedia || undefined
            };
        })
    );

    const validInstructors = instructorData.filter(instructor => instructor !== null);

    return (
        <InstructorsCarouselClient 
            instructors={validInstructors} 
            title={title}
        />
    );
}