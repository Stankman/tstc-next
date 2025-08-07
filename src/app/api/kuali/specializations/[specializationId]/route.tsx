import { fetchKualiData, processProgramRequirements } from "@/lib/kuali";
import { KualiSpecialization } from "@/lib/kuali.d";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: { specializationId: string } }
): Promise<KualiSpecialization | NextResponse> {
    try {
        const { specializationId } = params;

        if (!specializationId) {
            return NextResponse.json(
                { error: "Specialization ID is required" },
                { status: 400 }
            );
        }

        const specializationQueryUrl = `/specializations/${specializationId}`;

        const specializationQueryResponse = await fetchKualiData(specializationQueryUrl);

        if(!specializationQueryResponse.ok) {
            throw new Error(`Specialization query failed: ${specializationQueryResponse.status} ${specializationQueryResponse.statusText}`);
        }

        const specializationQueryData = await specializationQueryResponse.json();

        let specializationInfo;

        if(specializationQueryData.res && specializationQueryData.res.length > 0) {
            specializationInfo = specializationQueryData.res[0];
        } else {
            return NextResponse.json(
                { error: "Specialization not found" },
                { status: 404 }
            );
        }

        const { semesters, totalCredits } = await processProgramRequirements(specializationInfo.requirements);

        const response: KualiSpecialization = {
            id: specializationInfo.id,
            pid: specializationInfo.pid,
            title: specializationInfo.title,
            locations: specializationInfo.locations,
            modalities: specializationInfo.modality,
            catalogYear: specializationInfo.catalogYear,
            monthsToComplete: specializationInfo.monthsToComplete,
            code: specializationInfo.code,
            semesters,
            totalCredits
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
            { error: "Failed to fetch specialization" },
            { status: 500 }
        );
    }
}