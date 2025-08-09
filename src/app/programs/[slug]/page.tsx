import { Section, Container } from "@/components/craft";
import { DegreeCardsContainer } from "@/components/programs/single/degree-cards-container";
import { ProgramInformation, preloadProgramInformation } from "@/components/programs/single/program-information";
import InstructorsCarousel from "@/components/programs/single/instructors-carousel";
import { KualiProgram } from "@/lib/kuali/kuali";
import { getKualiProgramById, preloadKualiSpecialization } from "@/lib/kuali/kuali.client";
import { getFeaturedMediaById } from "@/lib/wordpress/media/wp-media";
import { getProgramBySlug } from "@/lib/wordpress/programs/wp-programs";
import { FeaturedMedia, Program } from "@/lib/wordpress/wordpress.d";
import { TestimonialCard, TestimonialCardSkeleton } from "@/components/programs/single/testimonial-card";

export default async function Page(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const program: Program = await getProgramBySlug(slug);

    if (!program) return <div>Program not found</div>;
    if (!program.acf.kuali_id) return <div>Program does not have a Kuali ID</div>;

    const kualiProgram: KualiProgram | null = await getKualiProgramById(program.acf.kuali_id);

    if (kualiProgram?.specializations?.length) {
        kualiProgram.specializations.forEach(s => preloadKualiSpecialization(s.pid));
    }

    preloadProgramInformation({
        schedules: program.schedule,
        industries: program.industry,
        awards: program.award,
        campuses: program.campus
    });

    const featuredMedia: FeaturedMedia = await getFeaturedMediaById(program.featured_media);
    
    return (
        <>
            <Section className="bg-tstc-blue-300 text-white">
                <Container className="px-4 py-8">
                    <h1 className="text-6xl md:text-6xl">{program.title.rendered}</h1>
                </Container>
            </Section>
            <Section>
                <div 
                    className="relative min-h-[400px] md:min-h-[800px] bg-cover bg-top bg-no-repeat flex items-center justify-center"
                    style={{
                        backgroundImage: featuredMedia?.source_url ? `url(${featuredMedia.source_url})` : undefined
                    }}
                >
                    <div className="absolute inset-0 bg-white/40"></div>
                    <Container>
                        <div className="relative z-10 text-center text-white px-4">
                        {/* Hero content will go here */}
                        </div>
                    </Container>
                </div>
            </Section>
            <Section className="bg-tstc-blue-300 text-white">
                <Container className="px-4 py-8">
                    <ProgramInformation schedules={program.schedule} industries={program.industry} awards={program.award} campuses={program.campus} />
                </Container>
            </Section>
            <Section className="bg-tstc-blue-300 text-white">
                <Container className="px-4 py-8">
                    <div>
                        <h2 className="text-2xl md:text-4xl mb-5">Degree Plans</h2>
                        {kualiProgram && kualiProgram.specializations ? (
                        <DegreeCardsContainer specializationPids={kualiProgram.specializations.map(s => s.pid)} tier={program.acf.tier} />
                        ) : (
                        <div>Kuali program ID: {program.acf.kuali_id} not found</div>
                        )}
                    </div>
                </Container>
            </Section>
            {program.acf.instructors && program.acf.instructors.length > 0 ? (
                <Section>
                    <Container className="px-4 py-8">
                        <InstructorsCarousel 
                            instructors={program.acf.instructors} // Dummy instructor IDs for testing
                            title="Expert Instructors"
                        />
                    </Container>
                </Section>
            ) : (<></>)}
            <Section className="bg-gray-100">
                <Container className="px-4 py-8">
                    <div className="grid grid-cols-2">
                        <TestimonialCard />
                        <TestimonialCard />
                        <TestimonialCard />
                    </div>
                </Container>
            </Section>
        </>
    );
}