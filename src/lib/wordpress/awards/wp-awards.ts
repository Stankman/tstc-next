import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Award } from "@/lib/wordpress/wordpress.d";

export async function getAllAwards(): Promise<Award[]> {
  return getAllItems<Award>("award");
}

export async function getAwardById(id: number): Promise<Award> {
  return getItemById<Award>("award", id);
}

export async function getAwardBySlug(slug: string): Promise<Award> {
  return getItemBySlug<Award>("award", slug);
}