import { Program } from "@/lib/wordpress/wordpress.d";

interface StatsCardProps {
    program: Program;
}

export async function StatsCard({ program }: StatsCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 w-1/3">
            <div className="text-2xl">Program Information</div>
        </div>
    );
}