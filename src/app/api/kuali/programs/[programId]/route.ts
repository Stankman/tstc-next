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
      
        const { totalCredits } = await processProgramRequirements(latestActive.programRequirements);

        const specialization: KualiSpecialization = {
          id: latestActive.id,
          title: latestActive.title,
          pid: specializationPid,
          code: latestActive.code,
          monthsToComplete: latestActive.monthsToComplete,
          locations: latestActive.locations ?? [],
          modalities: latestActive.modality ?? {},
          totalCredits
        };

        return specialization;
      } catch (error) {
        console.error(`[Kuali] Failed to fetch latestActive data for specialization PID: ${specializationPid}`, error);
        return null;
      }
    });

    let specializations = (await Promise.all(specializationDetailPromises))
      .filter((item): item is KualiSpecialization => item !== null)
      .sort((a, b) => a.title.localeCompare(b.title));

    if (specializations.length > 0) {
      const allLocationIds = Array.from(
        new Set(specializations.flatMap((s) => s.locations || []))
      );

      if (allLocationIds.length > 0) {
        const locationsMap = await getLocationsBatchMap(allLocationIds);

        const campusRecordsByLocationId = new Map<string, KualiLocationWP | null>();

        await Promise.all(
          allLocationIds.map(async (locationId) => {
            console.log(locationId);
            const kualiLocation = locationsMap.get(locationId);

            if (!kualiLocation) {
              campusRecordsByLocationId.set(locationId, null);
              return;
            }

            try {
              const campus = await getCampusByCode(kualiLocation.ByOiUw4q_);
              
              campusRecordsByLocationId.set(
                locationId,
                campus ? { id: campus.id.toString(), name: campus.name, slug: campus.slug, code: campus.acf?.code ?? `` } : null
              );

            } catch (err) {
              console.error(`[WP] Campus lookup failed for location ${locationId}`, err);
              campusRecordsByLocationId.set(locationId, null);
            }
          })
        );

        specializations = specializations.map((specialization) => ({
          ...specialization,
          locationsWP: (specialization.locations || [])
            .map((locationId) => campusRecordsByLocationId.get(locationId))
            .filter((item): item is KualiLocationWP => Boolean(item)),
        }));
      }
    }

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