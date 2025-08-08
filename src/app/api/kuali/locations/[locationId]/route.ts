import { NextRequest, NextResponse } from "next/server";
import { getLocationByIdCached } from "@/lib/kuali/kuali.server";
import type { KualiLocation } from "@/lib/kuali/kuali";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  try {
    const { locationId } = await params;
    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const kualiLocation = await getLocationByIdCached(locationId);
    
    if (!kualiLocation) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const location: KualiLocation = {
      id: kualiLocation.id,
      name: kualiLocation.name,
      ByOiUw4q_: kualiLocation.ByOiUw4q_ ?? ""
    };

    const response = NextResponse.json(location);

    response.headers.set(
      "Cache-Control",
      "public, s-max-age=3600, stale-while-revalidate=86400"
    );

    return response;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (/404/.test(message)) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    console.error("[Kuali] location lookup failed:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}