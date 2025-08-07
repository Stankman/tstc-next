import { Container } from "@/components/craft";
import { getAwardById, getCampusById, getIndustryById, getScheduleById } from "@/lib/wordpress";
import { Program } from "@/lib/wordpress.d";
import { KualiProgram } from "@/lib/kuali.d";

interface ProgramInformationProps {
    program: Program;
    kualiProgram?: KualiProgram | null;
}

interface ProgramDetailItem {
    id: string;
    label: string;
    value: string | undefined;
    fallback: string;
}

export async function ProgramInformation({ 
    program, 
    kualiProgram
}: ProgramInformationProps) {
    const schedules = await Promise.all(program.schedule?.map(id => getScheduleById(id)) || []);
    const industries = await Promise.all(program.industry?.map(id => getIndustryById(id)) || []);
    const awards = await Promise.all(program.award?.map(id => getAwardById(id)) || []);
    const campuses = await Promise.all(program.campus?.map(id => getCampusById(id)) || []);

    const programDetails: ProgramDetailItem[] = [
        {
            id: "tuition",
            label: "Tuition",
            value: "0",
            fallback: "Tuition information not available."
        },
        {
            id: "schedule",
            label: "Schedule",
            value: schedules.length > 0 ? schedules.map(schedule => schedule.name).join(", ") : undefined,
            fallback: "Schedule information not available."
        },
        {
            id: "industry",
            label: "Industry",
            value: industries.length > 0 ? industries.map(industry => industry.name).join(", ") : undefined,
            fallback: "Industry information not available."
        },
        {
            id: "awards",
            label: "Awards",
            value: awards.length > 0 ? awards.map(award => award.name).join(", ") : undefined,
            fallback: "Awards information not available."
        },
        {
            id: "locations",
            label: "Locations",
            value: campuses.length > 0 ? campuses.map(campus => campus.name).join(", ") : undefined,
            fallback: "Locations information not available."
        }
    ];

    return (
        <div id="program__information" className="bg-tstc-blue-200 text-white">
            <Container className="px-4 py-8">
                <div id="program__details" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {programDetails.map((detail) => (
                        <div key={detail.id} id={detail.id}>
                            <div className="text-base font-medium" dangerouslySetInnerHTML={{ __html: detail.label }} />
                            <p className="text-xl" dangerouslySetInnerHTML={{ __html: detail.value || detail.fallback }} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
