// Kuali API integration utilities
import { Program } from "@/lib/wordpress.d";

export interface KualiProgram {
  id: string;
  status: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface KualiLocation {
  id: string;
  name: string;
  [key: string]: any;
}

export interface KualiDegreeType {
  id: string;
  name: string;
  [key: string]: any;
}

export interface KualiModality {
  id: string;
  name: string;
  [key: string]: any;
}

export interface KualiTimelineLabel {
  id: string;
  label: string;
  timeline: string;
  start: string;
  status: string;
}

export interface KualiCourse {
  id: string;
  code: string;
  title: string;
  number: string;
  credits: number;
  lab: number;
  lecture: number;
}

export interface KualiCourseBlock {
  optional: boolean;
  minimumCredits: number;
  courses: KualiCourse[];
  credits: number;
}

export interface KualiSemester {
  label: string;
  credits: number;
  blocks: KualiCourseBlock[];
}

export interface KualiDegreePlan {
  id: string;
  title: string;
  description: string;
  code: string;
  monthsToComplete: string;
  locations: string[];
  programRequirements?: any;
  semesters?: KualiSemester[];
  totalCredits?: number;
  [key: string]: any;
}

export interface KualiSpecialization {
  id: string;
  pid: string;
  title: string;
  description?: string;
  status: string;
  timelines?: KualiTimelineLabel[];
  degreePlan?: KualiDegreePlan;
  [key: string]: any;
}

export interface KualiApiResponse {
  program: KualiProgram;
  locations: KualiLocation[];
  degreeTypes: KualiDegreeType[];
  modalities: KualiModality[];
  specializations: KualiSpecialization[];
}

/**
 * Get Kuali program ID from WordPress program
 * Uses the kuali_id field from ACF
 */
export function getKualiProgramId(wpProgram: Program): string | null {
  // Get Kuali ID from ACF field
  if (wpProgram.acf?.kuali_id) {
    return wpProgram.acf.kuali_id as string;
  }
  
  return null;
}

/**
 * Fetch Kuali program data from the API route
 */
export async function fetchKualiProgramData(programId: string): Promise<KualiApiResponse | null> {
  try {
    const response = await fetch(`/api/kuali/${programId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Kuali program ${programId} not found or not active`);
        return null;
      }
      throw new Error(`Failed to fetch Kuali data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Kuali program data:', error);
    return null;
  }
}

/**
 * Fetch Kuali data on the server side (for use in server components)
 */
export async function fetchKualiProgramDataServer(programId: string): Promise<KualiApiResponse | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/kuali/${programId}`, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Kuali program ${programId} not found or not active`);
        return null;
      }
      throw new Error(`Failed to fetch Kuali data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Kuali program data on server:', error);
    return null;
  }
}
