// import { KualiLocation, KualiSpecialization } from "@/lib/kuali.d";
// import { calculateSpecializationCost, formatCurrency } from "@/lib/pricing";
// import { LoadingLink } from "@/components/global/loading-overlay";
// import Image from "next/image";
// import { getKualiLocationById } from "@/lib/kuali";
// import { getCampusByCode } from "@/lib/wordpress/campuses/wp-campuses";
// import { Campus } from "@/lib/wordpress/wordpress.d";

// interface DegreeCardProps {
//     specialization: KualiSpecialization;
//     tier: number;
// }

// async function loadLocationData(locationIds: string[]) {
//     if (!locationIds || locationIds.length === 0) {
//         return [];
//     }

//     try {
//         const locationPromises = locationIds.map(async (locationId) => {
//             const location = await getKualiLocationById(locationId);
//             if (!location) return null;
            
//             const campus = await getCampusByCode(location.code);
//             if (!campus) return null;
            
//             return {
//                 id: locationId,
//                 name: campus.name,
//                 slug: campus.slug
//             };
//         });

//         const results = await Promise.all(locationPromises);
//         return results.filter(loc => loc !== null) as {id: string, name: string, slug: string}[];
//     } catch (error) {
//         console.error('Error loading location data:', error);
//         return [];
//     }
// }

// export async function DegreeCard({ specialization, tier }: DegreeCardProps) {
//     if(!specialization) {
//         return null;
//     }

//     // Load location data on server
//     const locationData = await loadLocationData(specialization.locations);

//     let tuition = '';
//     let debugInfo = '';

//     if(specialization.totalCredits && specialization.totalCredits > 0) {
//         const tuitionValue = calculateSpecializationCost(specialization.totalCredits, tier);
//         if (tuitionValue) {
//             tuition = formatCurrency(tuitionValue);
//             debugInfo = `Id: ${specialization.id}, Credits: ${specialization.totalCredits}, Tier: ${tier}`;
//         } else {
//             tuition = 'N/A';
//             debugInfo = `Error calculating tuition for ${specialization.totalCredits} credits, tier ${tier}`;
//         }
//     } else {
//         tuition = 'N/A';
//         debugInfo = `No totalCredits: ${specialization.totalCredits}`;
//     }

//     const modalities = Object.entries(specialization.modalities || {})
//     .filter(([_, value]) => value === true)
//     .map(([key]) => key);

//     return (
//         <LoadingLink href={`/curriculums/${specialization.id}`} className="block hover:scale-105 transition-transform duration-200">
//             <div className="bg-white text-black p-4 rounded min-h-[400px] flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200">
//                 <div id="header">
//                     <div className="text-xl font-semibold">{specialization.title}</div>
//                     <div className="text-base text-gray-600">{specialization.code}</div>
//                     <div className="inline bg-tstc-blue-100 text-tstc-blue-400 rounded px-2 py-1 text-sm">
//                         Completion time <span className="font-semibold">{specialization.monthsToComplete} months</span>
//                     </div>
//                 </div>
//                 <div id="footer">
//                     <div className="text-lg py-5">
//                         Estimated Tuition <span className="font-semibold">{tuition}</span>
//                     </div>
//                     <div>
//                         <Image className="inline-block mr-2 fill-tstc-blue-300" src="/icons/location-icon.svg" alt="Location Icon" width={24} height={24} />
//                         <div className="inline space-x-1">
//                             {locationData.length > 0 ? (
//                                 locationData.map((location, index) => (
//                                     <span key={location.id}>
//                                         <LoadingLink href={`/campuses/${location.slug}`} className="text-tstc-blue-400 hover:underline">
//                                             {location.name}
//                                         </LoadingLink>
//                                         {index < locationData.length - 1 && ", "}
//                                     </span>
//                                 ))
//                             ) : (
//                                 <span className="text-sm text-gray-500">No locations available</span>
//                             )}
//                         </div>
//                     </div>
//                     <div className="mt-4">
//                         {modalities.map((modality) => (
//                             <span key={modality} className="inline-block bg-tstc-blue-200 text-white rounded px-3 py-1 text-sm font-semibold mr-2">
//                                 {modality}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </LoadingLink>
//     );
// }