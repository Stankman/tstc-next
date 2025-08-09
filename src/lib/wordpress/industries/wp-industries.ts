import { cache } from "react";
import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Industry } from "@/lib/wordpress/wordpress.d";

export const getAllIndustries = cache(async (): Promise<Industry[]> => {
  return getAllItems<Industry>("industry");
});

export const getIndustryById = cache(async (id: number): Promise<Industry> => {
  return getItemById<Industry>("industry", id);
});

export const getIndustryBySlug = cache(async (slug: string): Promise<Industry> => {
  return getItemBySlug<Industry>("industry", slug);
});