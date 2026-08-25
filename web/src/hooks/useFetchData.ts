/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

export default function useFetchData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchFn();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, refetch: fetchData };
}
