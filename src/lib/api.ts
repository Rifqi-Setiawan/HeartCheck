export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || "http://127.0.0.1:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

/** POST multipart/form-data to /diagnose/ecg */
export async function postDiagnoseECG(form: FormData) {
  const res = await fetch(`${API_BASE}/diagnose/ecg`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = (await res.json()) as { detail?: unknown };
      if (j?.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* ignore */
    }
    throw new ApiError(msg, res.status);
  }
  return (await res.json()) as {
    total_segments: number;
    counts: Record<"L" | "N" | "Q" | "R" | "V", number>;
  };
}
