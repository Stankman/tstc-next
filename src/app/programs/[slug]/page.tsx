import { Container, Prose, Section } from "../../../components/craft";
import { getPostsPaginated } from "../../../lib/wordpress";

export default async function Page({ searchParams } : {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>
}) {
    const params = await searchParams;
    const { page: pageParam, search } = params;

    //Handle Pagination
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const resultsPerPage = 10;

    //Fetch data based on search parameters using efficient pagination
    const [postsResponse] = await Promise.all([
        getPostsPaginated(page, resultsPerPage),
    ]);

    const { data: posts, headers } = postsResponse;
    const { total, totalPages } = headers;

    return (
        <Section>
            <Container>
                <div className="space-y-8">
                    <Prose>
                        <h2>All Posts</h2>
                        <p className="text-muted-foreground">{total} {total === 1 ? "post" : "posts"} found {search && " matching your search"}</p>
                    </Prose>

                    {posts.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <div
                                dangerouslySetInnerHTML={{
                                __html: post.title?.rendered || "Untitled Post",
                                }}
                                className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
                            ></div>
                        ))}
                        </div>
                    ) : (
                        <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
                        <p>No posts found</p>
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
};