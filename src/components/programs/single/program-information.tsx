import { Container } from "@/components/craft";
import { Program } from "@/lib/wordpress/wordpress.d";
import { KualiProgram } from "@/lib/kuali/kuali";
import { calculateProgramTuitionRange, formatCurrency } from "@/lib/pricing";
import { getCampusById } from "@/lib/wordpress/campuses/wp-campuses";
import { getIndustryById } from "@/lib/wordpress/industries/wp-industries";
import { getAwardById } from "@/lib/wordpress/awards/wp-awards";
import { getScheduleById } from "@/lib/wordpress/schedules/wp-schedules";

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

    // Calculate tuition based on program tier and specializations
    const calculateTuition = (): string => {
        const tier = program.acf?.tier;
        
        if (!tier || tier < 1 || tier > 4) {
            return "Tuition information not available.";
        }

        // If we have Kuali program data with specializations, calculate range
        if (kualiProgram?.specializations && kualiProgram.specializations.length > 0) {
            const specializationsWithCredits = kualiProgram.specializations.filter(spec => spec.totalCredits && spec.totalCredits > 0);
            
            if (specializationsWithCredits.length > 0) {
                const tuitionRange = calculateProgramTuitionRange(
                    specializationsWithCredits.map(spec => ({ totalCredits: spec.totalCredits! })),
                    tier
                );
                
                if (tuitionRange) {
                    const { min, max } = tuitionRange;
                    if (min === max) {
                        return formatCurrency(min);
                    } else {
                        return `${formatCurrency(min)} - ${formatCurrency(max)}`;
                    }
                }
            }
        }

        return "Tuition information not available.";
    };

    const programDetails: ProgramDetailItem[] = [
        {
            id: "tuition",
            label: "Tuition",
            value: calculateTuition(),
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
