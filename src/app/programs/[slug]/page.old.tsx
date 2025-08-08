// import Image from "next/image";
// import { Section, Container, Prose } from "@/components/craft";
// import { Breadcrumbs } from "@/components/global/breadcrumbs";
// import { StatsCard } from "@/components/programs/single/stats-card";
// import { ProgramInformation } from "@/components/programs/single/program-information";
// import { DegreeCardsContainer } from "@/components/programs/single/degree-cards-container";
// import { getAllProgramsSlugs, getProgramBySlug } from "@/lib/wordpress/programs/wp-programs";
// import { getKualiProgramById } from "@/lib/kuali";
// import { KualiProgram } from "@/lib/kuali.d";
// import { siteConfig } from "../../../../site.config";
// import { getFeaturedMediaById } from "@/lib/wordpress/media/wp-media";
// import { Program } from "@/lib/wordpress/wordpress.d";

// export async function generateStaticParams() {
//     return await getAllProgramsSlugs();
// }

// export async function generateMetadata({
//     params
// }: {
//     params: Promise<{ slug: string }>
// }) {
//     const { slug } = await params;
//     const program = await getProgramBySlug(slug);

//     if(!program) {
//         return {};
//     }

//     const ogUrl = new URL(`${siteConfig.site_domain}api/og`);

//     ogUrl.searchParams.append("title", program.title.rendered);
//     // ogUrl.searchParams.append("description", program.excerpt.rendered.replace(/<[^>]+>/g, ''));

//     return {
//         title: program.title.rendered,
//     };
// }

// export default async function Page(
//     { params }: { params: Promise<{ slug: string }> }
// ) {
//     const { slug } = await params;
//     const program: Program = await getProgramBySlug(slug);
//     const featuredMedia = program.featured_media ? await getFeaturedMediaById(program.featured_media) : null;

//     let kualiProgramData: KualiProgram | null = null;
//     const kualiProgramId = program.acf?.kuali_id;
    
//     if (kualiProgramId) {
//         kualiProgramData = await getKualiProgramById(kualiProgramId);
//     }

//     return (
//         <>
//             <Section>
//                 <div className="bg-tstc-blue-200 text-white">
//                     <Container className="px-4 py-8">
//                         <Breadcrumbs labels={{ 
//                             'Programs': '/programs',
//                             [program.title.rendered]: `/programs/${slug}`
//                         }} />
//                         <Prose>
//                             <div className="text-4xl md:text-6xl">{program.title.rendered}</div>
//                         </Prose>
//                     </Container>
//                 </div>
//             </Section>
//             <Section>
//                 <div className="relative flex items-center overflow-hidden py-6 bg-tstc-blue-200 h-[500px]">
//                     {featuredMedia && (
//                         <>
//                             <Image
//                                 src={featuredMedia.source_url}
//                                 alt={program.title.rendered}
//                                 width={featuredMedia.media_details.width || 1200}
//                                 height={featuredMedia.media_details.height || 630}
//                                 className="absolute inset-0 w-full h-full object-cover object-top"
//                             />
//                             <div className="absolute inset-0 w-full h-full bg-white/20" />
//                         </>
//                     )}
//                     <Container>
//                         <StatsCard program={program} />
//                     </Container>
//                 </div>
                
//                 <ProgramInformation program={program} kualiProgram={kualiProgramData} />
//             </Section>
//             <Section className="bg-tstc-blue-200 text-white">
//                 <Container>
//                     {kualiProgramData && kualiProgramData.specializations && kualiProgramData.specializations.length > 0 && (
//                         <DegreeCardsContainer 
//                             specializations={kualiProgramData.specializations} 
//                             tier={program.acf?.tier || 1} 
//                         />
//                     )}
//                 </Container>
//             </Section>
//         </>
//     );
// }