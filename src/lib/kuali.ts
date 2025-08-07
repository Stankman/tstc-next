import { KualiProgram, KualiSpecialization, KualiSemester, KualiCourseBlock, KualiCourse } from "./kuali.d";

const baseUrl = process.env.KUALI_API_URL;

if (!baseUrl) {
    throw new Error("KUALI_API_URL environment variable is not set");
}

export async function fetchKualiData(endpoint: string): Promise<any> {
  const token = process.env.KUALI_API_TOKEN;
  
  if (!token) {
    throw new Error('KUALI_API_TOKEN environment variable is not set');
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Kuali API Request failed: ${response.status} ${response.statusText}`);
  }

  return response;
}

export async function getKualiProgramById(programId: string): Promise<KualiProgram | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/kuali/programs/${programId}`, {
      next: { revalidate: process.env.NODE_ENV === 'production' ? 3600 : 0 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Kuali data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.log('[ERROR] Could not fetch Kuali program data => ', error);
    return null;
  }
}

export async function getKualiSpecializationById(specializationId: string): Promise<KualiSpecialization | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/kuali/specializations/${specializationId}`, {
      next: { revalidate: process.env.NODE_ENV === 'production' ? 3600 : 0 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Kuali data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function processProgramRequirements(programRequirements: any): Promise<{ semesters: KualiSemester[], totalCredits: number }> {  
  if (!programRequirements || !programRequirements.groupings) {
    return { semesters: [], totalCredits: 0 };
  }

  const semesters: KualiSemester[] = [];
  let totalCredits = 0;

  for (const grouping of programRequirements.groupings) {
    const semester: KualiSemester = {
      label: grouping.label,
      credits: 0,
      blocks: []
    };

    if (grouping.rules && grouping.rules.rules) {
      for (const rule of grouping.rules.rules) {
        if (rule.data && rule.data.courses && rule.data.courses.length > 0) {
          const block: KualiCourseBlock = {
            optional: !!rule.data.credits,
            minimumCredits: Number(rule.data.credits) || 0,
            courses: [],
            credits: 0
          };

          const coursePromises = rule.data.courses.map(async (courseId: string) => {
            try {
              const courseUrl = `/courses/${courseId}/latestActive`;
              
              const courseData = await fetchKualiData(courseUrl);
              
              const course: KualiCourse = {
                id: courseId,
                code: courseData.subjectCode || '',
                title: courseData.title || '',
                number: courseData.number || '',
                credits: Number(courseData.semesterCreditHours) || 0,
                lab: Number(courseData.labHours) || 0,
                lecture: Number(courseData.lectureHours) || 0
              };

              return course;
            } catch (error) {
              console.error(`Error fetching course ${courseId}:`, error);
              return null;
            }
          });

          const courses = await Promise.all(coursePromises);
          block.courses = courses.filter(course => course !== null) as KualiCourse[];
          
          const blockTotalCredits = block.courses.reduce((sum, course) => sum + course.credits, 0);
          block.credits = blockTotalCredits;
          
          semester.blocks.push(block);
          
          if (block.optional) {
            semester.credits += block.minimumCredits;
          } else {
            semester.credits += blockTotalCredits;
          }
        }
      }
    }

    semesters.push(semester);
    totalCredits += semester.credits;
  }

  return { semesters, totalCredits };
}