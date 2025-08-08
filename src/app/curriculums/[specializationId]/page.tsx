// import { Section, Container } from "@/components/craft";
// import { getKualiSpecializationById } from "@/lib/kuali";
// import { siteConfig } from "../../../../site.config";
// import { Breadcrumbs } from "@/components/global/breadcrumbs";

// export async function generateMetadata({
//     params
// }: {
//     params: Promise<{ specializationId: string }>
// }) {
//     const { specializationId } = await params;
//     const specialization = await getKualiSpecializationById(specializationId);

//     if(!specialization) {
//         return {};
//     }

//     const ogUrl = new URL(`${siteConfig.site_domain}api/og`);

//     ogUrl.searchParams.append("title", specialization.title);

//     return {
//         title: specialization.title,
//     };
// }

// export default async function Page(
//     { params }: { params: Promise<{ specializationId: string }> }
// ) {
//     const { specializationId } = await params;

//     const specialization = await getKualiSpecializationById(specializationId);
    
//     if (!specialization) {
//         return ("");
//     }

//     return (
//         <>
//             <Section className="bg-tstc-blue-200 text-white">
//                 <Container>
//                     <Breadcrumbs labels={{
//                         'Programs': '/programs',
//                         [specialization.title]: `/curriculums/${specializationId}`
//                     }} />
//                     <h1 className="text-4xl">
//                         {specialization.title}
//                     </h1>
//                 </Container>
//             </Section>
//             <Section>
//                 <Container>
//                     <div className="space-y-6">
//                     <div className="flex flex-wrap gap-4">
//                         <div className="inline-flex items-center bg-neutral-100 px-4 py-2 rounded-lg">
//                             <span className="text-neutral-700">Completion Time:</span>
//                             <span className="ml-2 font-semibold text-neutral-900">
//                                 {specialization.monthsToComplete} months
//                             </span>
//                         </div>
                        
//                         <div className="inline-flex items-center bg-neutral-100 px-4 py-2 rounded-lg">
//                             <span className="text-neutral-700">Program Code:</span>
//                             <span className="ml-2 font-semibold text-neutral-900">
//                                 {specialization.code}
//                             </span>
//                         </div>
                        
//                         <div className="inline-flex items-center bg-neutral-100 px-4 py-2 rounded-lg">
//                             <span className="text-neutral-700">Available Locations:</span>
//                             <span className="ml-2 font-semibold text-neutral-900">
//                                 {specialization.locations.join(", ")}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//                 </Container>
//             </Section>
//             {specialization.prerequisites && specialization.prerequisites.length > 0 && (
//                 <Section>
//                     <Container>
//                         <div className="space-y-4">
//                             <h2 className="text-3xl font-bold text-tstc-blue-400">Prerequisites</h2>
//                             <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
//                                 <div className="space-y-3">
//                                     {specialization.prerequisites.map((prerequisite, index) => (
//                                         <div key={index} className="flex items-start space-x-3">
//                                             <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
//                                                 {index + 1}
//                                             </div>
//                                             <p className="text-amber-800 text-sm leading-relaxed">
//                                                 {prerequisite}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </Container>
//                 </Section>
//             )}
//             <Section>
//                 <Container>
//                     <div className="space-y-4">
//                         <h2 className="text-3xl font-bold text-tstc-blue-400">Curriculum</h2>
//                         {specialization.semesters ? (
//                             specialization.semesters.map((semester, semesterIndex) => (
//                                 <details key={semesterIndex} className="group border border-neutral-200 rounded-lg">
//                                     <summary className="flex cursor-pointer items-center justify-between bg-neutral-50 px-6 py-4 font-semibold text-neutral-900 group-open:bg-tstc-blue-50">
//                                         <span>{semester.label}</span>
//                                         <span className="ml-2 transform transition-transform group-open:rotate-180">
//                                             ▼
//                                         </span>
//                                     </summary>
//                                     <div className="px-6 py-4">
//                                         <div className="space-y-4">
//                                             {semester.blocks.map((block, blockIndex) => (
//                                                 <div key={blockIndex} className="border border-neutral-100 rounded-md">
//                                                     <div className="bg-neutral-25 px-4 py-3">
//                                                         <div className="flex justify-between items-center">
//                                                             <span className="font-medium text-neutral-800">
//                                                                 {block.optional ? 'Complete at least ' : 'Complete the following '}
//                                                                 {block.optional && `${block.minimumCredits} credits from the following courses:`}
//                                                                 {!block.optional && 'courses:'}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                     <div className="px-4 py-3 bg-white">
//                                                         <div className="space-y-2">
//                                                             {block.courses.map((course, courseIndex) => (
//                                                                 <details key={courseIndex} className="group border border-neutral-50 rounded-md">
//                                                                     <summary className="flex cursor-pointer items-center justify-between py-2 px-3 hover:bg-neutral-25 transition-colors">
//                                                                         <div>
//                                                                             <span className="font-medium">{course.code}{course.number}</span>
//                                                                             <span className="mx-2">-</span>
//                                                                             <span>{course.title}</span>
//                                                                         </div>
//                                                                         <div className="flex items-center space-x-2">
//                                                                             <div className="text-sm text-neutral-600">
//                                                                                 <span>{course.credits} credits</span>
//                                                                                 {(course.lecture > 0 || course.lab > 0) && (
//                                                                                     <span className="ml-2">
//                                                                                         ({course.lecture} lec, {course.lab} lab)
//                                                                                     </span>
//                                                                                 )}
//                                                                             </div>
//                                                                             <span className="ml-2 transform transition-transform group-open:rotate-180">
//                                                                                 ▶
//                                                                             </span>
//                                                                         </div>
//                                                                     </summary>
//                                                                     <div className="px-3 pb-3 bg-neutral-25">
//                                                                         {course.description ? (
//                                                                             <p className="text-sm text-neutral-700 leading-relaxed">
//                                                                                 {course.description}
//                                                                             </p>
//                                                                         ) : (
//                                                                             <p className="text-sm text-neutral-500 italic">
//                                                                                 No description available
//                                                                             </p>
//                                                                         )}
//                                                                     </div>
//                                                                 </details>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </details>
//                             ))
//                         ) : (
//                             <p className="text-neutral-500 text-center py-8">No curriculum data available</p>
//                         )}
//                     </div>
//                 </Container>
//             </Section>
//         </>
//     );
// }