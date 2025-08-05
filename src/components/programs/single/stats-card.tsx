import { Program } from "@/lib/wordpress.d";
import { KualiApiResponse, KualiTimelineLabel } from "@/lib/kuali";

export async function StatsCard({ 
    program, 
    kualiData 
}: { 
    program: Program; 
    kualiData?: KualiApiResponse | null; 
}) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 w-1/3">
            <div className="text-2xl">Program Information</div>
            
            {/* WordPress Program Data */}
            <div className="mt-4 space-y-2">
                <div>
                    <strong>Program:</strong> {program.title.rendered}
                </div>
                {program.acf?.short_description && (
                    <div>
                        <strong>Description:</strong> {program.acf.short_description}
                    </div>
                )}
                {program.acf?.tuition && (
                    <div>
                        <strong>Tuition:</strong> {program.acf.tuition}
                    </div>
                )}
            </div>

            {/* Kuali Program Data */}
            {kualiData && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold mb-3">Additional Details</div>
                    
                    {kualiData.locations.length > 0 && (
                        <div className="mb-2">
                            <strong>Available Locations:</strong>
                            <ul className="list-disc list-inside ml-2">
                                {kualiData.locations.slice(0, 3).map((location) => (
                                    <li key={location.id} className="text-sm">{location.name}</li>
                                ))}
                                {kualiData.locations.length > 3 && (
                                    <li className="text-sm text-gray-500">
                                        +{kualiData.locations.length - 3} more
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {kualiData.degreeTypes.length > 0 && (
                        <div className="mb-2">
                            <strong>Degree Types:</strong>
                            <div className="text-sm">
                                {kualiData.degreeTypes.slice(0, 2).map(dt => dt.name).join(', ')}
                                {kualiData.degreeTypes.length > 2 && ` +${kualiData.degreeTypes.length - 2} more`}
                            </div>
                        </div>
                    )}

                    {kualiData.modalities.length > 0 && (
                        <div className="mb-2">
                            <strong>Learning Formats:</strong>
                            <div className="text-sm">
                                {kualiData.modalities.slice(0, 2).map(mod => mod.name).join(', ')}
                                {kualiData.modalities.length > 2 && ` +${kualiData.modalities.length - 2} more`}
                            </div>
                        </div>
                    )}

                    {kualiData.specializations.length > 0 && (
                        <div className="mb-2">
                            <strong>Specializations:</strong>
                            <div className="text-sm">
                                {kualiData.specializations.slice(0, 2).map(spec => {
                                    const currentTimeline = spec.timelines?.find((t: any) => t.timeline === 'current');
                                    return `${spec.title}${currentTimeline ? ` (${currentTimeline.start})` : ''}`;
                                }).join(', ')}
                                {kualiData.specializations.length > 2 && ` +${kualiData.specializations.length - 2} more`}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}