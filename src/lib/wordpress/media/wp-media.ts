import { getItemById } from "@/lib/wordpress/wordpress";
import { FeaturedMedia } from "@/lib/wordpress/wordpress.d";

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return getItemById<FeaturedMedia>("media", id);
}