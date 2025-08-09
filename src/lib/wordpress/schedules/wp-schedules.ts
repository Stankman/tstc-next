import { cache } from "react";
import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Schedule } from "@/lib/wordpress/wordpress.d";

export const getAllSchedules = cache(async (): Promise<Schedule[]> => {
  return getAllItems<Schedule>("schedule");
});

export const getScheduleById = cache(async (id: number): Promise<Schedule> => {
  return getItemById<Schedule>("schedule", id);
});

export const getScheduleBySlug = cache(async (slug: string): Promise<Schedule> => {
  return getItemBySlug<Schedule>("schedule", slug);
});