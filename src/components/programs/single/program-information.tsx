import { getAwardById } from "@/lib/wordpress/awards/wp-awards";
import { getCampusById } from "@/lib/wordpress/campuses/wp-campuses";
import { getIndustryById } from "@/lib/wordpress/industries/wp-industries";
import { getScheduleById } from "@/lib/wordpress/schedules/wp-schedules";
import Image from "next/image";
import Link from "next/link";

interface ProgramInformationProps {
    schedules: number[];
    industries: number[];
    awards: number[];
    campuses: number[];
}

export function preloadProgramInformation({ schedules, industries, awards, campuses }: ProgramInformationProps) {
    schedules.forEach((id: number) => void getScheduleById(id));
    industries.forEach((id: number) => void getIndustryById(id));
    awards.forEach((id: number) => void getAwardById(id));
    campuses.forEach((id: number) => void getCampusById(id));
}

export async function ProgramInformation({ schedules, industries, awards, campuses }: ProgramInformationProps) {
    const [schedulesData, industriesData, awardsData, campusesData] = await Promise.all([
        Promise.all(schedules.map(id => getScheduleById(id))),
        Promise.all(industries.map(id => getIndustryById(id))),
        Promise.all(awards.map(id => getAwardById(id))),
        Promise.all(campuses.map(id => getCampusById(id)))
    ]);

    return (
        <div id="program__details" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div id="detail-schedule" className="flex flex-col">
                <span>Schedule</span>
                <span className="text-xl">
                    {schedulesData.length > 0 ? schedulesData.map(schedule => schedule.name).join(", ") : "Not specified"}
                </span>
            </div>
            <div id="detail-industry" className="flex flex-col">
                <span>Industry</span>
                <div>
                {industriesData.length > 0 ? (
                    industriesData.map((industry, index) => (
                        <Link href={`/industries/${industry.slug}`} className="text-xl hover:underline underline-offset-2">
                            {industry.name}
                        </Link>
                    ))
                ) : (
                    <span className="text-xl">Not specified</span>
                )}
                </div>
            </div>
            <div id="detail-awards" className="flex flex-col">
                <span>Award Type</span> 
                <span className="text-xl">
                    {awardsData.length > 0 ? awardsData.map(award => award.name).join(", ") : "Not specified"}
                </span>
            </div>
            <div id="detail-locations" className="flex items-center">
                <Image src="/icons/location-icon-2.svg" className="inline mr-2" alt="Location Icon" width={24} height={24} />
                <div>
                {campusesData.length > 0 ? (
                    campusesData.map((campus, index) => (
                        <span key={campus.slug}>
                            <Link href={`/campuses/${campus.slug}`} className="text-xl hover:underline underline-offset-2">
                                {campus.name}
                            </Link>
                            {index < campusesData.length - 1 && ", "}
                        </span>
                    ))
                ) : (
                    <span className="text-xl">Not specified</span>
                )}
                </div>
            </div>
        </div>
    );
}