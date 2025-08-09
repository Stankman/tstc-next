import { KualiSpecialization } from "@/lib/kuali/kuali";
import { calculateSpecializationCost, formatCurrency } from "@/lib/pricing";
import Image from "next/image";
import Link from "next/link";

interface DegreeCardProps {
    promise: Promise<KualiSpecialization | null>;
    tier?: number | 1;
}

export async function DegreeCard({ promise, tier = 1 }: DegreeCardProps) {
    const data = await promise;

    if (!data) {
        return (
            <div className="bg-red-400 text-white p-4 rounded min-h-[400px] flex flex-col justify-between">
                <div className="text-lg font-semibold">Specialization not found</div>
                <p className="text-sm">The requested specialization could not be found or is unavailable.</p>
            </div>
        );
    }

    return (
        <Link href={`/curriculums/${data.id}`} className="block hover:scale-105 transition-transform duration-200">
            <div className="bg-white text-black p-4 rounded min-h-[250px] md:min-h-[300px] flex flex-col justify-between">
                <div id="header">
                    <div className="text-xl font-semibold">{data.title}</div>
                    <div id="information" className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{data.code}</span>
                        <span className="bg-tstc-blue-100 text-sm text-tstc-blue-400 rounded px-2 py-1">Completion Time: <b>{data.monthsToComplete} months</b></span>
                    </div>
                </div>
                <div id="footer">
                    <div id="tuition" className="flex flex-col">
                        <label className="text-sm">Estimated Tuition</label>
                        <span className="text-lg font-semibold">{formatCurrency(calculateSpecializationCost(data.totalCredits ?? 0, tier, 2025) ?? 0)}</span>
                    </div>
                    <div id="locations" className="flex items-center space-x-2 my-2">
                        <Image src="/icons/location-icon.svg" className="text-blue-100" alt="Location Icon" height={24} width={24} />
                        {data.locationsWP && data.locationsWP.length > 0 ? (
                            <span className="text-sm text-tstc-blue-400">
                                {data.locationsWP.map(location => location.name).join(", ")}
                            </span>
                        ) : (
                            <span className="text-gray-600">No locations available</span>
                        )}
                    </div>
                    <div id="modalities">
                        <div className="flex flex-wrap space-x-2">
                            {data.modalities && Object.entries(data.modalities).map(([key, value]) => (
                                value ? (
                                    <span key={key} className="bg-tstc-blue-300 text-white rounded px-2 py-1 text-xs">
                                        {key}
                                    </span>
                                ) : null
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}