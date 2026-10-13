import { getPlayerId } from "./player-id";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

/** Single entry point for HTTP calls: base URL, player header and error mapping live here. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Player-Id": getPlayerId(),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่", 0);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่", res.status);
  }

  return res.status === 204 ? (undefined as T) : res.json();
}
