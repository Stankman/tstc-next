import { Breadcrumbs } from "@/components/global/breadcrumbs";
import { Section, Container, Prose } from "../../components/craft";
import { getAllCampuses, getAllIndustries, getItemsPaginated, getProgramsPaginated } from "../../lib/wordpress";
import { ProgramCard } from "@/components/programs/archive/program-card";
import { Program } from "@/lib/wordpress.d";
import { ProgramSearch } from "@/components/programs/archive/program-search";
import { TaxonomyFilter } from "@/components/programs/archive/taxonomy-filter";
import { ProgramPagination } from "@/components/programs/archive/program-pagination";
import {getTranslations} from 'next-intl/server';

// Archive Page (Server Component)
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        page?: string;
        search?: string;
        campus?: string;
        industry?: string;
    }>
}) {
    const t = await getTranslations('programs');
    const params = await searchParams;
    const { page: pageParam, search, campus, industry } = params;

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const resultsPerPage = 9;

    const [postsResponse, campuses, industries] = await Promise.all([
        getProgramsPaginated(page, resultsPerPage, { campus, industry, search }),
        getAllCampuses(),
        getAllIndustries().catch(() => []), // Gracefully handle if industry taxonomy doesn't exist yet
    ]);

    const { data: programs, headers } = postsResponse;
    const { total, totalPages } = headers;

    return (
        <Section>
            <div className="bg-tstc-blue-200 text-white">
                <Container className="px-4 py-8">
                    <Breadcrumbs labels={{ [t('title')]: '/programs' }} />
                    <Prose>
                        <div className="text-4xl md:text-6xl">{t('title')}</div>
                    </Prose>
                </Container>
            </div>
            <Container className="flex flex-col md:flex-row py-6">
                {/* Category Filters */}
                <div id="filters" className="flex-none w-full md:w-1/4 px-4 mb-6 md:mb-0">
                    <div className="text-3xl mb-4">Filters</div>
                    <ProgramSearch />
                    {/* Campus Filter */}
                    <TaxonomyFilter 
                        items={campuses}
                        taxonomyKey="campus"
                        label="Campuses"
                        singularLabel="Campus"
                    />
                    
                    {/* Industry Filter - only show if industries exist */}
                    {industries.length > 0 && (
                        <TaxonomyFilter 
                            items={industries}
                            taxonomyKey="industry"
                            label="Industries"
                            singularLabel="Industry"
                        />
                    )}
                </div>

                {/* Posts Grid */}
                <div id="body" className="flex-none w-full md:w-3/4 px-4">
                    <div id="programs-results" className="text-xl mb-4">
                        {total} {total === 1 ? 'Result' : 'Results'}
                        {(search || campus || industry) && (
                            <span className="text-gray-600 text-base ml-2">
                                {search && `for "${search}"`}
                                {search && (campus || industry) && " "}
                                {(campus || industry) && `in selected filters`}
                            </span>
                        )}
                    </div>
                    <div id="programs-list" className="py-6">
                        {programs.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-8">
                                {programs.map((program) => (
                                    <ProgramCard
                                        key={program.id}
                                        program={program}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
                                <p>{t('noResults')}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination */}
                    <ProgramPagination 
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                    />
                </div>
            </Container>
        </Section>
    );
}