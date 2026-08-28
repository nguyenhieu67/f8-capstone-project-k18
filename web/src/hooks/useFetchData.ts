/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      //  Truyền vào 1 hàm đơn
      if (typeof fetchTarget === "function") {
        const res = await fetchTarget();
        setData(res);
      }
      // Truyền vào Object { employees: getA, courses: getB }
      else if (typeof fetchTarget === "object" && fetchTarget !== null) {
        const fetchMap = fetchTarget as FetchMap;
        const keys = Object.keys(fetchMap);
        const results = await Promise.all(keys.map((key) => fetchMap[key]()));
        const mappedData = keys.reduce(
          (acc, key, i) => {
            acc[key] = results[i];
            return acc;
          },
          {} as Record<string, any>,
        );
        setData(mappedData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, refetch: fetchData };
}
