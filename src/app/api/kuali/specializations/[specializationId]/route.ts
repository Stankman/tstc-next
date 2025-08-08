import { NextRequest, NextResponse } from "next/server";
import {
  getBasicSpecializationById,
  getLocationsBatchMap,
  getSpecializationLatestActiveCached,
  processProgramRequirements,
} from "@/lib/kuali/kuali.server"; // or "@/lib/kuali.server" if you split
import type { KualiLocationWP, KualiSpecialization } from "@/lib/kuali/kuali";
import { getCampusByCode } from "@/lib/wordpress/campuses/wp-campuses";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ specializationId: string }> }
) {
  try {
    const { specializationId } = await params;

    if (!specializationId) {
      return NextResponse.json({ error: "Specialization ID is required" }, { status: 400 });
    }

    const specializationBasicInfo = await getBasicSpecializationById(specializationId);

    if (!specializationBasicInfo) {
      return NextResponse.json(
        { error: "Specialization not found" },
        { status: 404 }
      );
    }

    const latestActiveData = await getSpecializationLatestActiveCached(specializationBasicInfo.pid);

    if (!latestActiveData?.id) {
      return NextResponse.json({ error: "Specialization not found" }, { status: 404 });
    }

    const { semesters, totalCredits } = await processProgramRequirements(
      latestActiveData.programRequirements
    );

    const prerequisites: string[] = [];

    const rules =
      latestActiveData?.requisites?.rules?.rules as Array<any> | undefined;

    if (Array.isArray(rules)) {
      for (const rule of rules) {
        if (rule?.key === "freeFormText" && typeof rule?.data?.text === "string") {
          prerequisites.push(rule.data.text);
        }
      }
    }

    const specialization: KualiSpecialization = {
      id: latestActiveData.id,
      pid: latestActiveData.pid,
      title: latestActiveData.title,
      code: latestActiveData.code,
      catalogYear: latestActiveData.catalogYear,
      monthsToComplete: latestActiveData.monthsToComplete,
      locations: latestActiveData.locations ?? [],
      modalities: latestActiveData.modality ?? {},
      semesters,
      totalCredits,
      prerequisites,
    };

    if (specialization.locations && specialization.locations.length > 0) {
        const locationsMap = await getLocationsBatchMap(specialization.locations);
        const campusRecordsByLocationId = new Map<string, KualiLocationWP | null>();

        await Promise.all(
            specialization.locations.map(async (locationId) => {
                const kualiLocation = locationsMap.get(locationId);

                if (!kualiLocation) {
                    campusRecordsByLocationId.set(locationId, null);
                    return;
                }

                try {
                    const campus = await getCampusByCode(kualiLocation.ByOiUw4q_);
                    
                    campusRecordsByLocationId.set(
                        locationId,
                        campus ? { 
                            id: campus.id.toString(), 
                            name: campus.name, 
                            slug: campus.slug, 
                            code: campus.acf?.code ?? `` 
                        } : null
                    );

                } catch (err) {
                    console.error(`[WP] Campus lookup failed for location ${locationId}`, err);
                    campusRecordsByLocationId.set(locationId, null);
                }
            })
        );

        specialization.locationsWP = specialization.locations
            .map((locationId) => campusRecordsByLocationId.get(locationId))
            .filter((item): item is KualiLocationWP => Boolean(item));
    }

    const response = NextResponse.json(specialization);

    response.headers.set(
      "Cache-Control",
      "public, s-max-age=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/404/.test(message)) {
      return NextResponse.json({ error: "Specialization not found" }, { status: 404 });
    }
    console.error("[Kuali] specialization fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch specialization" }, { status: 500 });
  }
}