import { WordPressResponse, getItemsPaginated, getAllItems, getItemById, getItemBySlug, getAllItemSlugs } from "@/lib/wordpress/wordpress";
import { Testimonial } from "@/lib/wordpress/wordpress.d";

export async function getTestimonialsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    campus?: string;
    industry?: string;
    search?: string;
  }
): Promise<WordPressResponse<Testimonial[]>> {
  return getItemsPaginated<Testimonial>('testimonial', page, perPage, filterParams);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return getAllItems<Testimonial>('testimonial');
}

export async function getTestimonialById(id: number): Promise<Testimonial> {
  return getItemById<Testimonial>("testimonial", id);
}

export async function getTestimonialBySlug(slug: string): Promise<Testimonial> {
  return getItemBySlug<Testimonial>("testimonial", slug);
}

export async function getAllTestimonialsSlugs(): Promise<{ slug: string }[]> {
  return getAllItemSlugs('testimonial');
}