import { Section, Container, Prose } from "@/components/craft";
import { getProgramBySlug } from "@/lib/wordpress/programs/wp-programs";
import { Program } from "@/lib/wordpress/wordpress.d";

export default async function Page(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const program: Program = await getProgramBySlug(slug);

    return (
        <>
            <Section>
                <Container className="px-4 py-8">
                    <Prose>
                        <h1 className="text-4xl md:text-6xl">{program.title.rendered}</h1>
                    </Prose>
                </Container>
            </Section>
        </>
    );
}