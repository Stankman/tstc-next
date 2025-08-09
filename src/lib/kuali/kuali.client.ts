import { cache } from "react";
import type { KualiProgram, KualiSpecialization } from "./kuali.d";

export const getKualiProgramById = cache(async (programId: string): Promise<KualiProgram | null> => {
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    : '';

  const url = `${baseUrl}/api/kuali/programs/${programId}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) return null;

  return response.json();
});

export function preloadKualiProgram(programId: string) {
  void getKualiProgramById(programId);
}

export const getKualiSpecializationById = cache(async (specializationPid: string): Promise<KualiSpecialization | null> => {
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    : '';

  const url = `${baseUrl}/api/kuali/specializations/${specializationPid}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) return null;
  return response.json();
});

export function preloadKualiSpecialization(specializationPid: string) {
  void getKualiSpecializationById(specializationPid);
}