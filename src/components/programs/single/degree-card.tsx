import { KualiSpecialization } from "@/lib/kuali.d";
import { calculateProgramTuition, formatCurrency } from "@/lib/pricing";
import { col } from "motion/react-client";

interface DegreeCardProps {
    specialization: KualiSpecialization;
    tier: number | 1;
}

export function DegreeCard({ specialization, tier }: DegreeCardProps) {
    if(!specialization) {
        return null;
    }

    let tuition = '';

    if(specialization.totalCredits) {
        const tuitionValue = calculateProgramTuition(tier, specialization.totalCredits);
        tuition = tuitionValue ? formatCurrency(tuitionValue) : 'N/A';
    }

    const modalities = Object.entries(specialization.modalities || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

    return (
        <div className="bg-white text-black p-4 rounded min-h-[400px] flex flex-col justify-between">
            <div id="header">
                <div className="text-xl font-semibold">{specialization.title}</div>
                <div className="text-base text-gray-600">{specialization.code}</div>
                <div className="inline bg-tstc-blue-100 text-tstc-blue-400 rounded px-2 py-1 text-sm">
                    Completion time <span className="font-semibold">{specialization.monthsToComplete} months</span>
                </div>
            </div>
            <div id="footer">
                <div className="text-lg py-5">
                    Estimated Tuition <span className="font-semibold">{tuition}</span>
                </div>
                <div className="mt-4">
                    {modalities.map((modality) => (
                        <span key={modality} className="inline-block bg-tstc-blue-200 text-white rounded px-3 py-1 text-sm font-semibold mr-2">
                            {modality}
                        </span>
                    ))}
                </div>
            </div>
        </div>

    );
}