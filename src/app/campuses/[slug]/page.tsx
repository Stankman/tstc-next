import { Section, Container, Prose } from "@/components/craft";
import { getCampusBySlug } from "@/lib/wordpress/campuses/wp-campuses";
import { Campus } from "@/lib/wordpress/wordpress.d";

export default async function Page(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const campus: Campus = await getCampusBySlug(slug);

    return (
        <Section>
            <Container>
                <Prose className="mx-auto text-center">
                    <p className="mt-4 text-lg text-gray-600">
                        {campus.name} Campus
                    </p>
                </Prose>
            </Container>
        </Section>
    );
}