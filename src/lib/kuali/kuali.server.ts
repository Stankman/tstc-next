import { unstable_cache } from "next/cache";
import { KualiSemester, KualiCourseBlock, KualiCourse, KualiLocation } from "./kuali.d";

const KUALI_BASE_URL = process.env.KUALI_API_URL!;
const KUALI_API_TOKEN = process.env.KUALI_API_TOKEN!;

if(!KUALI_BASE_URL) throw new Error("KUALI_API_URL environment variable is not set.");
if(!KUALI_API_TOKEN) throw new Error("KUALI_API_TOKEN environment variable is not set.");

function withTimeout<T>(promise: Promise<T>, milliseconds = 10_000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), milliseconds)
    )
  ]);
}

export async function kualiFetch<T>(endpoint: string): Promise<T> {
  const response = await withTimeout(
    fetch(`${KUALI_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${KUALI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600
      }
    })
  );

  if (!response.ok) {
    throw new Error(`Kuali API request failed: ${response.status} ${response.statusText} (${endpoint})`);
  }

  return response.json() as Promise<T>;
}

const _getProgramLatestActive = async (programId: string) => kualiFetch<any>(`/programs/${programId}/latestActive`);

export const getProgramLatestActiveCached = unstable_cache(
  _getProgramLatestActive,
  ["kuali:program-latestActive"],
  { revalidate: 3600, tags: ["kuali:program"] }
);

const _getSpecializationLatestActive = async (specializationPid: string) => kualiFetch<any>(`/specializations/${specializationPid}/latestActive`);

export const getSpecializationLatestActiveCached = unstable_cache(
  _getSpecializationLatestActive,
  ["kuali:specialization-latestActive"],
  { revalidate: 3600, tags: ["kuali:specialization"] }
);

const _getLocationTypes = async () => kualiFetch<any[]>("/options/types/Locations");

export const getLocationTypesCached = unstable_cache(
  _getLocationTypes,
  ["kuali:location-types"],
  { revalidate: 86400, tags: ["kuali:location-types"] } // cache 24h
);

const _getLocationById = async (locationId: string) => kualiFetch<KualiLocation>(`/options/${locationId}`);

export const getLocationByIdCached = unstable_cache(
  _getLocationById,
  ["kuali:location-by-id"],
  { revalidate: 3600, tags: ["kuali:location"] }
);

const _queryPrograms = async (queryString: string) => kualiFetch<any>(`/programs/queryAll?${queryString}`);

const _querySpecializations = async (queryString: string) => kualiFetch<any>(`/specializations/queryAll?${queryString}`);

export async function processProgramRequirements(
  programRequirements: any
): Promise<{ semesters: KualiSemester[]; totalCredits: number }> {
  if (!programRequirements?.groupings) {
    return { semesters: [], totalCredits: 0 };
  }

  const semesters: KualiSemester[] = [];
  let totalCredits = 0;

  for (const grouping of programRequirements.groupings) {
    const semester: KualiSemester = { label: grouping.label, credits: 0, blocks: [] };

    const rules = grouping.rules?.rules ?? [];
    for (const rule of rules) {
      const courseIds: string[] = rule?.data?.courses ?? [];
      if (!courseIds.length) continue;

      const block: KualiCourseBlock = {
        optional: Boolean(rule?.data?.credits),
        minimumCredits: Number(rule?.data?.credits) || 0,
        courses: [],
        credits: 0,
      };

      const coursePromises = courseIds.map(async (courseId) => {
        try {
          const latestCourseData = await kualiFetch<any>(`/courses/${courseId}/latestActive`);
          const course: KualiCourse = {
            id: courseId,
            code: latestCourseData.subjectCode || "",
            title: latestCourseData.title || "",
            number: latestCourseData.number || "",
            description: latestCourseData.description || "",
            credits: Number(latestCourseData.semesterCreditHours) || 0,
            lab: Number(latestCourseData.lab) || 0,
            lecture: Number(latestCourseData.lecture) || 0,
          };
          return course;
        } catch {
          return null;
        }
      });

      const courses = (await Promise.all(coursePromises)).filter(Boolean) as KualiCourse[];
      block.courses = courses;
      const totalBlockCredits = courses.reduce((sum, course) => sum + course.credits, 0);
      block.credits = totalBlockCredits;

      semester.blocks.push(block);
      semester.credits += block.optional ? block.minimumCredits : totalBlockCredits;
    }

    semesters.push(semester);
    totalCredits += semester.credits;
  }

  return { semesters, totalCredits };
}

export async function getBasicProgramById(programId: string) {
  // Example: /programs/queryAll?limit=1&fields=title,pid,_id&_id=abc
  const programQueryString = new URLSearchParams({
    limit: "1",
    fields: "title,pid,_id",
    _id: programId,
  }).toString();

  const programQueryResponse = await _queryPrograms(programQueryString);

  return programQueryResponse?.res?.[0] ?? null;
}

export async function getBasicSpecializationById(specializationId: string) {
  // Example: /specializations/queryAll?limit=1&fields=title,pid,_id&_id=abc
  const specializationQueryString = new URLSearchParams({
    limit: "1",
    fields: "title,pid,_id",
    _id: specializationId,
  }).toString();

  const programQueryResponse = await _querySpecializations(specializationQueryString);

  return programQueryResponse?.res?.[0] ?? null;
}

export async function getActiveSpecializationPidsForProgram(programPid: string): Promise<string[]> {
  // Example: /specializations/queryAll?inheritedFrom=PID&status=active&fields=title,pid,status,_id
  const specializationQueryString = new URLSearchParams({
    inheritedFrom: programPid,
    status: "active",
    fields: "title,pid,status,_id",
  }).toString();

  const specializationsQueryResponse = await _querySpecializations(specializationQueryString);

  const all = specializationsQueryResponse?.res ?? [];

  const pids: string[] = Array.from(
    new Set(all.map((item: any) => item?.pid).filter((pid: unknown): pid is string => typeof pid === "string" && pid.length > 0))
  );

  return pids;
}

export async function getLocationsBatchMap(locationIds: string[]) {
  const uniqueLocationIds = Array.from(new Set(locationIds.filter(Boolean)));

  const locations = await Promise.all(
    uniqueLocationIds.map((id) => getLocationByIdCached(id))
  );

  const locationMap = new Map<string, KualiLocation>();

  uniqueLocationIds.forEach((id, index) => {
    locationMap.set(id, locations[index]);
  });

  return locationMap;
}