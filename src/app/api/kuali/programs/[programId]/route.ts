import { getActiveSpecializationPidsForProgram, getBasicProgramById, getLocationsBatchMap, getSpecializationLatestActiveCached, processProgramRequirements } from "@/lib/kuali/kuali.server";
import { KualiLocationWP, KualiProgram, KualiSpecialization } from "@/lib/kuali/kuali";
import { getCampusByCode } from "@/lib/wordpress/campuses/wp-campuses";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
  
    if(!programId) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    const programBasicInfo = await getBasicProgramById(programId);

    if (!programBasicInfo) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    const programPid = programBasicInfo.pid;

    const specializationPids = await getActiveSpecializationPidsForProgram(programBasicInfo.pid);

    const specializationDetailPromises = specializationPids.map(async (specializationPid) => {
      try {
        const latestActive = await getSpecializationLatestActiveCached(specializationPid);

        // Skip Dual Credit Programs
        if (latestActive.code.startsWith(`DCP`)) return null;

        const specialization: KualiSpecialization = {
          id: latestActive.id,
          title: latestActive.title,
          pid: specializationPid
        };

        return specialization;
      } catch (error) {
        console.error(`[Kuali] Failed to fetch latestActive data for specialization PID: ${specializationPid}`, error);
        return null;
      }
    });

    let specializations = (await Promise.all(specializationDetailPromises))
      .filter((item): item is KualiSpecialization => item !== null);

    const programResponse: KualiProgram = {
      id: programBasicInfo.id,
      title: programBasicInfo.title,
      pid: programPid,
      specializations
    }

    const response = NextResponse.json(programResponse);

    response.headers.set(
      "Cache-Control",
      "public, s-max-age=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if(/404/.test(errorMessage)) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error",
        message: errorMessage
      },
      { status: 500 }
    );
  }
}