import { getAllItems, getItemById, getItemBySlug } from "@/lib/wordpress/wordpress";
import { Schedule } from "@/lib/wordpress/wordpress.d";

export async function getAllSchedules(): Promise<Schedule[]> {
  return getAllItems<Schedule>("schedule");
}

export async function getScheduleById(id: number): Promise<Schedule> {
  return getItemById<Schedule>("schedule", id);
}

export async function getScheduleBySlug(slug: string): Promise<Schedule> {
  return getItemBySlug<Schedule>("schedule", slug);
}