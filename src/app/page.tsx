import { Section, Container, Prose } from "../components/craft";
import {getTranslations} from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('common');

  return (
    <Section>
      <Container>
        <Prose>
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
        </Prose>
      </Container>
    </Section>
  );
}
