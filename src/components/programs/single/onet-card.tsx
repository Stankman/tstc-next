import { getOnetData, OnetData } from "@/lib/onet/onet.client";
import { OnetCardClient } from "./onet-card-client";

interface OnetCardProps {
  onetId?: string;
  onetUrl?: string;
}

export async function OnetCard({ onetId, onetUrl }: OnetCardProps) {
  if (!onetId) {
    return <OnetCardSkeleton />;
  }

  try {
    const onetData: OnetData = await getOnetData(onetId);
    return <OnetCardClient onetData={onetData} onetUrl={onetUrl} />;
  } catch (error) {
    console.error('Error fetching ONET data:', error);
    return <OnetCardSkeleton />;
  }
}

export function OnetCardSkeleton() {
    return (
        <div className="w-full bg-tstc-blue-300 text-white flex flex-col justify-between p-6 rounded min-h-[300px] md:min-h-[250px] md:max-w-[300px]">
            <div className="border-b-white/40 border-b space-y-2">
                <div id="title" className="h-6 bg-white/40 rounded w-3/4 animate-pulse"></div>
                <div id="median" className="h-10 bg-white/40 rounded w-1/2 animate-pulse"></div>
                <div id="median-label" className="h-6 bg-white/40 rounded w-1/3 animate-pulse mb-2"></div>
            </div>
            <div className="h-6 bg-white/40 rounded w-1/2 animate-pulse"></div>
        </div>
    )
}