import { NextResponse } from "next/server";
import { getLocationTypesCached } from "@/lib/kuali/kuali.server";
import { KualiLocation } from "@/lib/kuali/kuali";

export async function GET() {
  try {
    const raw = await getLocationTypesCached();

    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({ error: "No location types found" }, { status: 404 });
    }

    const location: KualiLocation[] = raw.map((location: any) => ({
      id: location.id,
      name: location.name ?? "",
      ByOiUw4q_: location.ByOiUw4q_,
    }));

    const response = NextResponse.json(location);

    response.headers.set(
      "Cache-Control",
      "public, s-max-age=3600, stale-while-revalidate=86400"
    );
    
    return response;
  } catch (error) {
    console.error("[Kuali] location types fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch location types" }, { status: 500 });
  }
}