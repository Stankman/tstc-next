// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
  Campus,
  Industry,
  Schedule,
  Award,
  Program,
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getItemsPaginated<T>(
  postTypeSlug: string,
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    campus?: string;
    industry?: string;
    search?: string;
  }
): Promise<WordPressResponse<T[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", postTypeSlug];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push(`${postTypeSlug}-search`);
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`${postTypeSlug}-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`${postTypeSlug}-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    // Support comma-separated category IDs for multiple category filtering
    const categoryIds = filterParams.category.split(',').filter(Boolean);
    if (categoryIds.length > 0) {
      query.categories = categoryIds.join(',');
      cacheTags.push(`${postTypeSlug}-category-${filterParams.category}`);
    }
  }
  if (filterParams?.campus) {
    // Support comma-separated campus IDs for multiple campus filtering
    const campusIds = filterParams.campus.split(',').filter(Boolean);
    if (campusIds.length > 0) {
      query.campus = campusIds.join(',');
      cacheTags.push(`${postTypeSlug}-campus-${filterParams.campus}`);
    }
  }
  if (filterParams?.industry) {
    // Support comma-separated industry IDs for multiple industry filtering
    const industryIds = filterParams.industry.split(',').filter(Boolean);
    if (industryIds.length > 0) {
      query.industry = industryIds.join(',');
      cacheTags.push(`${postTypeSlug}-industry-${filterParams.industry}`);
    }
  }

  cacheTags.push(`${postTypeSlug}-page-${page}`);

  const url = `${baseUrl}/wp-json/wp/v2/${postTypeSlug}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  console.log(url);

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  return getItemsPaginated<Post>('posts', page, perPage, filterParams);
}

export async function getProgramsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    campus?: string;
    industry?: string;
    search?: string;
  }
): Promise<WordPressResponse<Program[]>> {
  return getItemsPaginated<Program>('program', page, perPage, filterParams);
}

export async function getAllItems<T>(
  postTypeSlug: string,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<T[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  return wordpressFetch<T[]>(`/wp-json/wp/v2/${postTypeSlug}`, query);
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  return getAllItems<Post>('posts', filterParams);
}

export async function getAllPages(): Promise<Page[]> {
  return getAllItems<Page>('pages');
}

export async function getAllPrograms(): Promise<Program[]> {
  return getAllItems<Program>('program');
}

export async function getAllCampuses(): Promise<Campus[]> {
  return getAllItems<Campus>('campus');
}

export async function getAllIndustries(): Promise<Industry[]> {
  return getAllItems<Industry>('industry');
}

export async function getAllSchedules(): Promise<Schedule[]> {
  return getAllItems<Schedule>("schedule");
}

export async function getAllAwards(): Promise<Award[]> {
  return getAllItems<Award>("award");
}

export async function getItemById<T>(postTypeSlug: string, id: number): Promise<T> {
  return wordpressFetch<T>(`/wp-json/wp/v2/${postTypeSlug}/${id}`);
}

export async function getPageById(id: number): Promise<Page> {
  return getItemById<Page>("pages", id);
}

export async function getProgramById(id: number): Promise<Program> {
  return getItemById<Program>("program", id);
}

export async function getCampusById(id: number): Promise<Campus> {
  return getItemById<Campus>("campus", id);
}

export async function getIndustryById(id: number): Promise<Industry> {
  return getItemById<Industry>("industry", id);
}

export async function getScheduleById(id: number): Promise<Schedule> {
  return getItemById<Schedule>("schedule", id);
}

export async function getAwardById(id: number): Promise<Award> {
  return getItemById<Award>("award", id);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return getItemById<FeaturedMedia>("media", id);
}

export async function getItemBySlug<T>(postTypeSlug: string, slug: string): Promise<T> {
  return wordpressFetch<T[]>(`/wp-json/wp/v2/${postTypeSlug}`, { slug }).then(
    (items) => items[0]
  );
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return getItemBySlug<Page>("pages", slug);
}

export async function getProgramBySlug(slug: string): Promise<Program> {
  return getItemBySlug<Program>("program", slug);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return getItemBySlug<Post>("posts", slug);
}
  
export async function getCampusBySlug(slug: string): Promise<Campus> {
  return getItemBySlug<Campus>("campus", slug);
}
  
export async function getIndustryBySlug(slug: string): Promise<Industry> {
  return getItemBySlug<Industry>("industry", slug);
}

export async function getScheduleBySlug(slug: string): Promise<Schedule> {
  return getItemBySlug<Schedule>("schedule", slug);
}

export async function getAwardBySlug(slug: string): Promise<Award> {
  return getItemBySlug<Award>("award", slug);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchCampuses(query: string): Promise<Campus[]> {
  return wordpressFetch<Campus[]>("/wp-json/wp/v2/campuses", {
    search: query,
    per_page: 100,
  });
}

export async function getAllItemSlugs(postTypeSlug: string): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<any[]>(
      `/wp-json/wp/v2/${postTypeSlug}`,
      {
        per_page: 100,
        page,
        _fields: "slug", // Only fetch slug field for performance
      }
    );

    const items = response.data;
    allSlugs.push(...items.map((item) => ({ slug: item.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  return getAllItemSlugs('posts');
}

export async function getAllProgramsSlugs(): Promise<{ slug: string }[]> {
  return getAllItemSlugs('program');
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export { WordPressAPIError };