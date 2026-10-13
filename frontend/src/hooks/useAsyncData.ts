"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

const toErrorState = (e: unknown) =>
  ({ status: "error", error: getErrorMessage(e, "โหลดข้อมูลไม่สำเร็จ") }) as const;

/** Loads data on mount and exposes loading / error / success plus reload helpers. */
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let ignore = false;
    fetcher().then(
      (data) => !ignore && setState({ status: "success", data }),
      (e) => !ignore && setState(toErrorState(e)),
    );
    return () => {
      ignore = true;
    };
  }, [fetcher]);

  /** Re-fetch in the background, keeping current data on screen (after an action). */
  const refresh = useCallback(async () => {
    try {
      setState({ status: "success", data: await fetcher() });
    } catch (e) {
      setState(toErrorState(e));
    }
  }, [fetcher]);

  /** Re-fetch showing the loading state (retry after an error). */
  const reload = useCallback(() => {
    setState({ status: "loading" });
    return refresh();
  }, [refresh]);

  return { state, reload, refresh };
}
