import { Container } from "@/components/craft";
import { getAwardById, getCampusById, getIndustryById, getScheduleById } from "@/lib/wordpress";
import { Program } from "@/lib/wordpress.d";
import { KualiApiResponse, KualiTimelineLabel, KualiDegreePlan, KualiSemester, KualiCourse } from "@/lib/kuali";
import { calculateProgramTuition, getTuitionCost, formatCurrency } from "@/lib/pricing";
import { TuitionSummary } from "./tuition-summary";

interface ProgramInformationProps {
    program: Program;
    kualiData?: KualiApiResponse | null;
    showNotice?: boolean;
    noticeText?: string;
}

interface ProgramDetailItem {
    id: string;
    label: string;
    value: string | undefined;
    fallback: string;
}

export async function ProgramInformation({ 
    program, 
    kualiData,
    showNotice = true,
    noticeText = "This program will not be offered Fall 2025"
}: ProgramInformationProps) {
    // Fetch all taxonomy data
    const schedules = await Promise.all(program.schedule?.map(id => getScheduleById(id)) || []);
    const industries = await Promise.all(program.industry?.map(id => getIndustryById(id)) || []);
    const awards = await Promise.all(program.award?.map(id => getAwardById(id)) || []);
    const campuses = await Promise.all(program.campus?.map(id => getCampusById(id)) || []);

    const programDetails: ProgramDetailItem[] = [
        {
            id: "tuition",
            label: "Tuition",
            value: program.acf?.tuition,
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
                
                {/* Kuali Data Section */}
                {kualiData && (
                    <div id="kuali__information" className="mt-8 pt-8 border-t border-white/20">
                        <h3 className="text-2xl font-bold mb-6">Additional Program Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kualiData.locations.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Available Locations</h4>
                                    <ul className="space-y-1">
                                        {kualiData.locations.map((location) => (
                                            <li key={location.id} className="text-sm">
                                                • {location.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {kualiData.degreeTypes.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Degree Types</h4>
                                    <ul className="space-y-1">
                                        {kualiData.degreeTypes.map((degreeType) => (
                                            <li key={degreeType.id} className="text-sm">
                                                • {degreeType.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {kualiData.modalities.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Learning Formats</h4>
                                    <ul className="space-y-1">
                                        {kualiData.modalities.map((modality) => (
                                            <li key={modality.id} className="text-sm">
                                                • {modality.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {kualiData.specializations.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Specializations & Degree Plans</h4>
                                    <div className="space-y-4">
                                        {kualiData.specializations.map((specialization) => (
                                            <div key={specialization.id} className="border-l-2 border-white/30 pl-4 bg-white/5 rounded-r-lg p-4">
                                                <div className="font-medium text-base mb-2">• {specialization.title}</div>
                                                
                                                {/* Degree Plan Details */}
                                                {specialization.degreePlan && (
                                                    <div className="mb-3 bg-white/5 rounded p-3">
                                                        <h5 className="text-sm font-semibold mb-2 text-yellow-200">Degree Plan Details</h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                                                            <div>
                                                                <strong>Code:</strong> {specialization.degreePlan.code}
                                                            </div>
                                                            <div>
                                                                <strong>Spec PID:</strong> {specialization.pid || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <strong>Duration:</strong> {specialization.degreePlan.monthsToComplete} months
                                                            </div>
                                                            <div>
                                                                <strong>Total Credits:</strong> {specialization.degreePlan.totalCredits || 'N/A'}
                                                            </div>
                                                            <div className="col-span-full">
                                                                <strong>Locations:</strong> {specialization.degreePlan.locations.length} available
                                                            </div>
                                                        </div>

                                                        {/* Tuition Cost Breakdown */}
                                                        {specialization.degreePlan.semesters && specialization.degreePlan.semesters.length > 0 && (() => {
                                                            const totalCredits = specialization.degreePlan.totalCredits || 0;
                                                            const programTier = program.acf?.tier || 1; // Default to tier 1 if not specified
                                                            
                                                            return totalCredits > 0 && (
                                                                <div className="mb-3">
                                                                    <TuitionSummary 
                                                                        tier={programTier} 
                                                                        credits={totalCredits}
                                                                        className="text-sm"
                                                                    />
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* Semester Breakdown */}
                                                        {specialization.degreePlan.semesters && specialization.degreePlan.semesters.length > 0 && (
                                                            <div className="mt-3">
                                                                <h6 className="text-xs font-semibold mb-2 text-blue-200">Semester Breakdown:</h6>
                                                                <div className="space-y-2">
                                                                    {specialization.degreePlan.semesters.map((semester: KualiSemester, semIndex: number) => (
                                                                        <div key={semIndex} className="bg-white/5 rounded p-2">
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <span className="text-xs font-medium">{semester.label}</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
                                                                                        {semester.credits} credits
                                                                                    </span>
                                                                                    {(() => {
                                                                                        const programTier = program.acf?.tier || 1;
                                                                                        const semesterCost = getTuitionCost(programTier, semester.credits);
                                                                                        return semesterCost && (
                                                                                            <span className="text-xs bg-green-600/30 text-green-200 px-2 py-1 rounded">
                                                                                                {formatCurrency(semesterCost)} (Tier {programTier})
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            </div>

                                                            {/* Semester Tuition Options - Removed for now */}                                                                            {semester.blocks.map((block, blockIndex) => (
                                                                                <div key={blockIndex} className="ml-2 mb-2">
                                                                                    {block.optional && (
                                                                                        <div className="text-xs text-yellow-300 mb-1 font-medium">
                                                                                            ⚡ Optional Block (Min: {block.minimumCredits} credits required)
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="space-y-1">
                                                                                        {block.courses.map((course: KualiCourse, courseIndex: number) => (
                                                                                            <div key={courseIndex} className="text-xs flex justify-between items-center bg-white/5 rounded px-2 py-1">
                                                                                                <div className="flex-1">
                                                                                                    <strong>{course.code}{course.number}</strong> - {course.title}
                                                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                                                        Lecture: {course.lecture}hrs • Lab: {course.lab}hrs
                                                                                                    </div>
                                                                                                </div>
                                                                                                <span className="text-gray-300 ml-2">
                                                                                                    ({course.credits})
                                                                                                </span>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    {block.courses.length > 0 && (
                                                                                        <div className="text-xs text-right mt-1">
                                                                                            <span className="text-gray-400">
                                                                                                Block Total: {block.credits} credits
                                                                                            </span>
                                                                                            {block.optional && (
                                                                                                <span className="text-yellow-300 ml-2">
                                                                                                    (Only {block.minimumCredits} counted toward degree)
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {specialization.degreePlan.description && (
                                                            <div className="mt-2 text-xs opacity-80">
                                                                <strong>Description:</strong> {specialization.degreePlan.description.substring(0, 200)}
                                                                {specialization.degreePlan.description.length > 200 && '...'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Original Description */}
                                                {specialization.description && (
                                                    <div className="text-xs opacity-80 mb-3">
                                                        <strong>Overview:</strong> {specialization.description.substring(0, 150)}
                                                        {specialization.description.length > 150 && '...'}
                                                    </div>
                                                )}
                                                
                                                {/* Timeline Data */}
                                                {specialization.timelines && specialization.timelines.length > 0 && (
                                                    <div className="mb-3">
                                                        <div className="text-xs font-medium opacity-90 mb-2">Timeline Labels:</div>
                                                        <div className="space-y-1">
                                                            {specialization.timelines.map((timeline: any) => (
                                                                <div key={timeline.id} className="text-xs opacity-80 bg-white/10 rounded px-2 py-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium">{timeline.label}</span>
                                                                        <span className={`text-xs px-1 rounded ${
                                                                            timeline.timeline === 'current' ? 'bg-green-500/30 text-green-200' :
                                                                            timeline.timeline === 'past' ? 'bg-gray-500/30 text-gray-300' :
                                                                            'bg-blue-500/30 text-blue-200'
                                                                        }`}>
                                                                            {timeline.timeline}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs opacity-60 mt-1">
                                                                        Start: {timeline.start} • Status: {timeline.status}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="text-xs opacity-60 mt-3 pt-2 border-t border-white/10">
                                                    ID: {specialization.id} | PID: {specialization.pid} | Status: {specialization.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {kualiData.program.description && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-3">Program Description</h4>
                                <div className="text-sm opacity-90">
                                    {kualiData.program.description}
                                </div>
                            </div>
                        )}

                        {/* Debug info - can remove later */}
                        {kualiData.program.groupFilter2 && (
                            <div className="mt-6 p-4 bg-black/20 rounded-lg">
                                <h4 className="text-lg font-semibold mb-2">Debug Info</h4>
                                <div className="text-xs">
                                    <strong>GroupFilter2:</strong> {kualiData.program.groupFilter2}
                                </div>
                                <div className="text-xs mt-1">
                                    <strong>Specializations URL:</strong><br />
                                    https://tstc.kuali.co/api/v0/cm/search?index=specializations_latest&groupFilter={kualiData.program.groupFilter2}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Program Notices */}
                {showNotice && (
                    <div id="program__notices">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tstc-blue-400 text-white hover:bg-tstc-blue-500 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                            </svg>
                            {noticeText}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}
