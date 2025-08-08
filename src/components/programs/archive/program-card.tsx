import { getFeaturedMediaById } from "@/lib/wordpress/media/wp-media";
import { Program } from "@/lib/wordpress/wordpress.d";
import Image from "next/image";
import { LoadingLink } from "@/components/global/loading-overlay";

export async function ProgramCard({ program } : { program: Program}) {
    const featuredImage = program.featured_media ? await getFeaturedMediaById(program.featured_media) : null;
    return (
        <LoadingLink
            href={`/programs/${program.slug}`}
            className="group rounded overflow-hidden"
        >
            <div className="mb-2 overflow-hidden h-[230px]">
                {featuredImage?.source_url ?
                    (
                        <Image
                            src={featuredImage.source_url}
                            alt={featuredImage.alt_text}
                            width={featuredImage.media_details.width}
                            height={featuredImage.media_details.height}
                            className="object-cover object-top w-full h-full rounded group-hover:scale-115 transform transition-transform duration-500"
                        />
                    ) : (
                        <div>
                            No Image Available
                        </div>
                    )}
            </div>
            <div className="text-xl font-semibold">
                <div dangerouslySetInnerHTML={{ __html: program.title?.rendered || "Untitled Program" }} />
            </div>
            <div className="text-sm">
                {program.acf.short_description || "No description available."}
            </div>
        </LoadingLink>
    );
}