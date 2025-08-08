// import { KualiLocation } from "@/lib/kuali.d";
// import { getKualiLocationById } from "@/lib/kuali";
// import { Campus } from "@/lib/wordpress/wordpress.d";
// import Image from "next/image";
// import { getCampusByCode } from "@/lib/wordpress/campuses/wp-campuses";
// import { LoadingLink } from "./loading-overlay";
// import { Suspense } from "react";

// interface DegreeLocationsProps {
//     locationIds: string[];
// }

// function DegreeLocationsLoading() {
//     return (
//         <>
//             <div className="w-6 h-6 bg-gray-300 rounded animate-pulse inline-block mr-2"></div>
//             <span className="inline ml-2">
//                 <div className="h-4 bg-gray-200 rounded w-32 animate-pulse inline-block"></div>
//             </span>
//         </>
//     );
// }

// async function DegreeLocationsContent({ locationIds }: DegreeLocationsProps) {
//     // Fetch location data here with Promise.all
//     const locations: (KualiLocation | null)[] = await Promise.all(
//         locationIds.map(id => getKualiLocationById(id))
//     );
    
//     // Filter out null values and get campus data
//     const validLocations = locations.filter((location): location is KualiLocation => location !== null);
    
//     const campuses: (Campus | null)[] = await Promise.all(
//         validLocations.map(location => getCampusByCode(location.code))
//     );

//     return (
//         <>
//             <Image src="/icons/location-icon.svg" alt="Location Icon" width={24} height={24} />
//             <span className="inline ml-2">
//                 {validLocations.length > 0 ? (
//                     validLocations.map((location, index) => {
//                         const campus = campuses[index];
//                         return (
//                             <span key={location.id}>
//                                 {campus ? (
//                                     <LoadingLink href={`/campuses/${campus.slug}`} className="text-tstc-blue-500 hover:underline">
//                                         {campus.name}
//                                     </LoadingLink>
//                                 ) : (
//                                     <span>{location.name}</span>
//                                 )}
//                                 {index < validLocations.length - 1 && ", "}
//                             </span>
//                         );
//                     })
//                 ) : (
//                     <span>No locations available</span>
//                 )}
//             </span>
//         </>
//     );
// }

// export function DegreeLocations({ locationIds }: DegreeLocationsProps) {
//     return (
//         <Suspense fallback={<DegreeLocationsLoading />}>
//             <DegreeLocationsContent locationIds={locationIds} />
//         </Suspense>
//     );
// }