import { Section, Container, Prose } from "../components/craft";
import { getCampusByCode } from "@/lib/wordpress/campuses/wp-campuses";

export default async function Home() {
  return (
    <Section>
      <Container>
        <Prose className="mx-auto text-center">
          <p className="mt-4 text-lg text-gray-600">
            Hello World
          </p>
        </Prose>
      </Container>
    </Section>
  );
}
