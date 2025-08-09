export interface KualiProgram {
  id: string;
  title?: string;
  pid? : string;
  specializations?: KualiSpecialization[];
}

export interface KualiLocation {
  id: string;
  name: string;
  ByOiUw4q_: string;
}

export interface KualiLocationWP {
  id: string,
  name: string,
  slug: string,
  code: string
}

export interface KualiDegreeType {
  id: string;
  name: string;
  [key: string]: any;
}

export interface KualiModality {
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
  description: string;
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

export interface KualiSpecialization {
    id: string;
    pid: string;
    title: string;
    code?: string;
    catalogYear?: string;
    locations?: string[];
    locationsWP?: KualiLocationWP[];
    monthsToComplete?: string;
    semesters?: KualiSemester[];
    totalCredits?: number;
    modalities?: KualiModality;
    prerequisites?: string[];
}