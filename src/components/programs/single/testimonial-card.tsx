import { getTestimonialById } from "@/lib/wordpress/testimonials/wp-testimonials";
import { getFeaturedMediaById } from "@/lib/wordpress/media/wp-media";
import { Testimonial, FeaturedMedia } from "@/lib/wordpress/wordpress.d";
import { TestimonialCardClient } from "./testimonial-card-client";

interface TestimonialCardProps {
  testimonialId?: number;
}

export async function TestimonialCard({ testimonialId }: TestimonialCardProps) {
  if (!testimonialId) {
    return <TestimonialCardSkeleton />;
  }

  try {
    const testimonial: Testimonial = await getTestimonialById(testimonialId);
    
    // Fetch featured media if available
    let featuredMedia: FeaturedMedia | null = null;
    if (testimonial.featured_media) {
      try {
        featuredMedia = await getFeaturedMediaById(testimonial.featured_media);
      } catch (error) {
        console.warn('Failed to fetch testimonial featured media:', error);
      }
    }
    
    return <TestimonialCardClient testimonial={testimonial} featuredMedia={featuredMedia} />;
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return <TestimonialCardSkeleton />;
  }
}

export function TestimonialCardSkeleton() {
  return (
    <div className="relative min-h-[300px] max-w-auto md:max-w-[500px] flex flex-col">
      <div className="bg-white p-8 rounded border border-gray-200 flex flex-col flex-1 justify-between relative">
        <div className="block lg:hidden flex mb-4 items-center justify-between">
          <div className="w-[100px] h-[100px] bg-gray-200 rounded animate-pulse"></div>
          <div className="w-[100px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="text-tstc-blue-400 text-2xl mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-4/5"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/5"></div>
        </div>
        <div className="text-right text-tstc-blue-400 text-lg">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-1 w-1/2 ml-auto"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 ml-auto"></div>
        </div>
        <div className="hidden lg:block absolute -right-4 -top-4">
          <div className="w-[100px] h-[100px] bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="hidden lg:block absolute -left-4 -bottom-4">
          <div className="w-[100px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}