import { Section, Container, Prose } from "@/components/craft";
import { Breadcrumbs } from "@/components/global/breadcrumbs";
import { Program } from "@/lib/wordpress.d";
import { getAllItemSlugs, getFeaturedMediaById, getItemBySlug } from "@/lib/wordpress";
import { getKualiProgramId, fetchKualiProgramDataServer, KualiApiResponse } from "@/lib/kuali";
import { siteConfig } from "../../../../site.config";
import Image from "next/image";
import { StatsCard } from "@/components/programs/single/stats-card";
import { ProgramInformation } from "@/components/programs/single/program-information";

export async function generateStaticParams() {
    return await getAllItemSlugs("program");
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const program = await getItemBySlug<Program>("program", slug);

    if(!program) {
        return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}api/og`);

    ogUrl.searchParams.append("title", program.title.rendered);
    // ogUrl.searchParams.append("description", program.excerpt.rendered.replace(/<[^>]+>/g, ''));

    return {
        title: program.title.rendered,
    };
}

export default async function Page({
    params,
}: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const program = await getItemBySlug<Program>("program", slug);
    const featuredMedia = program.featured_media
        ? await getFeaturedMediaById(program.featured_media) : null;

    // Fetch Kuali data if program has a Kuali ID
    let kualiData: KualiApiResponse | null = null;
    const kualiProgramId = getKualiProgramId(program);
    
    if (kualiProgramId) {
        kualiData = await fetchKualiProgramDataServer(kualiProgramId);
    }

    return (
        <Section>
            <div className="bg-tstc-blue-200 text-white">
                <Container className="px-4 py-8">
                    <Breadcrumbs labels={{ 
                        'Programs': '/programs',
                        [program.title.rendered]: `/programs/${slug}`
                    }} />
                    <Prose>
                        <div className="text-4xl md:text-6xl">{program.title.rendered}</div>
                    </Prose>
                </Container>
            </div>

            <div className="relative flex items-center overflow-hidden py-6 bg-tstc-blue-200 h-[500px]">
                {featuredMedia && (
                    <>
                        <Image
                            src={featuredMedia.source_url}
                            alt={program.title.rendered}
                            width={featuredMedia.media_details.width || 1200}
                            height={featuredMedia.media_details.height || 630}
                            className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 w-full h-full bg-white/20" />
                    </>
                )}
                <Container>
                    <StatsCard program={program} kualiData={kualiData} />
                </Container>
            </div>
            
            <ProgramInformation program={program} kualiData={kualiData} />
        </Section>
    );
}