/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";

type AsyncFn = () => Promise<any>;
type FetchMap = Record<string, AsyncFn>;

type InferMapResults<T extends FetchMap> = {
  [K in keyof T]: T[K] extends () => Promise<infer R> ? R : never;
};

//  Overload: 1 hàm API
export default function useFetchData<T>(
  fetchFn: () => Promise<T>,
  deps?: any[],
): {
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  loading: boolean;
  refetch: () => Promise<void>;
};

//  Overload: Object nhiều hàm API (theo Key)
export default function useFetchData<T extends FetchMap>(
  fetchFnsMap: T,
  deps?: any[],
): {
  data: InferMapResults<T> | null;
  setData: React.Dispatch<React.SetStateAction<InferMapResults<T> | null>>;
  loading: boolean;
  refetch: () => Promise<void>;
};

export default function useFetchData(
  fetchTarget: AsyncFn | readonly AsyncFn[] | FetchMap,
  deps: any[] = [],
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const latestRequest = useRef(0);

  const fetchData = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    try {
      let result: any;
      let hasResult = false;
      //  Truyền vào 1 hàm đơn
      if (typeof fetchTarget === "function") {
        result = await fetchTarget();
        hasResult = true;
      }
      // Truyền vào Object { employees: getA, courses: getB }
      else if (typeof fetchTarget === "object" && fetchTarget !== null) {
        const fetchMap = fetchTarget as FetchMap;
        const keys = Object.keys(fetchMap);
        const results = await Promise.all(keys.map((key) => fetchMap[key]()));
        hasResult = true;
        result = keys.reduce(
          (acc, key, i) => {
            acc[key] = results[i];
            return acc;
          },
          {} as Record<string, any>,
        );
      }

      if (requestId !== latestRequest.current) return;
      if (hasResult) setData(result);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, refetch: fetchData };
}
