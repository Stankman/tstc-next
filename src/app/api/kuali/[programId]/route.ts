import { NextRequest, NextResponse } from 'next/server';

interface Program {
  id: string;
  status: string;
  [key: string]: any;
}

interface Location {
  id: string;
  name: string;
  [key: string]: any;
}

interface DegreeType {
  id: string;
  name: string;
  [key: string]: any;
}

interface Modality {
  id: string;
  name: string;
  [key: string]: any;
}

interface TimelineLabel {
  id: string;
  label: string;
  timeline: string;
  start: string;
  status: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  number: string;
  credits: number;
  lab: number;
  lecture: number;
}

interface CourseBlock {
  optional: boolean;
  minimumCredits: number;
  courses: Course[];
  credits: number;
}

interface Semester {
  label: string;
  credits: number;
  blocks: CourseBlock[];
}

interface DegreePlan {
  id: string;
  title: string;
  description: string;
  code: string;
  monthsToComplete: string;
  locations: string[];
  programRequirements?: any;
  semesters?: Semester[];
  totalCredits?: number;
  [key: string]: any;
}

interface Specialization {
  id: string;
  pid: string;
  title: string;
  description?: string;
  status: string;
  timelines?: TimelineLabel[];
  degreePlan?: DegreePlan; // Full degree plan details
  [key: string]: any;
}

interface ApiResponse {
  program: Program;
  locations: Location[];
  degreeTypes: DegreeType[];
  modalities: Modality[];
  specializations: Specialization[];
}

const KUALI_API_BASE_URL = 'https://tstc.kuali.co/api/cm';

