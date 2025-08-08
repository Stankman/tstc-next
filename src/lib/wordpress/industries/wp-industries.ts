import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Industry } from "@/lib/wordpress/wordpress.d";

export async function getAllIndustries(): Promise<Industry[]> {
  return getAllItems<Industry>('industry');
}

export async function getIndustryById(id: number): Promise<Industry> {
  return getItemById<Industry>("industry", id);
}

export async function getIndustryBySlug(slug: string): Promise<Industry> {
  return getItemBySlug<Industry>("industry", slug);
}