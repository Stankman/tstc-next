import { getAllItems, getItemById, getItemBySlug, searchItems } from "@/lib/wordpress/wordpress";
import { Campus } from "@/lib/wordpress/wordpress.d";

export async function getAllCampuses(): Promise<Campus[]> {
  return getAllItems<Campus>('campus');
}

export async function getCampusById(id: number): Promise<Campus> {
  return getItemById<Campus>("campus", id);
}

export async function getCampusBySlug(slug: string): Promise<Campus> {
  return getItemBySlug<Campus>("campus", slug);
}

export async function searchCampuses(query: string): Promise<Campus[]> {
  return searchItems<Campus[]>("/wp-json/wp/v2/campuses", query);
}

export async function getCampusByCode(code: string): Promise<Campus | null> {
  const campuses = await getAllItems<Campus>('campus', { code })
  
  return campuses.length > 0 ? campuses[0] : null;
}