async function fetchKualiData(endpoint: string): Promise<any> {
  const token = process.env.KUALI_API_TOKEN;
  
  if (!token) {
    throw new Error('KUALI_API_TOKEN environment variable is not set');
  }

  const response = await fetch(`${KUALI_API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Kuali API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function processProgramRequirements(programRequirements: any): Promise<{ semesters: Semester[], totalCredits: number }> {
  console.log('Processing program requirements:', programRequirements);
  
  if (!programRequirements || !programRequirements.groupings) {
    return { semesters: [], totalCredits: 0 };
  }

  const semesters: Semester[] = [];
  let totalCredits = 0;

  for (const grouping of programRequirements.groupings) {
    console.log(`Processing grouping: ${grouping.label}`);
    
    const semester: Semester = {
      label: grouping.label,
      credits: 0,
      blocks: []
    };

    if (grouping.rules && grouping.rules.rules) {
      for (const rule of grouping.rules.rules) {
        if (rule.data && rule.data.courses && rule.data.courses.length > 0) {
          console.log(`Processing rule with ${rule.data.courses.length} courses`);
          
          const block: CourseBlock = {
            optional: !!rule.data.credits,
            minimumCredits: Number(rule.data.credits) || 0,
            courses: [],
            credits: 0
          };

          // Fetch course details for each course in parallel
          const coursePromises = rule.data.courses.map(async (courseId: string) => {
            try {
              const courseUrl = `/courses/${courseId}/latestActive`;
              console.log(`Fetching course data from: ${courseUrl}`);
              
              const courseData = await fetchKualiData(courseUrl);
              
              const course: Course = {
                id: courseId,
                code: courseData.subjectCode || '',
                title: courseData.title || '',
                number: courseData.number || '',
                credits: Number(courseData.semesterCreditHours) || 0,
                lab: Number(courseData.labHours) || 0,
                lecture: Number(courseData.lectureHours) || 0
              };
              
              console.log(`Course fetched: ${course.code}${course.number} - ${course.title} (${course.credits} credits, ${course.lecture} lecture hrs, ${course.lab} lab hrs)`);
              return course;
            } catch (error) {
              console.error(`Error fetching course ${courseId}:`, error);
              return null;
            }
          });

          const courses = await Promise.all(coursePromises);
          block.courses = courses.filter(course => course !== null) as Course[];
          
          // Calculate total credits for all courses in block
          const blockTotalCredits = block.courses.reduce((sum, course) => sum + course.credits, 0);
          block.credits = blockTotalCredits;
          
          semester.blocks.push(block);
          
          // Add credits to semester based on whether block is optional or required
          if (block.optional) {
            // For optional blocks, only add the minimum required credits
            semester.credits += block.minimumCredits;
            console.log(`Optional block: adding ${block.minimumCredits} credits (min) out of ${blockTotalCredits} total`);
          } else {
            // For required blocks, add all block credits
            semester.credits += blockTotalCredits;
            console.log(`Required block: adding ${blockTotalCredits} credits (all courses)`);
          }
        }
      }
    }

    semesters.push(semester);
    totalCredits += semester.credits;
    console.log(`Semester ${semester.label} total credits: ${semester.credits}`);
  }

  console.log(`Total program credits: ${totalCredits}`);
  return { semesters, totalCredits };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { programId: string } }
): Promise<NextResponse> {
  try {
    const { programId } = await params;

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Step 1: Get the program PID using the more efficient queryAll endpoint
    console.log(`Fetching program PID for programId: ${programId}`);
    const programQueryUrl = `${KUALI_API_BASE_URL}/programs/queryAll?fields=title,pid,_id&_id=${programId}`;
    console.log('Program query URL:', programQueryUrl);
    
    const programQueryResponse = await fetch(programQueryUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.KUALI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!programQueryResponse.ok) {
      throw new Error(`Program query failed: ${programQueryResponse.status} ${programQueryResponse.statusText}`);
    }

    const programQueryData = await programQueryResponse.json();
    console.log('Program query response:', JSON.stringify(programQueryData, null, 2));

    // Check different possible response structures
    let programInfo;
    if (programQueryData.res && programQueryData.res.length > 0) {
      // Kuali API returns data in 'res' array
      programInfo = programQueryData.res[0];
    } else if (programQueryData.results && programQueryData.results.length > 0) {
      programInfo = programQueryData.results[0];
    } else if (programQueryData.length > 0) {
      // Sometimes the response is directly an array
      programInfo = programQueryData[0];
    } else if (programQueryData.title && programQueryData.pid) {
      // Sometimes it's a single object
      programInfo = programQueryData;
    } else {
      console.log('No program found in response structure:', Object.keys(programQueryData));
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const programPid = programInfo.pid;
    console.log(`Found program info:`, { title: programInfo.title, pid: programPid, id: programInfo._id });

    // Step 2: Get all specializations for this program using inheritedFrom
    console.log(`Fetching specializations for program PID: ${programPid}`);
    const specializationsQueryUrl = `${KUALI_API_BASE_URL}/specializations/queryAll?inheritedFrom=${programPid}&status=active&fields=title,pid,status,_id`;
    console.log('Specializations query URL:', specializationsQueryUrl);
    
    const specializationsQueryResponse = await fetch(specializationsQueryUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.KUALI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!specializationsQueryResponse.ok) {
      throw new Error(`Specializations query failed: ${specializationsQueryResponse.status} ${specializationsQueryResponse.statusText}`);
    }

    const specializationsQueryData = await specializationsQueryResponse.json();
    console.log('Specializations query response:', JSON.stringify(specializationsQueryData, null, 2));

    // Check different possible response structures for specializations
    let allSpecializations;
    if (specializationsQueryData.res) {
      // Kuali API returns data in 'res' array
      allSpecializations = specializationsQueryData.res;
    } else if (specializationsQueryData.results) {
      allSpecializations = specializationsQueryData.results;
    } else if (Array.isArray(specializationsQueryData)) {
      allSpecializations = specializationsQueryData;
    } else {
      console.log('No specializations found in response structure:', Object.keys(specializationsQueryData));
      allSpecializations = [];
    }
    
    console.log(`Found ${allSpecializations.length} total specializations`);

    // Step 3: Group specializations by unique PIDs (some may share the same PID)
    const uniquePids = [...new Set(allSpecializations.map((spec: any) => spec.pid))].filter((pid): pid is string => typeof pid === 'string' && pid !== '');
    console.log(`Found ${uniquePids.length} unique specialization PIDs:`, uniquePids);

    // Step 4: Fetch latest active data for each unique PID
    const specializationsWithDetails = await Promise.all(
      uniquePids.map(async (specPid: string) => {
        try {
          console.log(`Fetching latest active data for specialization PID: ${specPid}`);
          const latestActiveUrl = `${KUALI_API_BASE_URL}/specializations/${specPid}/latestActive`;
          console.log('Latest active URL:', latestActiveUrl);
          
          const latestActiveResponse = await fetch(latestActiveUrl, {
            headers: {
              'Authorization': `Bearer ${process.env.KUALI_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          });

          if (!latestActiveResponse.ok) {
            console.log(`Latest active fetch failed for PID ${specPid}:`, latestActiveResponse.status);
            return null;
          }

          const latestActiveData = await latestActiveResponse.json();
          console.log(`Latest active data for ${specPid}:`, {
            title: latestActiveData.title,
            code: latestActiveData.code,
            monthsToComplete: latestActiveData.monthsToComplete,
            locationsCount: latestActiveData.locations?.length || 0
          });

          // Process program requirements to get detailed semester/course information
          const { semesters, totalCredits } = await processProgramRequirements(latestActiveData.programRequirements);

          const degreePlan: DegreePlan = {
            id: latestActiveData.id || latestActiveData._id,
            title: latestActiveData.title,
            description: latestActiveData.description,
            code: latestActiveData.code,
            monthsToComplete: latestActiveData.monthsToComplete,
            locations: latestActiveData.locations || [],
            programRequirements: latestActiveData.programRequirements,
            semesters,
            totalCredits
          };

          return {
            id: latestActiveData.id || latestActiveData._id,
            pid: specPid,
            title: latestActiveData.title,
            description: latestActiveData.description,
            status: latestActiveData.status,
            degreePlan
          };
        } catch (error) {
          console.error(`Error fetching latest active data for PID ${specPid}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validSpecializations = specializationsWithDetails.filter(spec => spec !== null);
    console.log(`Successfully fetched ${validSpecializations.length} specializations with degree plans`);

    // Fetch other data in parallel (locations, degree types, modalities)
    const [locations, degreeTypes, modalities] = await Promise.all([
      fetchKualiData('/options/types/Locations/'),
      fetchKualiData('/options/types/Degree%20Types/'),
      fetchKualiData('/courses/schema/modality/'),
    ]);

    const response: ApiResponse = {
      program: {
        id: programInfo._id,
        title: programInfo.title,
        pid: programInfo.pid,
        status: 'active', // We know it's active since we found it
      },
      locations: locations || [],
      degreeTypes: degreeTypes || [],
      modalities: modalities || [],
      specializations: validSpecializations,
    };

    console.log(`API response ready with ${validSpecializations.length} specializations`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching Kuali data:', error);
    
    // Return appropriate error response
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
