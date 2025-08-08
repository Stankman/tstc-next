import querystring from "query-string";

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

export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

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

async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  console.log(url);

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
    [key: string]: any;
  }
): Promise<WordPressResponse<T[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", postTypeSlug];

  if (filterParams) {
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
          query[key] = value;
          cacheTags.push(`${postTypeSlug}-${key}-${value}`);
      }
    });
  }

  cacheTags.push(`${postTypeSlug}-page-${page}`);

  return wordpressFetchWithPagination<T[]>(`/wp-json/wp/v2/${postTypeSlug}`, query);
}

export async function getAllItems<T>(
  postTypeSlug: string,
  filterParams?: {
    [key: string]: any;
  }
): Promise<T[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams) {
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        query[key] = value;
      }
    });
  }

  return wordpressFetch<T[]>(`/wp-json/wp/v2/${postTypeSlug}`, query);
}

export async function getItemById<T>(postTypeSlug: string, id: number): Promise<T> {
  return wordpressFetch<T>(`/wp-json/wp/v2/${postTypeSlug}/${id}`);
}

export async function getItemBySlug<T>(postTypeSlug: string, slug: string): Promise<T> {
  return wordpressFetch<T[]>(`/wp-json/wp/v2/${postTypeSlug}`, { slug }).then(
    (items) => items[0]
  );
}

export async function searchItems<T>(postTypeSlug: string, query: string): Promise<T> {
  return wordpressFetch<T>(`/wp-json/wp/v2/${postTypeSlug}`, {
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

export { WordPressAPIError };