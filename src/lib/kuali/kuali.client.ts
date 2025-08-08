import type { KualiProgram } from "./kuali.d";

export async function fetchProgramForUi(programId: string): Promise<KualiProgram | null> {
  const response = await fetch(`/api/kuali/programs/${programId}`, { cache: "no-store" });

  if (!response.ok) return null;

  return response.json();
}

export async function fetchLocationsBatchForUi(locationIds: string[]): Promise<Array<{id: string; name: string; slug: string}>> {
  const response = await fetch(`/api/kuali/locations`, {
    method: "POST",
    body: JSON.stringify({ ids: locationIds }),
  });

  if (!response.ok) return [];

  return response.json();
}