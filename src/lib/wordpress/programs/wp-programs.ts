import { WordPressResponse, getItemsPaginated, getAllItems, getItemById, getItemBySlug, getAllItemSlugs } from "@/lib/wordpress/wordpress";
import { Program } from "@/lib/wordpress/wordpress.d";

export async function getProgramsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    campus?: string;
    industry?: string;
    search?: string;
  }
): Promise<WordPressResponse<Program[]>> {
  return getItemsPaginated<Program>('program', page, perPage, filterParams);
}

export async function getAllPrograms(): Promise<Program[]> {
  return getAllItems<Program>('program');
}

export async function getProgramById(id: number): Promise<Program> {
  return getItemById<Program>("program", id);
}

export async function getProgramBySlug(slug: string): Promise<Program> {
  return getItemBySlug<Program>("program", slug);
}

export async function getAllProgramsSlugs(): Promise<{ slug: string }[]> {
  return getAllItemSlugs('program');
}