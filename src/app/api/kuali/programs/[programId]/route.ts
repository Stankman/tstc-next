import { fetchKualiData, processProgramRequirements } from '@/lib/kuali';
import { NextRequest, NextResponse } from 'next/server';
import { KualiProgram, KualiSpecialization } from '@/lib/kuali.d';

export async function GET(
  request: NextRequest,
  { params }: { params: { programId: string } }
): Promise<KualiProgram | NextResponse> {
  try {
    const { programId } = await params;

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const programQueryUrl = `/programs/queryAll?limit=1fields=title,pid,_id&_id=${programId}`;

    const programQueryResponse = await fetchKualiData(programQueryUrl);

    if (!programQueryResponse.ok) {
      throw new Error(`Program query failed: ${programQueryResponse.status} ${programQueryResponse.statusText}`);
    }

    const programQueryData = await programQueryResponse.json();

    let programInfo;

    if (programQueryData.res && programQueryData.res.length > 0) {
      programInfo = programQueryData.res[0];
    } else {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    const programPid = programInfo.pid;
    
    const specializationsQueryUrl = `/specializations/queryAll?inheritedFrom=${programPid}&status=active&fields=title,pid,status,_id`;
    
    const specializationsQueryResponse = await fetchKualiData(specializationsQueryUrl);

    if (!specializationsQueryResponse.ok) {
      throw new Error(`Specializations query failed: ${specializationsQueryResponse.status} ${specializationsQueryResponse.statusText}`);
    }

    const specializationsQueryData = await specializationsQueryResponse.json();

    let allSpecializations;
    if (specializationsQueryData.res && specializationsQueryData.res.length > 0) {
      allSpecializations = specializationsQueryData.res;
    } else {
      allSpecializations = [];
    }

    const uniquePids = [...new Set(allSpecializations.map((spec: any) => spec.pid))].filter((pid): pid is string => typeof pid === 'string' && pid !== '');

    const specializationsWithDetails = await Promise.all(
      uniquePids.map(async (specPid: string) => {
        try {
          const latestActiveUrl = `/specializations/${specPid}/latestActive`;

          const latestActiveResponse = await fetchKualiData(latestActiveUrl);

          if (!latestActiveResponse.ok) {
            return null;
          }

          const latestActiveData = await latestActiveResponse.json();

          const { semesters, totalCredits } = await processProgramRequirements(latestActiveData.programRequirements);

          const specialization: KualiSpecialization = {
            id: latestActiveData.id || latestActiveData._id,
            title: latestActiveData.title,
            pid: specPid,
            code: latestActiveData.code,
            monthsToComplete: latestActiveData.monthsToComplete,
            locations: latestActiveData.locations || [],
            modalities: latestActiveData.modalities || {},
            semesters,
            totalCredits
          };

          return specialization;
        } catch (error) {
          console.error(`Error fetching latest active data for PID ${specPid}:`, error);
          return null;
        }
      })
    );

    const validSpecializations: KualiSpecialization[] = specializationsWithDetails.filter(spec => spec !== null);
    
    const response: KualiProgram = {
      id: programInfo.id,
      title: programInfo.title,
      pid: programInfo.pid,
      specializations: validSpecializations
    };

    return NextResponse.json(response);
  } catch (error) {
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
