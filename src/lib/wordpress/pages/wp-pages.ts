import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Page } from "@/lib/wordpress/wordpress.d";

export async function getAllPages(): Promise<Page[]> {
  return getAllItems<Page>('pages');
}

export async function getPageById(id: number): Promise<Page> {
  return getItemById<Page>("pages", id);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return getItemBySlug<Page>("pages", slug);
}