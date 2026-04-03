export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  raw: string | null;
}

export async function apiCall<T>(
  fn: () => Promise<T>,
): Promise<ApiResult<T>> {
  try {
    const data = await fn();
    return { data, error: null, raw: null };
  } catch (err: any) {
    const raw = err?.message ?? "";
    const message = raw || "알 수 없는 오류가 발생했습니다.";
    return { data: null, error: message, raw };
  }
}
