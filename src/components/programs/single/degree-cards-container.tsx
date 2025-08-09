import { getKualiSpecializationById } from "@/lib/kuali/kuali.client";
import { DegreeCard } from "./degree-card";
import { Suspense } from "react";
import { DegreeCardSkeleton } from "./degree-card-skeleton";
import { AnimatedGrid } from "./animate-grid";

interface DegreeCardsContainerProps {
    specializationPids: string[];
    tier: number;
}

export function DegreeCardsContainer({ specializationPids, tier = 1 }: DegreeCardsContainerProps) {
    const promises = specializationPids.map(pid =>
        getKualiSpecializationById(pid)
    );

    return (
        <>
            {specializationPids && specializationPids.length > 0 ? (
                <AnimatedGrid>
                    {promises.map((promise, index) => (
                        <Suspense key={specializationPids[index]} fallback={<DegreeCardSkeleton />}>
                            <DegreeCard key={index} promise={promise} tier={tier} />
                        </Suspense>
                    ))}
                </AnimatedGrid>
            ) : (
                <div>No degree plans found</div>
            )}
        </>
    );
}