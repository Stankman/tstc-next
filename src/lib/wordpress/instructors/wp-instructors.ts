import { WordPressResponse, getItemsPaginated, getAllItems, getItemById, getItemBySlug, getAllItemSlugs } from "@/lib/wordpress/wordpress";
import { Instructor } from "@/lib/wordpress/wordpress.d";

export async function getInstructorsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    campus?: string;
    industry?: string;
    search?: string;
  }
): Promise<WordPressResponse<Instructor[]>> {
  return getItemsPaginated<Instructor>('instructor', page, perPage, filterParams);
}

export async function getAllInstructors(): Promise<Instructor[]> {
  return getAllItems<Instructor>('instructor');
}

export async function getInstructorById(id: number): Promise<Instructor> {
  return getItemById<Instructor>("instructor", id);
}

export async function getInstructorBySlug(slug: string): Promise<Instructor> {
  return getItemBySlug<Instructor>("instructor", slug);
}

export async function getAllInstructorsSlugs(): Promise<{ slug: string }[]> {
  return getAllItemSlugs('instructor');
}